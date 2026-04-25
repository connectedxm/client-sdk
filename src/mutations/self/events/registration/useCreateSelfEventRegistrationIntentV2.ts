import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse, PaymentIntent } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { SELF_EVENT_REGISTRATION_INTENT_QUERY_KEY } from "@src/queries";

export interface CreateSelfEventRegistrationIntentV2Params
  extends MutationParams {
  eventId: string;
  draftId: string;
  addressId?: string;
  split?: boolean;
}

export const CreateSelfEventRegistrationIntentV2 = async ({
  eventId,
  draftId,
  addressId,
  split,
  clientApiParams,
  queryClient,
}: CreateSelfEventRegistrationIntentV2Params): Promise<
  ConnectedXMResponse<PaymentIntent>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<PaymentIntent>>(
    `/self/events/${eventId}/registration/v2/draft/${draftId}/intent`,
    { addressId, split: !!split }
  );

  // Seed the intent query cache so any active useGetSelfEventRegistrationIntent
  // observers hydrate without an extra round-trip.
  if (queryClient && data.status === "ok") {
    queryClient.setQueryData(
      [
        ...SELF_EVENT_REGISTRATION_INTENT_QUERY_KEY(eventId, addressId, split),
        clientApiParams.locale,
      ],
      data
    );
  }

  return data;
};

export const useCreateSelfEventRegistrationIntentV2 = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateSelfEventRegistrationIntentV2>>,
      Omit<
        CreateSelfEventRegistrationIntentV2Params,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateSelfEventRegistrationIntentV2Params,
    Awaited<ReturnType<typeof CreateSelfEventRegistrationIntentV2>>
  >(CreateSelfEventRegistrationIntentV2, options);
};
