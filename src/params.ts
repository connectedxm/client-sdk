import {
  BaseAccount,
  BaseGroup,
  ContentGuestType,
  EventType,
  GroupAccess,
  GroupMembershipRole,
  PushDeviceAppType,
  PushService,
  SupportTicketType,
  ThreadAccessLevel,
} from "./interfaces";

export interface ChannelCollectionCreateInputs {
  name: string | null;
  description?: string | null;
}
export interface ChannelCollectionUpdateInputs {
  name?: string | null;
  description?: string | null;
}

export interface ContentGuestCreateInputs {
  accountId?: string | null;
  bio?: string | null;
  company?: string | null;
  companyBio?: string | null;
  companyLink?: string | null;
  discord?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  linkedIn?: string | null;
  name: string;
  slug?: string | null;
  tikTok?: string | null;
  title?: string | null;
  twitter?: string | null;
  type?: ContentGuestType;
  website?: string | null;
  youtube?: string | null;
}

export interface ContentGuestUpdateInputs {
  accountId?: string | null;
  bio?: string | null;
  company?: string | null;
  companyBio?: string | null;
  companyLink?: string | null;
  discord?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  linkedIn?: string | null;
  name?: string | null;
  slug?: string;
  tikTok?: string | null;
  title?: string | null;
  twitter?: string | null;
  type?: ContentGuestType;
  website?: string | null;
  youtube?: string | null;
}

export interface ChannelContentCreateInputs {
  appleUrl?: string | null;
  audioUrl?: string | null;
  body?: string | null;
  //not 100% sure this is needed at this level
  channelId?: string | null;
  description?: string | null;
  duration?: string | null;
  externalUrl?: string | null;
  googleUrl?: string | null;
  imageUrl?: string | null;
  published?: string | null;
  slug?: string;
  spotifyUrl?: string | null;
  title: string;
  videoUrl?: string | null;
  visible: boolean;
  youtubeUrl?: string | null;
}

export interface ChannelContentUpdateInputs {
  appleUrl?: string | null;
  audioId?: number | null;
  body?: string | null;
  //not 100% sure this is needed at this level
  channelId?: string | null;
  description?: string | null;
  duration?: string | null;
  externalUrl?: string | null;
  googleUrl?: string | null;
  imageUrl?: string | null;
  published?: string | null;
  slug?: string;
  spotifyUrl?: string | null;
  title?: string;
  videoId?: string | null;
  visible?: boolean;
  youtubeUrl?: string | null;
}

export interface ChannelCreateInputs {
  appleUrl?: string | null;
  description?: string | null;
  externalUrl?: string | null;
  googleUrl?: string | null;
  groupId?: string | null;
  imageId: string;
  name: string;
  slug?: string;
  spotifyUrl?: string | null;
  visible: boolean;
  youtubeUrl?: string | null;
}

export interface ChannelUpdateInputs {
  appleUrl?: string | null;
  description?: string;
  externalUrl?: string | null;
  googleUrl?: string | null;
  groupId?: string | null;
  imageId?: string | null;
  name?: string | null;
  slug?: string;
  spotifyUrl?: string | null;
  youtubeUrl?: string | null;
}

export interface ChannelSubscriberUpdateInputs {
  contentEmailNotification?: boolean;
  contentPushNotification?: boolean;
}

// GROUPS
export interface GroupCreateInputs {
  name: string;
  description: string;
  access: keyof typeof GroupAccess;
  imageId?: string | null;
  externalUrl?: string | null;
  slug?: string;
}

export interface GroupAnnouncementCreateInputs {
  accountId?: string | null;
  creatorId?: string | null;
  email: boolean;
  eventId?: string | null;
  groupId?: string | null;
  html?: string | null;
  push: boolean;
  slug?: string;
  sponsorshipLevelId?: string | null;
  ticketId?: string | null;
  title: string | null;
}

export interface GroupUpdateInputs {
  access?: GroupAccess;
  description?: string | null;
  externalUrl?: string | null;
  imageId?: string | null;
  name?: string | null;
  slug?: string;
}

export interface GroupEventListingCreateInputs {
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  country?: string | null;
  creatorId?: string | null;
  eventEnd: string;
  eventStart: string;
  eventType: EventType;
  externalUrl?: string | null;
  groupId?: string | null;
  groupOnly?: boolean;
  imageId?: string | null;
  location?: string | null;
  longDescription?: string | null;
  meetingUrl?: string | null;
  name: string;
  newActivityCreatorEmailNotification?: boolean;
  newActivityCreatorPushNotification?: boolean;
  publicRegistrants?: boolean;
  registration?: boolean;
  registrationEnd?: string | null;
  registrationLimit?: string | null;
  registrationStart?: string | null;
  shortDescription: string;
  slug?: string;
  state?: string | null;
  timezone: string;
  venue?: string | null;
  venueMapId?: string | null;
  visible?: boolean | null;
  zip?: string | null;
}

export interface GroupEventListingAnnouncementCreateInputs {
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

export interface GroupEventListingQuestionCreateInputs {
  name: string;
  type: string;
  required: boolean;
  mutable: boolean;
  choices: {
    id: number | null;
    value: string;
  }[];
}

export interface GroupEventListingSessionCreateInputs {
  name: string;
  slug?: string;
  startTime: string;
  endTime: string;
  location?: string | null;
  description?: string | null;
  longDescription?: string | null;
  imageId?: string | null;
  sortOrder?: number | null;
}

export interface GroupEventListingSpeakerCreateInputs {
  bio?: string | null;
  company?: string | null;
  companyBio?: string | null;
  discord?: string | null;
  facebook?: string | null;
  firstName: string;
  imageId?: string | null;
  instagram?: string | null;
  isHost?: boolean;
  label?: string | null;
  lastName?: string | null;
  linkedIn?: string | null;
  priority?: number | null;
  slug?: string | null;
  tikTok?: string | null;
  title?: string | null;
  twitter?: string | null;
  website?: string | null;
  youtube?: string | null;
}

export interface GroupEventListingUpdateInputs {
  eventType?: keyof typeof EventType;
  visible?: boolean;
  name?: string;
  shortDescription?: string;
  longDescription?: string | null;
  eventStart?: string;
  eventEnd?: string;
  timezone?: string | null;
  meetingUrl?: string | null;
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

export interface GroupEventListingQuestionUpdateInputs {
  name?: string;
  required?: boolean;
  mutable?: boolean;
  sortOrder?: number;
  choices?: {
    id: number | null;
    value: string;
  }[];
}

export interface GroupEventListingSessionUpdateInputs {
  description?: string | null;
  endTime?: string;
  imageId?: string | null;
  location?: string | null;
  longDescription?: string | null;
  slug?: string;
  sortOrder?: number | null;
  startTime?: string | null;
  name?: string | null;
}

export interface GroupEventListingSpeakerUpdateInputs {
  bio?: string | null;
  company?: string | null;
  companyBio?: string | null;
  discord?: string | null;
  facebook?: string | null;
  firstName?: string | null;
  imageId?: string | null;
  instagram?: string | null;
  isHost?: boolean;
  label?: string | null;
  lastName?: string | null;
  linkedIn?: string | null;
  priority?: number | null;
  slug?: string | null;
  tikTok?: string | null;
  title?: string | null;
  twitter?: string | null;
  website?: string | null;
  youtube?: string | null;
}

export interface ActivityCreateInputs {
  message: string;
  contentId?: string;
  eventId?: string;
  groupId?: string;
  commentedId?: string;
  videoId?: string;
}

export interface InterestCreateInputs {
  name: string;
  imageId?: string;
}

//Need to update account and group params if not completely needed
export interface GroupMembershipUpdateInputs {
  account: BaseAccount;
  following: boolean;
  activityEmailNotification: boolean;
  activityPushNotification: boolean;
  announcementEmailNotification: boolean;
  announcementPushNotification: boolean;
  eventEmailNotification: boolean;
  eventPushNotification: boolean;
  chatPushNotification: boolean;
  createdAt: string;
  updatedAt: string;
  accountId: string;
  group: BaseGroup;
  role: GroupMembershipRole;
}

export interface SelfUpdateInputs {
  username?: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  title?: string | null;
  company?: string | null;
  bio?: string | null;
  dietaryRestrictions?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  country?: string | null;
  facebook?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  tikTok?: string | null;
  linkedIn?: string | null;
  youtube?: string | null;
  discord?: string | null;
  video?: string | null;
  website?: string | null;
}

export interface SelfNotificationPreferencesUpdateInputs {
  newFollowerPush?: boolean;
  newFollowerEmail?: boolean;
  likePush?: boolean;
  resharePush?: boolean;
  commentPush?: boolean;
  commentEmail?: boolean;
  transferPush?: boolean;
  transferEmail?: boolean;
  supportTicketConfirmationEmail?: boolean;
  chatPush?: boolean;
  chatUnreadPush?: boolean;
  chatUnreadEmail?: boolean;
  eventReminderEmail?: boolean;
  eventAnnouncementPush?: boolean;
  eventAnnouncementEmail?: boolean;
  organizationAnnouncementPush?: boolean;
  organizationAnnouncementEmail?: boolean;
  groupAnnouncementPush?: boolean;
  groupAnnouncementEmail?: boolean;
}

export interface SelfPushDeviceUpdateInputs {
  id: string;
  deviceToken: string | null;
  accountId: string | null;
  account: BaseAccount | null;
  name: string | null;
  model: string | null;
  brand: string | null;
  manufacturer: string | null;
  appType: PushDeviceAppType;
  pushService: PushService;
  createdAt: string;
}

export interface SupportTicketCreateInputs {
  accountId?: string | null;
  email: string;
  eventId?: string | null;
  request: any;
  status: "new" | "inProgress" | "complete";
  type: SupportTicketType;
}

export interface TeamAccountCreateInputs {
  name: string;
  email: string;
  username?: string | null;
}

export interface ThreadCreateInputs {
  access: ThreadAccessLevel;
  description?: string | null;
  eventId?: string | null;
  groupId?: string | null;
  name: string;
}

export interface ThreadUpdateInputs {
  access?: ThreadAccessLevel;
  description?: string | null;
  eventId?: string | null;
  groupId?: string | null;
  name?: string;
}
