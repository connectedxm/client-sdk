import {
  AccountType,
  ContentGuestType,
  ContentType,
  EventType,
  GroupAccess,
  RegistrationQuestionType,
  SupportTicketType,
  ThreadAccessLevel,
} from "./interfaces";

export interface AccountCreateParams {
  accountType: keyof typeof AccountType;
  featured: boolean | null;
  email: string;
  firstName: string | null;
  lastName: string | null;
  imageId: string | null;
  username: string;
  phone: string | null;
  title: string | null;
  company: string | null;
  bio: string | null;
  website: string | null;
  video: string | null;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  tikTok: string | null;
  linkedIn: string | null;
  youtube: string | null;
  discord: string | null;
  dietaryRestrictions: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zip: string | null;
}

export interface AccountUpdateParams {
  accountType: keyof typeof AccountType | null;
  featured: boolean | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  imageId: string | null;
  username: string | null;
  phone: string | null;
  title: string | null;
  company: string | null;
  bio: string | null;
  website: string | null;
  video: string | null;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  tikTok: string | null;
  linkedIn: string | null;
  youtube: string | null;
  discord: string | null;
  dietaryRestrictions: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zip: string | null;
}

export interface ActivityCreateParams {
  message: string;
  giphyId?: string | null;
  imageId?: string | null;
  eventId?: string | null;
  groupId?: string | null;
  contentId?: string | null;
  commentedId?: string | null;
  videoId?: string | null;
}

export interface ActivityUpdateParams {
  message?: string | null;
  giphyId?: string | null;
  imageId?: string | null;
  eventId?: string | null;
  groupId?: string | null;
  contentId?: string | null;
  commentedId?: string | null;
  videoId?: string | null;
}

export interface AdvertisementCreateParams {}

export interface AdvertisementUpdateParams {}

export interface AnnouncementCreateParams {
  creatorId?: string | null;
  eventId?: string | null;
  groupId?: string | null;
  accountId?: string | null;
  ticketId?: string | null;
  sponsorshipLevelId?: string | null;
  title?: string | null;
  slug?: string | null;
  html?: string | null;
  email: boolean;
  push: boolean;
}

export interface BenefitCreateParams {}

export interface BenefitTranslationUpdateParams {}

export interface BenefitUpdateParams {}

export interface ChannelCollectionCreateParams {
  name: string;
  description?: string | null;
}

export interface ChannelCollectionTranslationUpdateParams {}

export interface ChannelCollectionUpdateParams {
  name?: string | null;
  description?: string | null;
}

export interface ChannelCreateParams {
  name: string;
  slug?: string | null;
  description?: string | null;
  visible: boolean;
  imageId: string;
  externalUrl?: string | null;
  appleUrl?: string | null;
  spotifyUrl?: string | null;
  googleUrl?: string | null;
  youtubeUrl?: string | null;
  groupId?: string | null;
}

export interface ChannelSubscriberUpdateParams {
  contentEmailNotification?: boolean | null;
  contentPushNotification?: boolean | null;
}

export interface ChannelTranslationUpdateParams {}

export interface ChannelUpdateParams {
  name?: string | null;
  slug?: string | null; // Assuming validSlug is a custom validation function, not directly translatable to TypeScript
  description?: string | null;
  imageId?: string | null;
  externalUrl?: string | null;
  appleUrl?: string | null;
  spotifyUrl?: string | null;
  googleUrl?: string | null;
  youtubeUrl?: string | null;
  groupId?: string | null;
}

export interface ContentCreateParams {
  type: keyof typeof ContentType;
  published?: string | null;
  channelId?: string | null;
  visible?: boolean | null;
  title: string;
  slug?: string | null; // Assuming validSlug is a custom validation function, not directly translatable to TypeScript
  description?: string | null;
  duration?: string | null;
  body?: string | null;
  imageUrl?: string | null;
  audioUrl?: string | null;
  videoUrl?: string | null;
  externalUrl?: string | null;
  appleUrl?: string | null;
  spotifyUrl?: string | null;
  googleUrl?: string | null;
  youtubeUrl?: string | null;
}

export interface ContentGuestCreateParams {
  type?: keyof typeof ContentGuestType | null;
  slug?: string | null; // Assuming validSlug is a custom validation function, not directly translatable to TypeScript
  name: string;
  title?: string | null;
  bio?: string | null;
  company?: string | null;
  companyLink?: string | null;
  companyBio?: string | null;
  accountId?: string | null;
  imageId?: string | null;
  website?: string | null;
  facebook?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  linkedIn?: string | null;
  tikTok?: string | null;
  youtube?: string | null;
  discord?: string | null;
}

export interface ContentGuestTranslationUpdateParams {}

export interface ContentGuestUpdateParams {
  type?: keyof typeof ContentGuestType | null;
  slug?: string | null; // Assuming validSlug is a custom validation function, not directly translatable to TypeScript
  name?: string | null;
  title?: string | null;
  bio?: string | null;
  company?: string | null;
  companyLink?: string | null;
  companyBio?: string | null;
  accountId?: string | null;
  imageId?: string | null;
  website?: string | null;
  facebook?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  linkedIn?: string | null;
  tikTok?: string | null;
  youtube?: string | null;
  discord?: string | null;
}

export interface ContentTranslationUpdateParams {}

export interface ContentUpdateParams {
  type?: keyof typeof ContentType | null;
  published?: string | null;
  channelId?: string | null;
  visible?: boolean | null;
  title?: string | null;
  slug?: string | null; // Assuming validSlug is a custom validation function, not directly translatable to TypeScript
  description?: string | null;
  duration?: string | null;
  body?: string | null;
  imageUrl?: string | null;
  audioUrl?: string | null;
  videoUrl?: string | null;
  externalUrl?: string | null;
  appleUrl?: string | null;
  spotifyUrl?: string | null;
  googleUrl?: string | null;
  youtubeUrl?: string | null;
}

export interface EventActivationCreateParams {}

export interface EventActivationUpdateTranslationParams {}

export interface EventActivationUpdateParams {}

export interface EventAddOnCreateParams {}

export interface EventAddOnUpdateTranslationParams {}

export interface EventAddOnUpdateParams {}

export interface EventBadgeFieldUpdateParams {}

export interface EventCouponCreateParams {}

export interface EventCouponUpdateParams {}

export interface EventCreateParams {
  visible?: boolean | null;
  name: string;
  eventType: keyof typeof EventType;
  slug?: string | null;
  shortDescription: string;
  longDescription?: string | null;
  timezone?: string | null;
  eventStart: Date;
  eventEnd: Date;
  externalUrl?: string | null;
  imageId?: string | null;
  venueMapId?: string | null;
  venue?: string | null;
  location?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  zip?: string | null;
  creatorId?: string | null;
  meetingUrl?: string | null;
  registration?: boolean | null;
  registrationStart?: string | null;
  registrationEnd?: string | null;
  registrationLimit?: number | string | null;
  publicRegistrants?: boolean | null;
  newActivityCreatorEmailNotification?: boolean | null;
  newActivityCreatorPushNotification?: boolean | null;
  groupId?: string | null;
  groupOnly?: boolean | null;
}

export interface EventEmailUpdateParams {
  body?: string | null;
  replyTo?: string | null;
}

export interface EventFaqSectionCreateParams {}

export interface EventFaqSectionQuestionCreateParams {}

export interface EventFaqSectionQuestionTranslationUpdateParams {}

export interface EventFaqSectionQuestionUpdateParams {}

export interface EventFaqSectionTranslationUpdateParams {}

export interface EventFaqSectionUpdateParams {}

export interface EventPageCreateParams {}

export interface EventPageTranslationUpdateParams {}

export interface EventPageUpdateParams {}

export interface EventPurchaseCreateParams {}

export interface EventPurchaseUpdateParams {}

export interface EventRegistrationBypassCreateParams {}

export interface EventRegistrationBypassUpdateParams {}

export interface EventRegistrationSectionUpdateTranslationParams {}

export interface EventReservationSectionCreateParams {}

export interface EventReservationSectionLocationCreateParams {}

export interface EventReservationSectionLocationTranslationUpdateParams {}

export interface EventReservationSectionLocationUpdateParams {}

export interface EventReservationSectionTranslationUpdateParams {}

export interface EventReservationSectionUpdateParams {}

export interface EventSessionCreateParams {
  name: string;
  slug?: string | null;
  startTime: Date;
  endTime: Date;
  location?: string | null;
  description?: string | null;
  longDescription?: string | null;
  imageId?: string | null;
  sortOrder?: number | string | null;
}

export interface EventSessionTranslationUpdateParams {}

export interface EventSessionUpdateParams {
  name?: string | null;
  slug?: string | null;
  startTime?: Date | string | null;
  endTime?: Date | string | null;
  location?: string | null;
  description?: string | null;
  longDescription?: string | null;
  imageId?: string | null;
  sortOrder?: number | string | null;
}

export interface EventSpeakerCreateParams {
  firstName: string;
  lastName?: string | null;
  slug?: string | null;
  bio?: string | null;
  title?: string | null;
  company?: string | null;
  companyBio?: string | null;
  website?: string | null;
  facebook?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  tikTok?: string | null;
  linkedIn?: string | null;
  youtube?: string | null;
  discord?: string | null;
  label?: string | null;
  isHost?: boolean | null;
  imageId?: string | null;
  priority?: number | string | null;
}

export interface EventSpeakerTranslationUpdateParams {}

export interface EventSpeakerUpdateParams {
  firstName?: string | null;
  lastName?: string | null;
  slug?: string | null;
  bio?: string | null;
  title?: string | null;
  company?: string | null;
  companyBio?: string | null;
  website?: string | null;
  facebook?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  tikTok?: string | null;
  linkedIn?: string | null;
  youtube?: string | null;
  discord?: string | null;
  label?: string | null;
  isHost?: boolean | null;
  imageId?: string | null;
  priority?: number | string | null;
}

export interface EventTicketTranslationUpdateParams {}

export interface EventTrackTranslationUpdateParams {}

export interface EventTranslationUpdateParams {}

export interface EventUpdateParams {
  visible?: boolean | null;
  name?: string | null;
  eventType?: keyof typeof EventType | null;
  slug?: string | null;
  shortDescription?: string | null;
  longDescription?: string | null;
  timezone?: string | null;
  eventStart?: Date | string | null;
  eventEnd?: Date | string | null;
  externalUrl?: string | null;
  imageId?: string | null;
  venueMapId?: string | null;
  venue?: string | null;
  location?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  zip?: string | null;
  creatorId?: string | null;
  meetingUrl?: string | null;
  registration?: boolean | null;
  registrationStart?: Date | string | null;
  registrationEnd?: Date | string | null;
  registrationLimit?: number | string | null;
  publicRegistrants?: boolean | null;
  newActivityCreatorEmailNotification?: boolean | null;
  newActivityCreatorPushNotification?: boolean | null;
  groupId?: string | null;
  groupOnly?: boolean | null;
}

export interface GroupCreateParams {
  name: string;
  slug?: string | null;
  description: string;
  access?: keyof typeof GroupAccess | null;
  imageId?: string | null;
  externalUrl?: string | null;
}

export interface GroupMembershipUpdateParams {
  announcementEmailNotification?: boolean | null;
  announcementPushNotification?: boolean | null;
  activityEmailNotification?: boolean | null;
  activityPushNotification?: boolean | null;
  eventEmailNotification?: boolean | null;
  eventPushNotification?: boolean | null;
  chatPushNotification?: boolean | null;
}

export interface GroupTranslationUpdateParams {}

export interface GroupUpdateParams {
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  access?: keyof typeof GroupAccess | null;
  imageId?: string | null;
  externalUrl?: string | null;
}

export interface InterestCreateParams {
  name: string;
}

export interface InterestUpdateParams {
  name?: string | null;
}

export interface InvoiceCreateParams {}

export interface InvoiceLineItemCreateParams {}

export interface InvoiceLineItemUpdateParams {}

export interface InvoiceUpdateParams {}

export interface LeadCreateParams {}

export interface LeadUpdateParams {}

export interface NotificationPreferencesCreateParams {
  newFollowerPush?: boolean | null;
  newFollowerEmail?: boolean | null;
  likePush?: boolean | null;
  resharePush?: boolean | null;
  commentPush?: boolean | null;
  commentEmail?: boolean | null;
  transferPush?: boolean | null;
  transferEmail?: boolean | null;
  supportTicketConfirmationEmail?: boolean | null;
  chatPush?: boolean | null;
  chatUnreadPush?: boolean | null;
  chatUnreadEmail?: boolean | null;
  eventReminderEmail?: boolean | null;
  eventAnnouncementPush?: boolean | null;
  eventAnnouncementEmail?: boolean | null;
  organizationAnnouncementPush?: boolean | null;
  organizationAnnouncementEmail?: boolean | null;
  groupAnnouncementPush?: boolean | null;
  groupAnnouncementEmail?: boolean | null;
  groupInvitationPush?: boolean | null;
  groupInvitationEmail?: boolean | null;
  groupRequestAcceptedEmail?: boolean | null;
  groupRequestAcceptedPush?: boolean | null;
}

export interface NotificationPreferencesUpdateParams {
  newFollowerPush?: boolean | null;
  newFollowerEmail?: boolean | null;
  likePush?: boolean | null;
  resharePush?: boolean | null;
  commentPush?: boolean | null;
  commentEmail?: boolean | null;
  transferPush?: boolean | null;
  transferEmail?: boolean | null;
  supportTicketConfirmationEmail?: boolean | null;
  chatPush?: boolean | null;
  chatUnreadPush?: boolean | null;
  chatUnreadEmail?: boolean | null;
  eventReminderEmail?: boolean | null;
  eventAnnouncementPush?: boolean | null;
  eventAnnouncementEmail?: boolean | null;
  organizationAnnouncementPush?: boolean | null;
  organizationAnnouncementEmail?: boolean | null;
  groupAnnouncementPush?: boolean | null;
  groupAnnouncementEmail?: boolean | null;
  groupInvitationPush?: boolean | null;
  groupInvitationEmail?: boolean | null;
  groupRequestAcceptedEmail?: boolean | null;
  groupRequestAcceptedPush?: boolean | null;
}

export interface OrganizationPageCreateParams {}

export interface OrganizationPageTranslationUpdateParams {}

export interface OrganizationPageUpdateParams {}

export interface OrganizationUpdateParams {}

export interface PaymentIntentPurchaseMetadataParams {
  purchaseId: string;
  addOnIds: string[];
}

export interface PushDeviceCreateParams {
  id: string;
  deviceToken: string;
  eventId?: string | null;
  bundleId?: string | null;
  name?: string | null;
  model?: string | null;
  brand?: string | null;
  osName?: string | null;
  osVersion?: string | null;
  deviceYearClass?: number | string | null;
  manufacturer?: string | null;
  supportedCpuArchitectures?: string | null;
  totalMemory?: number | string | null;
  appType?: "EVENTXM" | "COMMUNITYXM" | null;
  pushService?: "apn" | "firebase" | "huawei" | "xiaomi" | null;
  pushServiceName?: string | null;
}

export interface PushDeviceUpdateParams {
  id: string;
  deviceToken: string;
  eventId?: string | null;
  bundleId?: string | null;
  name?: string | null;
  model?: string | null;
  brand?: string | null;
  osName?: string | null;
  osVersion?: string | null;
  deviceYearClass?: number | string | null;
  manufacturer?: string | null;
  supportedCpuArchitectures?: string | null;
  totalMemory?: number | string | null;
  appType?: "EVENTXM" | "COMMUNITYXM" | null;
  pushService?: "apn" | "firebase" | "huawei" | "xiaomi" | null;
  pushServiceName?: string | null;
}

export interface QuestionCreateParams {
  name: string;
  type: keyof typeof RegistrationQuestionType;
  required?: boolean | null;
  mutable?: boolean | null;
  choices: {
    id?: any | null;
    value: string;
  }[];
}

export interface QuestionUpdateParams {
  name?: string | null;
  required?: boolean | null;
  mutable?: boolean | null;
  sortOrder?: number | string | null;
  choices: {
    id?: any | null;
    value: string;
  }[];
}
export interface ReportCreateParams {}

export interface ReportUpdateParams {}

export interface SectionCreateParams {}

export interface SectionUpdateParams {}

export interface SeriesCreateParams {}

export interface SeriesUpdateParams {}

export interface SponsorshipLevelCreateParams {}

export interface SponsorshipLevelTranslationUpdateParams {}

export interface SponsorshipLevelUpdateParams {}

export interface StreamOutputCreateParams {}

export interface SubscriptionProductCreateParams {}

export interface SubscriptionProductPriceCreateParams {}

export interface SubscriptionProductPriceUpdateParams {}

export interface SubscriptionProductUpdateParams {}

export interface SubscriptionUpdateParams {}

export interface SupportTicketCreateParams {
  type: keyof typeof SupportTicketType;
  email: string;
  request: string;
  accountId?: string | null;
  eventId?: string | null;
  status: "new" | "inProgress" | "complete";
}

export interface SupportTicketUpdateParams {}

export interface TeamCreateParams {
  name: string;
  email: string;
  username?: string | null;
}

export interface TeamMemberCreateParams {}

export interface TeamMemberUpdateParams {}

export interface TeamUpdateParams {
  name?: string | null;
  email?: string | null;
  username?: string | null;
}

export interface ThreadCreateParams {
  name: string;
  description?: string | null;
  access: keyof typeof ThreadAccessLevel;
  groupId?: string | null;
  eventId?: string | null;
}

export interface ThreadUpdateParams {
  name?: string | null;
  description?: string | null;
  access: keyof typeof ThreadAccessLevel;
  groupId?: string | null;
  eventId?: string | null;
}

export interface TicketCreateParams {}

export interface TicketUpdateParams {}

export interface TierCreateParams {}

export interface TierUpdateParams {}

export interface TrackCreateParams {}

export interface TrackUpdateParams {}

export interface TriggerCreateParams {}

export interface TriggerUpdateParams {}

export interface UserCreateParams {}

export interface UserUpdateParams {}
