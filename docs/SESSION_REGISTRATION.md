# Event Session Registration Guide

This guide explains how to rebuild the event session registration experience using the ConnectedXM Client SDK. Session registration allows users to purchase a pass for a specific event session (e.g., a workshop, breakout, or add-on session).

## Overview

The session registration flow consists of four main steps:

1. **Load questions** – Fetch the registration questions/sections for the session pass
2. **Update responses** – Submit answers to persist them (PUT)
3. **Get payment intent** – Fetch the payment intent with billing address (GET)
4. **Capture payment** – Process the payment using the payment provider (Braintree), then capture the intent

## Prerequisites

- User must be **authenticated**
- User must have an **address** (`addressId`) for billing
- Context: `eventId`, `sessionId`, and `passId` (the pass type being registered for)

## SDK Hooks & Mutations

### 1. Load Registration Questions

Use `useGetEventSessionPassSections` to fetch the questions/sections the user must complete before registration.

```tsx
import { useGetEventSessionPassSections } from "@connected/client-sdk";

function SessionRegistrationForm({ eventId, sessionId, passId }) {
  const { data, isLoading } = useGetEventSessionPassSections(
    eventId,
    sessionId,
    passId
  );

  const sections = data?.data ?? [];

  if (isLoading) return <Spinner />;

  return (
    <form>
      {sections.map((section) => (
        <Section key={section.id} section={section} />
      ))}
    </form>
  );
}
```

**Response shape:** `EventSessionSection[]` — each section has `id`, `name`, `description`, and `questions` (array of `EventSessionQuestion`).

### 2. Update Responses

Use `useUpdateEventSessionPassResponses` to persist the user's answers before proceeding to payment.

```tsx
import { useUpdateEventSessionPassResponses } from "@connected/client-sdk";

function SessionRegistrationForm({ eventId, sessionId, passId, responses }) {
  const { mutate: updateResponses, isPending } =
    useUpdateEventSessionPassResponses({
      onSuccess: (response) => {
        if (response.status === "ok") {
          // Responses saved — proceed to payment step
          onResponsesSaved();
        }
      },
      onError: (error) => {
        // Handle API error
      },
    });

  const handleSubmit = () => {
    updateResponses({
      eventId,
      sessionId,
      passId,
      responses: responses.map((r) => ({
        questionId: r.questionId,
        value: r.value,
      })),
    });
  };

  return (
    <button onClick={handleSubmit} disabled={isPending}>
      {isPending ? "Saving..." : "Continue to Payment"}
    </button>
  );
}
```

**Parameters:**

- `eventId` (string) – Event ID
- `sessionId` (string) – Session ID
- `passId` (string) – Pass type ID
- `responses` – `{ questionId: string; value: string }[]` – answers for each required question

### 3. Get Payment Intent

Use `useGetEventSessionPassIntent` to fetch the payment intent (query). Call this after updating responses. The intent is derived from the persisted responses and billing address.

```tsx
import { useGetEventSessionPassIntent } from "@connected/client-sdk";

function SessionCheckout({ eventId, sessionId, passId, addressId }) {
  const { data, isLoading } = useGetEventSessionPassIntent(
    eventId,
    sessionId,
    passId,
    addressId
  );

  const intent = data?.status === "ok" ? data.data : null;

  if (isLoading || !intent) return <Spinner />;

  return (
    <BraintreeDropIn
      clientToken={intent.secret}
      onPaymentMethodReceived={handlePaymentAuthorized}
    />
  );
}
```

**Parameters:**

- `eventId` (string) – Event ID
- `sessionId` (string) – Session ID
- `passId` (string) – Pass type ID
- `addressId` (string) – User's billing address ID

**Note:** Update responses with `useUpdateEventSessionPassResponses` before fetching the intent. The intent reflects the current persisted state.

### 4. Capture Payment

After the user completes payment in your payment UI (e.g., Braintree Drop-in), use `useCapturePaymentIntent` to capture the intent.

```tsx
import { useCapturePaymentIntent } from "@connected/client-sdk";

function PaymentCapture({ intent }) {
  const { mutate: capturePayment } = useCapturePaymentIntent({
    onSuccess: (response) => {
      if (response.status === "ok") {
        // Registration complete — navigate to confirmation
        navigate(`/events/${intent.eventId}/confirmation`);
      }
    },
    onError: (error) => {
      // Handle capture failure
    },
  });

  const handlePaymentAuthorized = (nonce: string) => {
    capturePayment({
      intent,
      paymentDetails: {
        nonce,
        deviceData: braintreeDeviceData, // optional, from Braintree
      },
    });
  };

  return (
    <BraintreeDropIn
      clientToken={intent.secret}
      onPaymentMethodReceived={handlePaymentAuthorized}
    />
  );
}
```

**Parameters:**

- `intent` (PaymentIntent) – The intent returned from `useCreateEventSessionPassIntent`
- `paymentDetails` (optional) – `{ nonce: string; deviceData?: string }` – from your payment provider

## End-to-End Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Session selection                                            │
│    User selects a session (eventId, sessionId, passId known)     │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. Load questions                                                │
│    useGetEventSessionPassSections(eventId, sessionId, passId)    │
│    Render form with EventSessionSection[]                        │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. User fills form & selects address                             │
│    useGetSelfAddresses() for address picker                      │
│    Collect responses: { questionId, value }[]                    │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. Update responses                                              │
│    useUpdateEventSessionPassResponses({ eventId, sessionId,      │
│      passId, responses })                                        │
│    → Persists answers to server                                  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. Get payment intent                                            │
│    useGetEventSessionPassIntent(eventId, sessionId, passId,      │
│      addressId)                                                  │
│    → Returns PaymentIntent from persisted state                  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. Payment UI                                                    │
│    Use intent.secret as Braintree client token                   │
│    User enters card details / payment method                     │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│ 7. Capture payment                                               │
│    useCapturePaymentIntent({ intent, paymentDetails: { nonce } }) │
│    → Registration complete                                       │
└─────────────────────────────────────────────────────────────────┘
```

## Supporting Queries

| Hook                          | Purpose                                                    |
| ----------------------------- | ---------------------------------------------------------- |
| `useGetEventSession`          | Session details (name, description, etc.)                  |
| `useGetEventSessions`         | List sessions for an event (optionally filtered by passId) |
| `useGetSelfAddresses`         | User's saved addresses for billing                         |
| `useGetSelfEventRegistration` | Existing event registration (for context)                  |

## Response Types

### EventSessionSection

```ts
interface EventSessionSection {
  id: string;
  name: string;
  description: string | null;
  questions: EventSessionQuestion[];
}
```

### EventSessionQuestion

```ts
interface EventSessionQuestion {
  id: string;
  type: "text" | "textarea" | "number" | "select" | "multiselect" | ...;
  name: string;
  required: boolean;
  choices?: EventSessionQuestionChoice[];  // for select/multiselect
  price?: number;  // for paid add-ons
  // ...
}
```

### Question Response Format

When building `responses` for `useCreateEventSessionPassIntent`:

```ts
{
  questionId: "question-uuid",
  value: "user answer"  // string — for select, use choice value; for multiselect, consider comma-separated or array serialization per backend
}
```

## Error Handling

- **useGetEventSessionPassSections**: Check `data?.status !== "ok"` and handle `data?.message`
- **useUpdateEventSessionPassResponses**: Use `onError` for network/API errors; validate `response.status === "ok"` before proceeding
- **useGetEventSessionPassIntent**: Check `data?.status !== "ok"` and handle `data?.message`; runs as a query so use `isError` and `error` for error state
- **useCapturePaymentIntent**: Use `onError` for declined cards or capture failures

## Cache Invalidation

- **useUpdateEventSessionPassResponses**: On success, invalidates `EVENT_SESSION_PASS_INTENT_QUERY_KEY` for that pass so the intent is refetched when responses change.
- **useCapturePaymentIntent**: Automatically invalidates relevant queries on success:

  - SELF REGISTRATION
  - SELF ATTENDEE
  - SESSION_REGISTRATION
  - INTENT-related queries (including `useGetEventSessionPassIntent`)

You typically do not need to manually invalidate after a successful capture.
