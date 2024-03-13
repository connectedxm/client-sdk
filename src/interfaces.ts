export interface ConnectedXMResponse<TData> {
  status: "ok" | "error" | "redirect";
  message: string;
  data: TData;
  count?: number;
  url?: string;
}

export enum RegistrationStatus {
  registered = "registered",
  checkedIn = "checkedIn",
  checkedOut = "checkedOut",
  waitlisted = "waitlisted",
  cancelled = "cancelled",
  transferred = "transferred",
  invited = "invited",
  rejected = "rejected",
  draft = "draft",
}
export interface BaseImage {
  id: string;
  uri: string;
  width: number;
  height: number;
  moderation: "safe" | "warning";
}

export enum ImageType {
  admin = "admin",
  people = "people",
  activity = "activity",
  banner = "banner",
}

export interface Image extends BaseImage {
  type: ImageType;
  name: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export const isTypeImage = (image: BaseImage | Image): image is Image => {
  return (image as Omit<Image, keyof BaseImage>).name !== undefined;
};

export interface BaseIntegrations {}

export interface Integrations extends BaseIntegrations {
  ghost: boolean;
  ghostUrl: string | null;
  ghostContentKey: string | null;
}

export const isTypeIntegrations = (
  integrations: BaseIntegrations | Integrations
): integrations is Integrations => {
  return (
    (integrations as Omit<Integrations, keyof BaseIntegrations>).ghost !==
    undefined
  );
};

export interface BaseOrganization {
  id: string;
  slug: string;
  name: string;
}

export enum Currency {
  USD = "USD",
}

export interface Organization extends BaseOrganization {
  email: string;
  phone: string | null;
  website: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zip: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  userPoolId: string;
  userPoolClientId: string;
  logo: BaseImage | null;
  logoId: string | null;
  currency: Currency;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  linkedIn: string | null;
  tikTok: string | null;
  discord: string | null;
  youtube: string | null;
  timezone: string;
  iosAppLink: string | null;
  androidAppLink: string | null;
  createdAt: string;
  updatedAt: string;
  integrations: Integrations;
}

export const isTypeOrganization = (
  organization: BaseOrganization | Organization
): organization is Organization => {
  return (
    (organization as Omit<Organization, keyof BaseOrganization>).email !==
    undefined
  );
};

export interface BaseAccountTier {
  id: string;
  slug: string;
  priority: number;
  name: string;
  iconName: string;
  color: string | null;
  image: BaseImage;
}

export interface AccountTier extends BaseAccountTier {
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export const isTypeAccountTier = (
  accountTier: BaseAccountTier | AccountTier
): accountTier is AccountTier => {
  return (
    (accountTier as Omit<AccountTier, keyof BaseAccountTier>).description !==
    undefined
  );
};

export enum AccountType {
  account = "account",
  team = "team",
}

export interface BaseAccount {
  id: string;
  username: string;
  accountType: AccountType;
  firstName: string | null;
  lastName: string | null;
  title: string | null;
  company: string | null;
  image: BaseImage | null;
  chatConnected: boolean;
  accountTiers: BaseAccountTier[];
  subscriptions: {
    subscriptionProduct: {
      tiers: BaseAccountTier[];
    };
  }[];
}

export interface Account extends BaseAccount {
  bio: string | null;
  website: string | null;
  facebook: string | null;
  instagram: string | null;
  linkedIn: string | null;
  twitter: string | null;
  tikTok: string | null;
  youtube: string | null;
  discord: string | null;
  video: string | null;
  state: string | null;
  country: string | null;
  timezone: string | null;
  createdAt: string;
  followers?: Account[]; // if you are a follower = Array > 0
  following?: Account[]; // if you are a following Array > 0
  _count: {
    followers: number;
    following: number;
  };
}

export const isTypeAccount = (
  account: BaseAccount | Account
): account is Account => {
  return (account as Omit<Account, keyof BaseAccount>)._count !== undefined;
};

export interface Self extends Account {
  email: string | null;
  phone: string | null;
  dietaryRestrictions: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  zip: string | null;
  shareCode: string;
  chatToken?: string;
}

export const isSelf = (
  account: Self | Account | BaseAccount
): account is Self => {
  return (account as Omit<Self, keyof Account>).email !== undefined;
};

export interface AccountShare extends Account {
  email: string | null;
  phone: string | null;
}

export interface BaseActivity {
  id: string;
  message: string;
  readMore: boolean;
  image: BaseImage | null;
  video: BaseVideo | null;
  linkPreview: LinkPreview | null;
  account: BaseAccount;
  createdAt: string;
}

export interface Activity extends BaseActivity {
  html: string;
  text: string;
  community: BaseCommunity | null;
  event: BaseEvent | null;
  content: BaseContent | null;
  commented: BaseActivity | null;
  reshared: BaseActivity | null;
  updatedAt: string;
  likes?: {
    createdAt: string;
  }[]; // if you have liked = Array > 0
  comments?: {
    id: string;
  }[]; // if you have commented = Array > 0
  reshares?: {
    id: string;
  }[]; // if you have resahred = Array > 0
  _count: {
    likes: number;
    comments: number;
    reshares: number;
  };
}
export interface SingleActivity extends Activity {
  html: string;
  text: string;
}

export const isTypeActivity = (
  activity: BaseActivity | Activity
): activity is Activity => {
  return (activity as Omit<Activity, keyof BaseActivity>)._count !== undefined;
};

export interface BaseLike {
  account: BaseAccount;
  activity: BaseActivity;
  createdAt: string;
}

export interface Like extends BaseLike {}

// export const isTypeLike = (like: BaseLike | Like): like is Like => {
//   return (like as Omit<Like, keyof BaseLike>).createdAt !== undefined;
// };

export enum CommunityAccess {
  public = "public",
  private = "private",
}

export interface BaseCommunity {
  id: string;
  slug: string;
  name: string;
  image: BaseImage | null;
  access: CommunityAccess;
}

export interface Community extends BaseCommunity {
  description: string;
  externalUrl: string | null;
  active: boolean;
  members?: BaseCommunityMembership[]; // if you are a member = Array > 0
  _count: {
    members: number;
  };
}

export const isTypeCommunity = (
  community: BaseCommunity | Community
): community is Community => {
  return (
    (community as Omit<Community, keyof BaseCommunity>)._count !== undefined
  );
};

export interface BaseEvent {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  featured: boolean;
  timezone: string | null;
  eventStart: string;
  eventEnd: string;
  image: BaseImage | null;
}

export enum EventSource {
  admin = "admin",
  moderator = "moderator",
  account = "account",
}

export enum EventType {
  physical = "physical",
  virtual = "virtual",
  hybrid = "hybrid",
}

export interface Event extends BaseEvent {
  approved: boolean;
  eventType: EventType;
  longDescription: string | null;
  externalUrl: string | null;
  meetingUrl: string | null;
  venue: string | null;
  venueMap: BaseImage | null;
  location: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zip: string | null;
  communities: BaseCommunity[];
  creatorId: string | null;
  creator: BaseAccount;
  registration: boolean;
  registrationStart: string;
  registrationEnd: string;
  publicRegistrants: boolean;
  chatBotNumber: string | null;
  iosAppLink: string | null;
  androidAppLink: string | null;
  pages: BaseEventPage[];
  streamInput: StreamInput | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    sessions: number;
    speakers: number;
    sponsors: number;
    faqSections: number;
  };
}

export const isTypeEvent = (event: BaseEvent | Event): event is Event => {
  return (event as Omit<Event, keyof BaseEvent>)._count !== undefined;
};

export interface RegistrationEventDetails {
  id: string;
  slug: string;
  name: string;
  eventStart: string;
  eventEnd: string;
  registration: boolean;
  registrationCount: number;
  registrationLimit: number;
  registrationStart: string;
  registrationEnd: string;
  _count: {
    sections: number;
    tickets: number;
    coupons: number;
  };
}

export enum RegistrationQuestionType {
  text = "text",
  textarea = "textarea",
  number = "number",
  time = "time",
  date = "date",
  toggle = "toggle",
  select = "select",
  radio = "radio",
  checkbox = "checkbox",
  search = "search",
  file = "file",
}

export interface BaseRegistrationQuestion {
  id: number;
  eventId: string;
  type: RegistrationQuestionType;
  name: string;
  required: boolean;
  description: string | null;
  label: string | null;
  placeholder: string | null;
  default: string | null;
  span: number;
  mutable: boolean;
  min: string | null;
  max: string | null;
  validation: string | null;
  validationMessage: string | null;
  choices: BaseRegistrationQuestionChoice[];
}

export interface RegistrationQuestion extends BaseRegistrationQuestion {
  response?: string; // THIS DOESNT MATCH THE BACKEND SELECT BUT IT IS POSSIBLE IT EXISTS WHEN YOU QUERY FOR PURCHASE SECTION/QUESTIONS
}

export interface BaseRegistrationQuestionChoice {
  id: number;
  value: string;
  text: string | null;
  supply: number | null;
  description: string | null;
  sortOrder: number;
  subQuestions: RegistrationQuestion[];
}

export interface RegistrationQuestionChoice
  extends BaseRegistrationQuestionChoice {}

export interface BaseRegistrationQuestionSearchValue {
  id: string;
  value: string;
}

export interface RegistrationQuestionSearchValue
  extends BaseRegistrationQuestionSearchValue {}

export interface BaseRegistrationQuestionResponse {
  questionId: number;
  value: string;
}

export interface RegistrationQuestionResponse
  extends BaseRegistrationQuestionResponse {
  question: RegistrationQuestion;
  // changeLogs: RegistrationQuestionResponseChangeLog[];
  createdAt: string;
  updatedAt: string;
}

export interface BaseRegistrationSection {
  id: number;
  name: string;
  description: string | null;
  sortOrder: number;
}

export interface RegistrationSection extends BaseRegistrationSection {
  accountTiers: BaseAccountTier[];
  eventTickets: BaseTicket[];
  questions: RegistrationQuestion[];
}

export interface EventListing extends Event {
  newActivityCreatorEmailNotification: boolean;
  newActivityCreatorPushNotification: boolean;
  registrationLimit: number;
  registrationStart: string;
  registrationEnd: string;
  sponsors: BaseAccount[];
  speakers: BaseSpeaker[];
  sessions: BaseSession[];
}

export const isListing = (
  event: EventListing | BaseEvent | Event
): event is Event => {
  return (
    (event as Omit<EventListing, keyof Event>)
      .newActivityCreatorEmailNotification !== undefined
  );
};

export interface BaseInterest {
  id: string;
  name: string;
}

export interface Interest extends BaseInterest {}

export enum TicketVisibility {
  public = "public",
  private = "private",
}

export enum TicketEventAccessLevel {
  regular = "regular",
  virtual = "virtual",
  vip = "vip",
}
export interface BaseTicket {
  id: string;
  slug: string;
  transferable: boolean;
  name: string;
  shortDescription: string;
  longDescription: string | null;
  price: number;
  accessLevel: TicketEventAccessLevel;
  featuredImage: BaseImage | null;
  minQuantityPerSale: number;
  maxQuantityPerSale: number;
  supply: number | null;
}

export interface Ticket extends BaseTicket {
  visibility: TicketVisibility;
  active: boolean;
  event: BaseEvent;
}

export const isTypeTicket = (ticket: BaseTicket | Ticket): ticket is Ticket => {
  return (ticket as Omit<Ticket, keyof BaseTicket>).visibility !== undefined;
};

export interface BasePurchase {
  id: string;
  alternateId: number;
  location: string | null;
  usedAt: string | null;
  transfer: { select: { id: string; email: string; createdAt: string } } | null;
  ticketId: string | null;
  ticket: BaseTicket | null;
  responses: BaseRegistrationQuestionResponse[];
}

export interface Purchase extends BasePurchase {
  createdAt: string;
  updatedAt: string;
}

export const isTypePurchase = (
  purchase: BasePurchase | Purchase
): purchase is Purchase => {
  return (
    (purchase as Omit<Purchase, keyof BasePurchase>).createdAt !== undefined
  );
};

export interface Order {
  id: string;
  alternateId: number;
  subTotal: number;
  tax: number;
  discount: number;
  grandTotal: number;
  coupon: BaseCoupon | null;
  paymentConfirmationId: string | null;
  purchases: BasePurchase[];
  accountId: string;
  account: BaseAccount;
  createdAt: string;
  updatedAt: string;
}

export interface BaseTransfer {
  id: string;
  email: string;
}

export interface Transfer extends BaseTransfer {
  purchase: BasePurchase;
  createdAt: string;
  updatedAt: string;
}

export const isTypeTransfer = (
  transfer: BaseTransfer | Transfer
): transfer is Transfer => {
  return (
    (transfer as Omit<Transfer, keyof BaseTransfer>).createdAt !== undefined
  );
};

export enum NotificationType {
  ANNOUNCEMENT = "ANNOUNCEMENT",
  FOLLOW = "FOLLOW",
  INVITATION = "INVITATION",
  TRANSFER = "TRANSFER",
  LIKE = "LIKE",
  COMMENT = "COMMENT",
  RESHARE = "RESHARE",
  EVENT = "EVENT",
  ACTIVITY = "ACTIVITY",
}
export interface BaseNotification {
  id: string;
  type: NotificationType;
  read: boolean;
  sender: BaseAccount | null;
}

export interface Notification extends BaseNotification {
  transfer: BaseTransfer | null;
  like: BaseLike | null;
  activity: BaseActivity | null;
  event: BaseEvent | null;
  announcement: BaseAnnouncement | null;
  createdAt: string;
  updatedAt: string;
}

export const isTypeNotification = (
  notification: BaseNotification | Notification
): notification is Notification => {
  return (
    (notification as Omit<Notification, keyof BaseNotification>).createdAt !==
    undefined
  );
};

export interface BaseCoupon {
  id: string;
  code: string;
  discountAmount: number;
  discountPercent: number;
}

export enum CouponType {
  order = "order",
  ticket = "ticket",
}

export interface Coupon extends BaseCoupon {
  description: string | null;
  ticket: BaseTicket | null;
}

export const isTypeCoupon = (coupon: BaseCoupon | Coupon): coupon is Coupon => {
  return (coupon as Omit<Coupon, keyof BaseCoupon>).description !== undefined;
};

export interface ManagedCoupon extends Coupon {
  active: boolean;
  type: CouponType;
  startDate: string | null;
  endDate: string | null;

  quantityMin: number;
  quantityMax: number | null;
  amountMin: number;
  amountMax: number | null;
  useLimit: number | null;
  limitOnePerAccount: boolean;
  studentDiscount: boolean;
  _count: {
    instances: number;
    uses: number;
  };
}

export const isManagedCoupon = (
  coupon: BaseCoupon | Coupon | ManagedCoupon
): coupon is ManagedCoupon => {
  return (coupon as Omit<ManagedCoupon, keyof Coupon>).active !== undefined;
};

export interface ManagedCouponOrder {
  id: string;
  alternateId: number;
  createdAt: string;
  coupon: BaseCoupon | null;
  account: BaseAccount;
}

export interface BaseInstance {
  id: string;
  code: string;
}

export interface Instance extends BaseInstance {
  coupon: BaseCoupon;
}

export const isTypeInstance = (
  instance: BaseInstance | Instance
): instance is Instance => {
  return (instance as Omit<Instance, keyof BaseInstance>).coupon !== undefined;
};

export interface BaseTrack {
  id: string;
  slug: string;
  name: string;
  color: string;
}

export interface Track extends BaseTrack {
  description: string | null;
  _count: {
    sessions: number;
  };
}

export const isTypeTrack = (track: BaseTrack | Track): track is Track => {
  return (track as Omit<Track, keyof BaseTrack>).description !== undefined;
};

export interface BaseSpeaker {
  id: string;
  slug: string;
  firstName: string;
  lastName: string | null;
  title: string | null;
  company: string | null;
  bio: string | null;
  image: BaseImage | null;
  priority: number;
  isHost: boolean;
}

export interface Speaker extends BaseSpeaker {
  label: string | null;
  website: string | null;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  linkedIn: string | null;
  discord: string | null;
  youtube: string | null;
  tikTok: string | null;
  sessions: BaseSession[];
}

export const isTypeSpeaker = (
  speaker: BaseSpeaker | Speaker
): speaker is Speaker => {
  return (speaker as Omit<Speaker, keyof BaseSpeaker>).website !== undefined;
};

export interface BaseSession {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  location: string | null;
  image: BaseImage | null;
  startTime: string;
  endTime: string;
  sortOrder: number | null;
  nonSession: boolean;
}

export interface Session extends BaseSession {
  longDescription: string | null;
  tracks: BaseTrack[];
  speakers: BaseSpeaker[];
  sponsors: BaseAccount[];
  accounts?: BaseAccount[]; // if you have saved this session = Array > 0
  streamInput: StreamInput | null;
}

export const isTypeSession = (
  session: BaseSession | Session
): session is Session => {
  return (
    (session as Omit<Session, keyof BaseSession>).longDescription !== undefined
  );
};
export interface BaseEventPage {
  id: string;
  slug: string;
  title: string;
  sortOrder: number;
}

export interface EventPage extends BaseEventPage {
  html: string;
  subtitle: string;
  images: BaseImage[];
}

export const isTypeEventPage = (
  page: BaseEventPage | EventPage
): page is EventPage => {
  return (page as Omit<EventPage, keyof BaseEventPage>).html !== undefined;
};

export interface BaseScan {
  id: string;
}

export interface Scan extends BaseScan {
  event: BaseEvent;
  createdAt: string;
  updatedAt: string;
}

export const isTypeScan = (scan: BaseScan | Scan): scan is Scan => {
  return (scan as Omit<Scan, keyof BaseScan>).createdAt !== undefined;
};

export interface User {}

export interface OrgMembership {}

export interface BaseSponsorshipLevel {
  id: string;
  slug: string;
  name: string;
  subtitle: string | null;
  color: string;
  scale: number;
  image: BaseImage | null;
}

export interface SponsorshipLevel extends BaseSponsorshipLevel {
  description: string | null;
  sortOrder: number;
  accounts: BaseAccount[];
  updatedAt: string;
  createdAt: string;
}

export const isTypeSponsorshipLevel = (
  sponsorshipLevel: BaseSponsorshipLevel | SponsorshipLevel
): sponsorshipLevel is SponsorshipLevel => {
  return (
    (sponsorshipLevel as Omit<SponsorshipLevel, keyof BaseSponsorshipLevel>)
      .description !== undefined
  );
};

export interface BaseComplimentaryTicket {
  ticketId: string;
  complimentaryTicket: BaseTicket;
  quantity: number;
}

export interface ComplimentaryTicket extends BaseComplimentaryTicket {}

enum PageType {
  about = "about",
  privacy = "privacy",
  terms = "terms",
  team = "team",
}

export interface BasePage {
  type: PageType;
  title: string | null;
  subtitle: string | null;
  html: string | null;
  updatedAt: string;
}

export interface Page extends BasePage {}

export interface BaseFaq {
  id: string;
  slug: string;
  question: string;
  answer: string;
}

export interface Faq extends BaseFaq {
  section: BaseFaqSection | null;
}

export const isTypeFaq = (faq: BaseFaq | Faq): faq is Faq => {
  return (faq as Omit<Faq, keyof BaseFaq>).section !== undefined;
};

export interface BaseFaqSection {
  id: string;
  slug: string;
  name: string;
}

export interface FaqSection extends BaseFaqSection {
  faqs: BaseFaq[];
}

export const isTypeFaqSection = (
  faqSection: BaseFaqSection | FaqSection
): faqSection is FaqSection => {
  return (
    (faqSection as Omit<FaqSection, keyof BaseFaqSection>).faqs !== undefined
  );
};

export interface BaseSupportTicket {
  id: string;
}

export enum SupportTicketType {
  support = "support",
  inquiry = "inquiry",
}

export interface SupportTicket extends BaseSupportTicket {
  type: SupportTicketType;
  email: string;
  request: string;
  account: BaseAccount | null;
  event: BaseEvent | null;
  ticket: BaseTicket | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const isTypeSupportTicket = (
  supportTicket: BaseSupportTicket | SupportTicket
): supportTicket is SupportTicket => {
  return (
    (supportTicket as Omit<SupportTicket, keyof BaseSupportTicket>).email !==
    undefined
  );
};

export interface BaseSupportTicketNote {
  id: string;
  supportTicketId: string;
}

export interface SupportTicketNote extends BaseSupportTicketNote {
  createdAt: string;
  updatedAt: string;
}

export const isTypeSupportTicketNote = (
  supportTicketNote: BaseSupportTicketNote | SupportTicketNote
): supportTicketNote is SupportTicketNote => {
  return (
    (supportTicketNote as Omit<SupportTicketNote, keyof BaseSupportTicketNote>)
      .createdAt !== undefined
  );
};

export enum AdvertisementType {
  square = "square",
  rectangle = "rectangle",
}
export interface BaseAdvertisement {
  id: string;
  type: AdvertisementType;
  link: string;
  image: BaseImage | null;
}

export interface Advertisement extends BaseAdvertisement {
  title: string;
  description: string | null;
}

export const isTypeAdvertisement = (
  advertisement: BaseAdvertisement | Advertisement
): advertisement is Advertisement => {
  return (
    (advertisement as Omit<Advertisement, keyof BaseAdvertisement>).title !==
    undefined
  );
};

export interface AdvertisementClick {}

export interface AdvertisementView {}

export interface BaseTeamMember {
  id: string;
  slug: string;
  firstName: string | null;
  lastName: string | null;
  title: true;
  image: BaseImage | null;
}

export interface TeamMember extends BaseTeamMember {
  nickName: true;
  email: true;
  phone: true;
  bio: true;
  linkedIn: true;
  facebook: true;
  instagram: true;
  twitter: true;
  tikTok: true;
  discord: true;
  startDate: true;
}

export const isTypeTeamMember = (
  teamMember: BaseTeamMember | TeamMember
): teamMember is TeamMember => {
  return (
    (teamMember as Omit<TeamMember, keyof BaseTeamMember>).email !== undefined
  );
};

export enum CommunityMembershipRole {
  member = "member",
  moderator = "moderator",
}

export interface BaseCommunityMembership {
  accountId: string;
  community: BaseCommunity;
  role: CommunityMembershipRole;
}

export interface CommunityMembership extends BaseCommunityMembership {
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
}

export const isTypeCommunityMembership = (
  communityMembership: BaseCommunityMembership | CommunityMembership
): communityMembership is CommunityMembership => {
  return (
    (
      communityMembership as Omit<
        CommunityMembership,
        keyof BaseCommunityMembership
      >
    ).createdAt !== undefined
  );
};

export enum ContentTypeFormat {
  article = "article",
  podcast = "podcast",
  video = "video",
}

export interface BaseContentType {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  format: ContentTypeFormat;
  image: BaseImage;
}

export interface ContentType extends BaseContentType {
  priority: number;
  externalUrl: string | null;
  appleUrl: string | null;
  spotifyUrl: string | null;
  googleUrl: string | null;
  youtubeUrl: string | null;
  hosts: BaseAccount[];
  subscribers?: {
    id: string;
  }[]; // if you are a subscriber = Array > 0
}

export const isTypeContentType = (
  contentType: BaseContentType | ContentType
): contentType is ContentType => {
  return (
    (contentType as Omit<ContentType, keyof BaseContentType>).priority !==
    undefined
  );
};

export interface BaseContent {
  id: string;
  featured: boolean;
  slug: string;
  title: string | null;
  description: string | null;
  imageUrl: string | null;
  audioUrl: string | null;
  videoUrl: string | null;
  duration: string | null;
  contentType: BaseContentType;
  published: string | null;
}

export interface Content extends BaseContent {
  body: string | null;
  externalUrl: string | null;
  appleUrl: string | null;
  spotifyUrl: string | null;
  googleUrl: string | null;
  youtubeUrl: string | null;
  authors: BaseAccount[];
  mentions: BaseAccount[];
  createdAt: string;
  updatedAt: string;
}

export const isTypeContent = (
  content: BaseContent | Content
): content is Content => {
  return (content as Omit<Content, keyof BaseContent>).body !== undefined;
};

export interface Registration {
  id: string;
  alternateId: number;
  eventId: string;
  event: RegistrationEventDetails | undefined;
  account: BaseAccount;
  status: RegistrationStatus;
  couponId: string | null;
  coupon: BaseCoupon | null;
  purchases: BasePurchase[];
  payments: Payment[];
  createdAt: string;
}

enum RegistrationPaymentType {
  charge = "charge",
  refund = "refund",
}

export interface BasePayment {
  id: string;
  type: RegistrationPaymentType;
  chargedAmt: number;
  ticketId: string | null;
  ticket: BaseTicket | null;
  last4: string | null;
  stripeId: string | null;
  createdAt: string;
}

export interface Payment extends BasePayment {}
export interface BaseLead {
  id: string;
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  title: string | null;
  shareAccount: {
    id: string;
    image: BaseImage | null;
  };
  createdAt: string;
}

export interface Lead extends BaseLead {
  email: string | null;
  phone: string | null;
  state: string | null;
  country: string | null;
  website: string | null;
  facebook: string | null;
  instagram: string | null;
  linkedIn: string | null;
  twitter: string | null;
  tikTok: string | null;
  note: string | null;
  eventId: string | null;
  event: BaseEvent | null;
  updatedAt: string;
}

export const isTypeLead = (lead: BaseLead | Lead): lead is Lead => {
  return (lead as Omit<Lead, keyof BaseLead>).email !== undefined;
};

export interface NotificationPreferences {
  newFollowerPush: boolean;
  newFollowerEmail: boolean;
  likePush: boolean;
  resharePush: boolean;
  commentPush: boolean;
  commentEmail: boolean;
  transferPush: boolean;
  transferEmail: boolean;
  supportTicketConfirmationEmail: boolean;
  chatPush: boolean;
  chatUnreadPush: boolean;
  chatUnreadEmail: boolean;
  organizationAnnouncementEmail: boolean;
  organizationAnnouncementPush: boolean;
  communityAnnouncementEmail: boolean;
  communityAnnouncementPush: boolean;
  eventAnnouncementEmail: boolean;
  eventAnnouncementPush: boolean;
}

export enum PushDeviceAppType {
  EVENTXM = "EVENTXM",
  COMMUNITYXM = "COMMUNITYXM",
}

export enum PushService {
  apn = "apn",
  firebase = "firebase",
  huawei = "huawei",
  xiaomi = "xiaomi",
}

export interface PushDevice {
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

export interface BaseAnnouncement {
  id: string;
  slug: string;
  title: string | null;
  message: string | null;
  html: string | null;
  event: BaseEvent | null;
  community: BaseCommunity | null;
  creator: BaseAccount | null;
  createdAt: string;
}

export interface Announcement extends BaseAnnouncement {
  updatedAt: string;
}

export const isTypeAnnouncement = (
  announcement: BaseAnnouncement | Announcement
): announcement is Announcement => {
  return (
    (announcement as Omit<Announcement, keyof BaseAnnouncement>).updatedAt !==
    undefined
  );
};

export interface EventAllowlistMember {
  id: string;
}

export interface TicketAllowlistMember {
  id: string;
}

export interface BaseBenefit {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  image: BaseImage | null;
  priority: number;
}

export interface Benefit extends BaseBenefit {
  startDate: string;
  endDate: string | null;
  eventId: string | null;
  event: BaseEvent | null;
  managerId: string | null;
  manager: Account | null;
  createdAt: string;
  updatedAt: string;
}

export const isTypeBenefit = (
  benefit: BaseBenefit | Benefit
): benefit is Benefit => {
  return (benefit as Omit<Benefit, keyof BaseBenefit>).createdAt !== undefined;
};

export interface BaseEventActivation {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  maxPoints: number;
  startAfter: string;
  image: BaseImage | null;
}

export interface EventActivation extends BaseEventActivation {
  event: BaseEvent;
  manager: BaseAccount | null;
  longDescription: string | null;
  protected: boolean;
  createdAt: string;
  updatedAt: string;
  completions?: BaseEventActivationCompletion[]; // if you have completed = Array > 0
}

export const isTypeEventActivation = (
  eventActivation: BaseEventActivation | EventActivation
): eventActivation is EventActivation => {
  return (
    (eventActivation as Omit<EventActivation, keyof BaseEventActivation>)
      .createdAt !== undefined
  );
};

export interface BaseEventActivationCompletion {
  id: string;
  eventId: string;
  earnedPoints: number;
  createdAt: string;
}

export interface EventActivationCompletion
  extends BaseEventActivationCompletion {
  eventActivationId: string;
  eventActivation: BaseEventActivation;
  account: BaseAccount;
  updatedAt: string;
}

export const isTypeEventActivationCompletion = (
  eventActivationCompletion:
    | BaseEventActivationCompletion
    | EventActivationCompletion
): eventActivationCompletion is EventActivationCompletion => {
  return (
    (
      eventActivationCompletion as Omit<
        EventActivationCompletion,
        keyof BaseEventActivationCompletion
      >
    ).updatedAt !== undefined
  );
};

export interface LinkPreview {
  id: number;
  activityId: string;
  url: string;
  title: string | null;
  siteName: string | null;
  description: string | null;
  mediaType: string | null;
  contentType: string | null;
  image: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
  video: string | null;
  favicon: string | null;
}

export interface StreamInput {
  cloudflareId: string;
  connected: boolean;
}

export interface BaseChatChannel {
  id: number;
  name: string | null;
  image: BaseImage | null;
  lastMessageAt: string | null;
}
export interface ChatChannel extends BaseChatChannel {
  messages: BaseChatChannelMessage[]; // MOST RECENT 1 MESSAGES
  members: BaseChatChannelMember[]; // Up to 5 members will be returned
  _count: {
    members: number;
  };
}

export interface BaseChatChannelMessage {
  id: number;
  text: string;
  html: string;
  type: "user" | "system";
  accountId: string;
  account: BaseAccount | null;
  createdAt: string;
  updatedAt: string;
}

export interface ChatChannelMessage extends BaseChatChannelMessage {}

export interface BaseChatChannelMember {
  accountId: string;
  account: BaseAccount;
  role: "moderator" | "member";
  read: boolean;
  notifications: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatChannelMember extends BaseChatChannelMember {
  channelId: number;
  channel: ChatChannel;
}
export interface BaseSeries {
  id: string;
  sortOrder: number;
  name: string;
  slug: string;
  description: string | null;
  image: BaseImage | null;
  createdAt: string;
  updatedAt: string;
}

export interface Series extends BaseSeries {}

export interface BaseVideo {
  id: string;
  width: number;
  height: number;
  thumbnailUrl: string;
  previewUrl: string;
  readyToStream: string;
  hlsUrl: string;
  dashUrl: string;
}

export enum SubscriptionStatus {
  active = "active",
  canceled = "canceled",
  paused = "paused",
  trialing = "trialing",
  past_due = "past_due",
  unpaid = "unpaid",
}

export interface BaseSubscription {
  id: string;
  status: SubscriptionStatus;
  expiresAt: string;
  cancelAtEnd: boolean;
  subscriptionProduct: BaseSubscriptionProduct;
}

export interface Subscription extends BaseSubscription {
  account: BaseAccount;
  price: BaseSubscriptionProductPrice;
  paymentMethod?: {
    brand: "amex" | "discover" | "mastercard" | "visa" | "unknown" | null;
    last4: string | null;
    expMonth: number | null;
    expYear: number | null;
  };
  createdAt: string;
  updatedAt: string;
}

export interface BaseSubscriptionProduct {
  id: string;
  active: boolean;
  name: string;
  description: string | null;
  featured: boolean;
}

export interface SubscriptionProduct extends BaseSubscriptionProduct {
  prices: SubscriptionProductPrice[];
  features: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BaseSubscriptionProductPrice {
  id: string;
  active: boolean;
  amount: number;
  interval: "day" | "week" | "month" | "year";
  intervalCount: number;
  maxAmount: number;
  minAmount: number;
  type: string;
}

export interface SubscriptionProductPrice extends BaseSubscriptionProductPrice {
  subscriptionProduct: BaseSubscriptionProduct;
  createdAt: string;
  updatedAt: string;
}

export interface BaseInvoice {
  id: string;
  title: string;
  description: string | null;
  dueDate: string;
}

export interface Invoice extends BaseInvoice {
  lineItems: BaseInvoiceLineItem[];
  payments: BasePayment[];
  createdAt: string;
  updatedAt: string;
}

export interface BaseInvoiceLineItem {
  id: string;
  name: string;
  description: string | null;
  quantity: number;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceLineItem extends BaseInvoiceLineItem {
  invoiceId: string;
  invoice: BaseInvoice;
}
