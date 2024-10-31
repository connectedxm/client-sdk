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
  name: string;
  description?: string;
}
export interface ChannelCollectionUpdateInputs {
  name: string;
  description?: string;
}

export interface ContentGuestCreateInputs {
  accountId?: string | null;
  type: ContentGuestType;
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
  type: ContentGuestType;
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

export interface ChannelContentCreateInputs {
  title: string;
  visible?: boolean;
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
  visible?: boolean;
  title?: string;
  description?: string | null;
  duration?: string | null;
  body?: string | null;
  editor?: string | null;
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

export interface ChannelSubscriberUpdateInputs {
  contentEmailNotification?: boolean;
  contentPushNotification?: boolean;
}

// GROUPS
export interface GroupCreateInputs {
  name: string;
  description: string;
  access: keyof typeof GroupAccess;
  active: boolean;
  externalUrl?: string;
}

export interface GroupAnnouncementCreateInputs {
  title: string;
  html: string;
  email: boolean;
  push: boolean;
}
export interface GroupUpdateInputs {
  name?: string;
  active?: boolean;
  description?: string;
  externalUrl?: string;
  access?: "public" | "private";
}

export interface GroupEventListingCreateInputs {
  eventType: keyof typeof EventType;
  visible: boolean;
  name: string;
  shortDescription: string;
  eventStart: string;
  eventEnd: string;
  timezone: string;
  // Optional fields
  venue?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  externalUrl?: string;
  meetingUrl?: string;
  registration?: boolean;
  registrationLimit?: number | null;
  groupOnly?: boolean;
}

export interface GroupEventListingAnnouncementCreateInputs {
  title: string;
  html: string;
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
  description: string;
  location: string | null;
  startTime: Date;
  endTime: Date;
}

export interface GroupEventListingSpeakerCreateInputs {
  firstName: string;
  lastName: string;
  title: string | null;
  company: string | null;
  bio: string | null;
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
  type?: string;
  required?: boolean;
  mutable?: boolean;
  sortOrder?: number;
  choices?: {
    id: number | null;
    value: string;
  }[];
}

export interface GroupEventListingSessionUpdateInputs {
  name?: string;
  description?: string;
  location?: string | null;
  startTime?: Date;
  endTime?: Date;
}
export interface GroupEventListingSpeakerUpdateInputs {
  firstName?: string;
  lastName?: string;
  title?: string | null;
  company?: string | null;
  bio?: string | null;
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
  type: keyof typeof SupportTicketType;
  email: string;
  request: any;
}

export interface TeamAccountCreateInputs {
  name: string;
  email: string;
}

export interface ThreadCreateInputs {
  name: string;
  description?: string;
  imageId?: string;
  eventId?: string;
  groupId?: string;
  featured?: boolean;
  access: keyof typeof ThreadAccessLevel;
}

export interface ThreadUpdateInputs {
  id: string;
  name?: string;
  description?: string;
  imageId?: string;
  featured?: boolean;
  eventId?: string;
  groupId?: string;
  access?: keyof typeof ThreadAccessLevel;
}
