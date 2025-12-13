/**
 * Centralized mutation input parameter interfaces
 * Following VERSION_8_SPECS.md naming conventions:
 * - *CreateInputs for creating resources
 * - *UpdateInputs for updating resources
 * - *TranslationUpdateInputs for translation updates
 */

import {
  EventType,
  ActivityPreference,
  GroupAccess,
  SupportTicketType,
  ActivityEntityType,
  MarkType,
} from "./interfaces";

// ============================================================================
// Self / Account Inputs
// ============================================================================

export interface SelfUpdateInputs {
  username?: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  bio?: string | null;
  facebook?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  tikTok?: string | null;
  linkedIn?: string | null;
  youtube?: string | null;
  discord?: string | null;
  website?: string | null;
  locale?: string | null;
  termsAccepted?: boolean;
  internalRefId?: string | null;
  attributes?: Record<string, string>;
}

export interface SelfNotificationPreferencesUpdateInputs {
  newFollowerPush?: boolean;
  likePush?: boolean;
  resharePush?: boolean;
  commentPush?: boolean;
  transferPush?: boolean;
  transferEmail?: boolean;
  supportTicketConfirmationEmail?: boolean;
  chatPush?: boolean;
  chatUnreadPush?: boolean;
  chatUnreadEmail?: boolean;
  activityNotificationPreference?: "featured" | "none";
  organizationAnnouncementPush?: boolean;
  organizationAnnouncementEmail?: boolean;
}

export interface SelfGroupMembershipUpdateInputs {
  groupId: string;
  membership?: Record<string, any>;
  activityNotificationPreference?: ActivityPreference;
  announcementPushNotification?: boolean;
  announcementEmailNotification?: boolean;
}

export interface SelfBannerUpdateInputs {
  base64: string;
}

// ============================================================================
// Login Inputs
// ============================================================================

export interface LoginAccountCreateInputs {
  featured?: boolean;
  email: string;
  firstName?: string;
  lastName?: string;
  imageId?: string;
  bannerId?: string;
  username: string;
  phone?: string;
  internalRefId?: string;
  bio?: string;
  website?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  tikTok?: string;
  linkedIn?: string;
  youtube?: string;
  discord?: string;
  locale?: string;
  termsAccepted?: Date;
  attributes?: Record<string, string>;
}

export interface AddLoginInputs {
  username: string;
}

// ============================================================================
// Address Inputs
// ============================================================================

export interface AddressCreateInputs {
  [key: string]: any; // TODO: Define proper structure when API schema is available
}

export interface AddressUpdateInputs {
  [key: string]: any; // TODO: Define proper structure when API schema is available
}

// ============================================================================
// Chat Inputs
// ============================================================================

export interface ChatChannelCreateInputs {
  name: string;
  accountIds: string[];
}

export interface ChatChannelMessageCreateInputs {
  text: string;
}

export interface ChatChannelNotificationsUpdateInputs {
  notifications: boolean;
}

export interface ChatChannelMemberAddInputs {
  accountId: string;
}

// ============================================================================
// Lead Inputs
// ============================================================================

export interface LeadCreateInputs {
  // No inputs - passId is passed as a parameter, not in the body
}

export interface LeadUpdateInputs {
  [key: string]: any; // TODO: Define proper structure when API schema is available
}

// ============================================================================
// Event Registration Inputs
// ============================================================================

export interface EventAttendeeUpdateInputs {
  activityNotificationPreference?: ActivityPreference;
  announcementPushNotification?: boolean;
  announcementEmailNotification?: boolean;
}

export interface EventRegistrationAddOnsUpdateInputs {
  eventId: string;
  passes: Array<{
    id: string;
    passAddOns: Array<{
      id: string;
      addOnId: string;
    }>;
  }>;
}

export interface EventRegistrationPassesUpdateInputs {
  eventId: string;
  passes: Array<{
    passTypeId: string;
    quantity: number;
  }>;
}

export interface EventRegistrationPassResponseUpdateInputs {
  eventId: string;
  passTypeId: string;
  questionId: string;
  response: string | null;
}

export interface EventRegistrationResponsesUpdateInputs {
  eventId: string;
  responses: Array<{
    questionId: string;
    response: string | null;
  }>;
}

export interface EventRegistrationReservationsUpdateInputs {
  eventId: string;
  reservations: Array<{
    passTypeId: string;
    sessionIds: string[];
  }>;
}

export interface EventRegistrationSearchListResponseUpdateInputs {
  eventId: string;
  searchListId: string;
  response: string | null;
}

export interface EventRegistrationCouponApplyInputs {
  eventId: string;
  couponCode: string;
}

// ============================================================================
// Event Session Registration Inputs
// ============================================================================

export interface EventSessionRegistrationPassesUpdateInputs {
  eventId: string;
  sessionId: string;
  passes: Array<{
    passTypeId: string;
    quantity: number;
  }>;
}

export interface EventSessionRegistrationPassResponseUpdateInputs {
  eventId: string;
  sessionId: string;
  passTypeId: string;
  questionId: string;
  response: string | null;
}

export interface EventSessionRegistrationResponsesUpdateInputs {
  eventId: string;
  sessionId: string;
  responses: Array<{
    questionId: string;
    response: string | null;
  }>;
}

export interface EventSessionRegistrationSearchListResponseUpdateInputs {
  eventId: string;
  sessionId: string;
  searchListId: string;
  response: string | null;
}

// ============================================================================
// Event Attendee Inputs
// ============================================================================

export interface EventAttendeePassFollowupUpdateInputs {
  eventId: string;
  passId: string;
  followupId: string;
  response: string | null;
}

export interface EventAttendeePassResponsesUpdateInputs {
  eventId: string;
  passId: string;
  responses: Array<{
    questionId: string;
    response: string | null;
  }>;
}

export interface EventAttendeeAccessResponsesUpdateInputs {
  eventId: string;
  sessionId: string;
  passId: string;
  responses: Array<{
    questionId: string;
    response: string | null;
  }>;
}

// ============================================================================
// Listing Inputs
// ============================================================================

export interface ListingCreateInputs {
  eventType: keyof typeof EventType;
  visible: boolean;
  name: string;
  shortDescription: string;
  eventStart: string;
  eventEnd: string;
  timezone: string;
  venue?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  externalUrl?: string;
  registration?: boolean;
  registrationLimit?: number | null;
  groupOnly?: boolean;
}

export interface ListingUpdateInputs {
  eventType?: keyof typeof EventType;
  visible?: boolean;
  name?: string;
  shortDescription?: string;
  longDescription?: string | null;
  eventStart?: string;
  eventEnd?: string;
  timezone?: string | null;
  venue?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  country?: string | null;
  externalUrl?: string | null;
  registration?: boolean;
  publicRegistrants?: boolean;
  registrationLimit?: number | null;
  newActivityCreatorEmailNotification?: boolean;
  newActivityCreatorPushNotification?: boolean;
  slug?: string;
  groupOnly?: boolean;
  groupId?: string | null;
  location?: string | null;
}

export interface ListingSpeakerCreateInputs {
  firstName: string | null;
  lastName: string | null;
  title: string | null;
  company: string | null;
  bio: string | null;
}

export interface ListingSpeakerUpdateInputs {
  firstName: string | null;
  lastName: string | null;
  title: string | null;
  company: string | null;
  bio: string | null;
}

export interface ListingSessionCreateInputs {
  name: string;
  description: string;
  startTime: Date;
  endTime: Date;
}

export interface ListingSessionUpdateInputs {
  name: string;
  description: string;
  startTime: Date;
  endTime: Date;
}

export interface ListingEmailUpdateInputs {
  email: {
    body?: string;
    replyTo?: string;
  };
}

export interface ListingAttendeePassResponsesUpdateInputs {
  responses: Array<{
    questionId: string;
    response: string | null;
  }>;
}

export interface ListingQuestionCreateInputs {
  name: string;
  type: string;
  required: boolean;
  mutable: boolean;
  choices: {
    id: string | null;
    value: string;
  }[];
}

export interface ListingQuestionUpdateInputs {
  name: string;
  required: boolean;
  mutable: boolean;
  sortOrder?: number;
  choices: {
    id: string | null;
    value: string;
  }[];
}

export interface ListingAnnouncementCreateInputs {
  title: string;
  html: string;
  email: boolean;
  push: boolean;
}

// ============================================================================
// Activity Inputs
// ============================================================================

export interface BaseActivityEntityInput {
  type: ActivityEntityType;
  startIndex: number;
  endIndex: number;
  marks: MarkType[];
}

export interface MentionInput extends BaseActivityEntityInput {
  type: ActivityEntityType.mention;
  accountId: string;
}

export interface LinkInput extends BaseActivityEntityInput {
  type: ActivityEntityType.link;
  href: string;
}

export interface InterestInput extends BaseActivityEntityInput {
  type: ActivityEntityType.interest;
  interestId: string;
}

export interface SegmentInput extends BaseActivityEntityInput {
  type: ActivityEntityType.segment;
}

export type ActivityEntityInput =
  | MentionInput
  | LinkInput
  | InterestInput
  | SegmentInput;

export interface ActivityCreateInputs {
  message: string;
  entities: ActivityEntityInput[];
  imageId?: string;
  videoId?: string;
  eventId?: string;
  groupId?: string;
  contentId?: string;
  commentedId?: string;
}

export interface ActivityUpdateInputs {
  message?: string;
  entities?: ActivityEntityInput[];
  imageId?: string;
  videoId?: string;
}

// ============================================================================
// Group Inputs
// ============================================================================

export interface GroupCreateInputs {
  name: string;
  description: string;
  access: keyof typeof GroupAccess;
  active: boolean;
  externalUrl?: string;
}

export interface GroupUpdateInputs {
  name?: string;
  active?: boolean;
  description?: string;
  externalUrl?: string;
  access?: "public" | "private";
}

export interface GroupAnnouncementCreateInputs {
  title: string;
  html: string;
  email: boolean;
  push: boolean;
}

export interface GroupInvitationsCreateInputs {
  accountIds: string[];
}

// ============================================================================
// Channel Inputs
// ============================================================================

export interface ChannelCreateInputs {
  name: string;
  description?: string;
  visible: boolean;
  groupId?: string;
}

export interface ChannelUpdateInputs {
  name?: string;
  description?: string;
  visible?: boolean;
  slug?: string;
  groupId?: string | null;
  externalUrl?: string | null;
  appleUrl?: string | null;
  spotifyUrl?: string | null;
  googleUrl?: string | null;
  youtubeUrl?: string | null;
}

export interface ChannelSubscriberCreateInputs {
  // No inputs - channelId is passed as a parameter, not in the body
}

export interface ChannelSubscriberUpdateInputs {
  contentEmailNotification?: boolean;
  contentPushNotification?: boolean;
  activityNotificationPreference?: ActivityPreference;
}

export interface ChannelInterestCreateInputs {
  name: string;
}

// ============================================================================
// Channel Content Inputs
// ============================================================================

export interface ChannelContentCreateInputs {
  title: string;
  description?: string | null;
  duration?: string | null;
  body?: string | null;
  externalUrl?: string | null;
  appleUrl?: string | null;
  spotifyUrl?: string | null;
  googleUrl?: string | null;
  youtubeUrl?: string | null;
}

export interface ChannelContentUpdateInputs {
  title?: string;
  description?: string | null;
  duration?: string | null;
  body?: string | null;
  externalUrl?: string | null;
  appleUrl?: string | null;
  spotifyUrl?: string | null;
  googleUrl?: string | null;
  youtubeUrl?: string | null;
  videoId?: string | null;
  audioId?: number | null;
  slug?: string;
  email?: boolean;
  push?: boolean;
}

export interface ContentPublishScheduleSetInputs {
  date: string;
  email?: boolean;
  push?: boolean;
}

export interface ContentGuestCreateInputs {
  accountId?: string | null;
  name: string;
  title: string | null;
  bio: string | null;
  company: string | null;
  companyLink: string | null;
  companyBio: string | null;
  website: string | null;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  linkedIn: string | null;
  tikTok: string | null;
  youtube: string | null;
  discord: string | null;
}

export interface ContentGuestUpdateInputs {
  accountId?: string | null;
  name: string;
  title: string | null;
  bio: string | null;
  company: string | null;
  companyLink: string | null;
  companyBio: string | null;
  website: string | null;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  linkedIn: string | null;
  tikTok: string | null;
  youtube: string | null;
  discord: string | null;
}

export interface ContentInterestCreateInputs {
  name: string;
}

// ============================================================================
// Channel Collection Inputs
// ============================================================================

export interface ChannelCollectionCreateInputs {
  collection: {
    name: string;
    description?: string | null;
  };
}

export interface ChannelCollectionUpdateInputs {
  collection: {
    name?: string;
    description?: string | null;
  };
}

// ============================================================================
// Storage Inputs
// ============================================================================

export interface ImageCreateInputs {
  type: "activity" | "thread" | "content";
  dataUri: string;
  name?: string;
  description?: string;
}

export interface FileUploadInputs {
  dataUri: string;
  name?: string;
}

// ============================================================================
// Interest Inputs
// ============================================================================

export interface InterestCreateInputs {
  name: string;
}

// ============================================================================
// Support Ticket Inputs
// ============================================================================

export interface SupportTicketCreateInputs {
  type: keyof typeof SupportTicketType;
  email: string;
  request: string;
  eventId?: string;
  productId?: string;
}

// ============================================================================
// Survey Inputs
// ============================================================================

export interface SurveySearchListResponseUpdateInputs {
  surveyId: string;
  submissionId: string;
  questionId: string;
  searchListValueId: string;
}

// ============================================================================
// Thread Inputs
// ============================================================================

export interface ThreadMessageCreateInputs {
  threadId: string;
  body: string;
  entities: any[];
}

export interface ThreadMessageUpdateInputs {
  threadId: string;
  messageId: string;
  body?: string;
}

export interface ThreadCircleCreateInputs {
  threadId: string;
  name: string;
}

export interface ThreadCircleUpdateInputs {
  circleId: string;
  name?: string;
}

export interface ThreadCircleAccountCreateInputs {
  circleId: string;
  accountId: string;
  role?: string;
}

export interface ThreadCircleAccountUpdateInputs {
  circleId: string;
  accountId: string;
  role?: string;
}

export interface ThreadUpdateInputs {
  threadId: string;
  subject?: string;
  imageId?: string | null;
}

// ============================================================================
// Organization Inputs
// ============================================================================

export interface PaymentIntentCaptureInputs {
  intent: {
    id: string;
    eventId?: string;
    invoiceId?: string;
    bookingId?: string;
  };
  paymentDetails?: {
    nonce: string;
    deviceData?: string;
  };
}

// ============================================================================
// Meeting Inputs
// ============================================================================

export interface MeetingJoinViaCodeInputs {
  meetingId: string;
  code: string;
}

export interface MeetingJoinViaEventInputs {
  meetingId: string;
  eventId: string;
}

export interface MeetingJoinViaGroupInputs {
  meetingId: string;
  groupId: string;
}

// ============================================================================
// Booking Inputs
// ============================================================================

export interface BookingDraftInputs {
  placeId: string;
  spaceId: string;
  day: string;
  time: string;
}
