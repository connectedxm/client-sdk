export enum IntegrationType {
  snagtag = "snagtag",
}

export enum ActivityEntityType {
  mention = "mention",
  interest = "interest",
  link = "link",
  segment = "segment",
}

export enum SessionAccess {
  public = "PUBLIC",
  private = "PRIVATE",
}

export enum EventAgendaVisibility {
  everyone = "everyone",
  registered = "registered",
  hidden = "hidden",
}

export enum LocationQuestionOption {
  country = "country",
  countryState = "countryState",
  countryStateCity = "countryStateCity",
}

export enum ActivityPreference {
  all = "all",
  featured = "featured",
  none = "none",
}

export enum OrganizationActivityPreference {
  featured = "featured",
  none = "none",
}

export type MarkType = "bold" | "italic" | "underline" | "strike";

export interface IntegrationDetails {
  type: keyof typeof IntegrationType;
  name: string;
  description: string;
  logo: string;
  permissions: {
    info: boolean;
    contact: boolean;
  };
}

export interface Integration {
  id: string | null;
  type: IntegrationType;
  enabled: boolean;
  publicKey: string | null;
  publicUrl: string | null;
  details: IntegrationDetails;
}

export interface ConnectedXMResponse<TData> {
  status: "ok" | "error" | "redirect";
  message: string;
  data: TData;
  count?: number;
  url?: string;
  cursor?: string | number | null;
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
  description: string;
  email: string;
  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zip: string | null;
  logo: BaseImage | null;
  logoId: string | null;
  darkLogo: BaseImage | null;
  darkLogoId: string | null;
  icon: BaseImage | null;
  iconId: string | null;
  darkIcon: BaseImage | null;
  darkIconId: string | null;
  locale: string;
}

export enum Currency {
  USD = "USD",
}

export interface Organization extends BaseOrganization {
  phone: string | null;
  website: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  userPoolId: string;
  userPoolClientId: string;
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
    (organization as Omit<Organization, keyof BaseOrganization>).createdAt !==
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

export interface BaseAccount {
  id: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  image: BaseImage | null;
  needsProfileCompletion: boolean;
  accountTiers: BaseAccountTier[];
  subscriptions: {
    subscriptionProduct: {
      tiers: BaseAccountTier[];
    };
  }[];
}

export interface Account extends BaseAccount {
  banner: BaseImage | null;
  bio: string | null;
  website: string | null;
  facebook: string | null;
  instagram: string | null;
  linkedIn: string | null;
  twitter: string | null;
  tikTok: string | null;
  youtube: string | null;
  discord: string | null;
  timezone: string | null;
  blockedByAccounts?: {
    id: string;
    createdAt: string;
  }[];
  attributes: AccountAttributeValue[]; // includes public attributes
  createdAt: string;
}

export const isTypeAccount = (
  account: BaseAccount | Account
): account is Account => {
  return (account as Omit<Account, keyof BaseAccount>).bio !== undefined;
};

export enum AccountAttributeType {
  text = "text",
  number = "number",
  date = "date",
  boolean = "boolean",
}

export interface BaseAccountAttribute {
  name: string;
  label: string;
  type: AccountAttributeType;
  description: string;
  required: boolean;
  editable: boolean;
}

export interface AccountAttribute extends BaseAccountAttribute {}

export interface BaseAccountAttributeValue {
  id: string;
  attributeId: string;
  attribute: BaseAccountAttribute;
  value: string;
}

export interface AccountAttributeValue extends BaseAccountAttributeValue {}

export interface SelfRelationships {
  accounts: Record<string, boolean>;
  groups: Record<
    string,
    "moderator" | "member" | "requested" | "invited" | false
  >;
  events: Record<string, boolean>;
  channels: Record<string, boolean>;
  threads: Record<string, boolean>;
}

export interface Self extends Omit<Account, "_count"> {
  email: string | null;
  verified: boolean;
  phone: string | null;
  shareCode: string;
  chatToken?: string;
  locale: string;
  termsAccepted: string | null;
  internalRefId: string | null;
  attributes: AccountAttributeValue[]; // includes non-public attributes
  _count: {
    chatChannels: number;
    notifications: number;
  };
}

export const isSelf = (
  account: Self | Account | BaseAccount
): account is Self => {
  return (account as Omit<Self, keyof Account>).email !== undefined;
};

export interface BaseAccountAddress {
  id: string;
  primary: boolean;
  name: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}

export interface AccountAddress extends BaseAccountAddress {}

export interface AccountShare extends Account {
  email: string | null;
  phone: string | null;
}

export interface BaseActivity {
  id: string;
  message: string;
  image: BaseImage | null;
  video: BaseVideo | null;
  giphyId: string | null;
  account: BaseAccount;
  groupId: string | null;
  eventId: string | null;
  pinned: boolean;
  contentId: string | null;
  commentedId: string | null;
  createdAt: string;
  editedAt: string | null;
}

export interface Activity extends BaseActivity {
  group: BaseGroup | null;
  event: BaseEvent | null;
  content: BaseContent | null;
  commented: BaseActivity | null;
  entities: BaseActivityEntity[] | null;
  updatedAt: string;
  likes?: {
    createdAt: string;
  }[]; // if you have liked = Array > 0
  comments?: {
    id: string;
  }[]; // if you have commented = Array > 0
  reports?: {
    id: string;
    createdAt: string;
  }[]; // if you have reports = Array > 0
  _count: {
    likes: number;
    comments: number;
  };
}

export interface BaseActivityEntity {
  type: ActivityEntityType;
  startIndex: number;
  endIndex: number;
  marks: string[];
  account: BaseAccount | null;
  interest: BaseInterest | null;
  linkPreview: BaseLinkPreview | null;
}

export interface ActivityEntity extends BaseActivityEntity {}

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

export interface ActivityLike extends BaseLike {
  account: BaseAccount & {
    banner: BaseImage | null;
    chatConnected: boolean;
    accountTiers: BaseAccountTier[];
  };
  activity: BaseActivity & {
    message: string;
    featured: boolean;
    image: BaseImage | null;
    video: BaseVideo | null;
    giphyId: string | null;
    account: BaseAccount;
    groupId: string | null;
    eventId: string | null;
    commentedId: string | null;
    contentId: string | null;
  };
}

// export const isTypeLike = (like: BaseLike | Like): like is Like => {
//   return (like as Omit<Like, keyof BaseLike>).createdAt !== undefined;
// };

export enum GroupAccess {
  public = "public",
  private = "private",
}

export interface BaseGroup {
  id: string;
  slug: string;
  name: string;
  image: BaseImage | null;
  squareImage: BaseImage | null;
  access: GroupAccess;
}

export interface Group extends BaseGroup {
  description: string;
  externalUrl: string | null;
  active: boolean;
  createdAt: string;
  meeting: BaseMeeting | null;
  streams: BaseStreamInput[];
  _count: {
    members: number;
  };
}

export const isTypeGroup = (group: BaseGroup | Group): group is Group => {
  return (group as Omit<Group, keyof BaseGroup>)._count !== undefined;
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
  squareImage: BaseImage | null;
  series: BaseSeries | null;
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
  eventType: EventType;
  longDescription: string | null;
  externalUrl: string | null;
  venue: string | null;
  venueMap: BaseImage | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zip: string | null;
  groupId: string | null;
  group: Group | null;
  groupOnly: boolean;
  creatorId: string | null;
  creator: BaseAccount;
  registration: boolean;
  registrationStart: string;
  registrationEnd: string;
  registrationHeaderImageId: string | null;
  registrationHeaderImage: BaseImage | null;
  registrationFooterImageId: string | null;
  registrationFooterImage: BaseImage | null;
  registrationHideTitle: boolean;
  publicRegistrants: boolean;
  activityFeedEnabled: boolean;
  chatBotNumber: string | null;
  sessionsVisibility: EventAgendaVisibility;
  speakersVisibility: EventAgendaVisibility;
  iosAppLink: string | null;
  registrations: BaseRegistration[];
  androidAppLink: string | null;
  pages: BaseEventPage[];
  streamReplay: BaseVideo | null;
  createdAt: string;
  updatedAt: string;
  faqSections: BaseFaqSection[];
  sponsorshipLevels: EventSponsorshipLevel[];
  reservationDescription: string | null;
  backgroundImage: BaseImage | null;
  media: EventMediaItem[];
  options: Record<string, any> | null;
  meeting: BaseMeeting | null;
  streams: BaseStreamInput[];
  _count: {
    activations: number;
    sessions: number;
    speakers: number;
    sponsorshipLevels: number;
    media: number;
    roomTypes: number;
  };
}

export const isTypeEvent = (event: BaseEvent | Event): event is Event => {
  return (event as Omit<Event, keyof BaseEvent>).eventType !== undefined;
};

export interface RegistrationEventDetails extends BaseEvent {
  reservationDescription: string | null;
  externalUrl: string | null;
  registration: boolean;
  registrationCount: number;
  registrationLimit: number;
  registrationStart: string;
  registrationEnd: string;
  allowMultipleRegistrations: boolean;
  allowSplitPayment: boolean;
  splitPaymentPercentage: number;
  splitPaymentNetDays: number | null;
  splitPaymentDueDate: string | null;
  tickets: {
    enableCoupons: boolean;
  }[];
  _count: {
    sections: number;
    followups: number;
    coupons: number;
    addOns: number;
    roomTypes: number;
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
  location = "location",
}

export interface BaseRegistrationQuestion {
  id: string;
  eventId: string;
  featured: boolean;
  type: RegistrationQuestionType;
  name: string;
  required: boolean;
  description: string | null;
  label: string | null;
  placeholder: string | null;
  default: string | null;
  searchListId: string | null;
  span: number;
  mutable: boolean;
  min: string | null;
  max: string | null;
  masked: boolean;
  validation: string | null;
  validationMessage: string | null;
  locationOption: LocationQuestionOption | null;
  choices: BaseRegistrationQuestionChoice[];
}

export interface RegistrationQuestion extends BaseRegistrationQuestion {}

export const isRegistrationQuestion = (
  question: RegistrationQuestion | { questionId: string }
): question is RegistrationQuestion => {
  return (
    (question as Omit<RegistrationQuestion, "questionId">).name !== undefined
  );
};

export interface BaseRegistrationQuestionChoice {
  id: string;
  value: string;
  text: string | null;
  supply: number | null;
  description: string | null;
  sortOrder: number;
  subQuestions: RegistrationQuestion[] | { questionId: string }[];
}

export interface RegistrationQuestionChoice
  extends BaseRegistrationQuestionChoice {}

export interface BaseSearchListValue {
  id: string;
  value: string;
}

export interface SearchListValue extends BaseSearchListValue {
  createdAt: string;
  updatedAt: string;
}

export interface BaseSearchList {
  id: string;
  name: string;
}

export interface SearchList extends BaseSearchList {
  createdAt: string;
  updatedAt: string;
}

export interface BaseRegistrationQuestionResponse {
  questionId: string;
  question: BaseRegistrationQuestion;
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
  id: string;
  eventId: string;
  name: string;
  description: string | null;
  sortOrder: number;
}

export interface RegistrationSection extends BaseRegistrationSection {
  accountTiers: BaseAccountTier[];
  eventTickets: BasePassType[];
  eventAddOns: BaseEventAddOn[];
  questions: RegistrationQuestion[];
}

export interface BaseRegistrationFollowup {
  id: string;
  eventId: string;
  name: string;
  description: string | null;
  sortOrder: number;
}

export interface RegistrationFollowup extends BaseRegistrationFollowup {
  accountTiers: BaseAccountTier[];
  eventTickets: BasePassType[];
  eventAddOns: BaseEventAddOn[];
  questions: RegistrationQuestion[];
}

export interface EventListing extends Event {
  visible: boolean;
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

export interface Interest extends BaseInterest {
  image: BaseImage | null;
  imageId: string | null;
  featured: boolean;
  accounts: BaseAccount[];
  groups: BaseGroup[];
  events: BaseEvent[];
  createdAt: string;
  updatedAt: string;
}

export enum TicketVisibility {
  public = "public",
  private = "private",
}

export enum TicketEventAccessLevel {
  regular = "regular",
  virtual = "virtual",
  vip = "vip",
}
export interface BasePassType {
  id: string;
  slug: string;
  cancelable: boolean;
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
  priceSchedules: BasePassTypePriceSchedule[];
  refundSchedules: BasePassTypeRefundSchedule[];
  enableCoupons: boolean;
  minCouponQuantity: number | null;
  maxCouponQuantity: number | null;
  sortOrder: number;
  overrideStartDate: string | null;
  requiredPassTypeId: string | null;
  taxCode: string | null;
  taxIncluded: boolean;
}

export interface PassType extends BasePassType {
  visibility: TicketVisibility;
  active: boolean;
  event: BaseEvent;
  requiredPassType: BasePassType | null;
}

export interface BasePassTypePriceSchedule {
  id: string;
  ticketId: string;
  price: number;
  name: string | null;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface TicketPriceSchedule extends BasePassTypePriceSchedule {}
export interface BaseTicketRefundSchedule {
  id: string;
  percentage: number;
  startDate: string;
  endDate: string;
}

export interface TicketRefundSchedule extends BaseTicketRefundSchedule {}

export const isTypeTicket = (
  ticket: BasePassType | PassType
): ticket is PassType => {
  return (
    (ticket as Omit<PassType, keyof BasePassType>).visibility !== undefined
  );
};

export enum PurchaseStatus {
  draft = "draft",
  canceled = "canceled",
  needsInfo = "needsInfo",
  ready = "ready",
}

export interface BasePass {
  id: string;
  alternateId: number;
  location: string | null;
  usedAt: string | null;
  status: PurchaseStatus;
  attendeeId: string;
  attendee: BaseRegistration;
  ticketId: string;
  ticket: BasePassType;
  passAddOns: BasePassAddon[];
  reservationId: string | null;
  reservation: BaseEventRoomTypeReservation | null;
  responses: BaseRegistrationQuestionResponse[];
  couponId: string | null;
  coupon: BaseCoupon | null;
  packageId: string | null;
  accesses: BaseEventSessionAccess[];
  createdAt: string;
}

export interface Pass extends BasePass {
  package: BaseAttendeePackage | null;
  matches: BaseMatch[];
  lineItem: PaymentLineItem | null;
  updatedAt: string;
  payerId: string | null;
}

export interface BasePassAddon {
  addOnId: string;
  addOn: BaseEventAddOn;
  createdAt: string;
}

export interface PassAddOn extends BasePassAddon {}

export interface ListingPass extends BasePass {
  attendee: BaseRegistration & {
    account: BaseAccount & { email: string | null; phone: string | null };
  };
  updatedAt: string;
}

export const isTypePurchase = (purchase: BasePass | Pass): purchase is Pass => {
  return (purchase as Omit<Pass, keyof BasePass>).updatedAt !== undefined;
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
  purchases: BasePass[];
  accountId: string;
  account: BaseAccount;
  createdAt: string;
  updatedAt: string;
}

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
  GROUP_INVITATION = "GROUP_INVITATION",
  GROUP_REQUEST_ACCEPTED = "GROUP_REQUEST_ACCEPTED",
  CONTENT = "CONTENT",
}

export interface BaseNotification {
  id: string;
  type: NotificationType;
  read: boolean;
  sender: BaseAccount | null;
}

export interface Notification extends BaseNotification {
  like: BaseLike | null;
  activity: BaseActivity | null;
  event: BaseEvent | null;
  announcement: BaseAnnouncement | null;
  group: BaseGroup | null;
  invitation: BaseGroupInvitation | null;
  content: BaseContent | null;
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
  eventId: string;
  ticketId: string | null;
  ticket: BasePassType | null;
  prePaid: boolean;
  active: boolean;
  startDate: string | null;
  endDate: string | null;
  discountAmount: number | null;
  discountPercent: number | null;
  quantityMin: number | null;
  quantityMax: number | null;
  useLimit: number | null;
  purchaseLimit: number | null;
  emailDomains: string | null;
  applyToPassType: boolean;
  applyToAddOns: boolean;
  applyToReservation: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum CouponType {
  order = "order",
  ticket = "ticket",
}

export interface Coupon extends BaseCoupon {
  description: string | null;
}

export const isTypeCoupon = (coupon: BaseCoupon | Coupon): coupon is Coupon => {
  return (coupon as Omit<Coupon, keyof BaseCoupon>).description !== undefined;
};

export interface ManagedCoupon extends Coupon {
  registrationId: string;
  _count: {
    purchases: number;
  };
}

export const isManagedCoupon = (
  coupon: BaseCoupon | Coupon | ManagedCoupon
): coupon is ManagedCoupon => {
  return (coupon as Omit<ManagedCoupon, keyof Coupon>)._count !== undefined;
};

export interface ManagedCouponOrder {
  id: string;
  alternateId: number;
  createdAt: string;
  coupon: BaseCoupon | null;
  account: BaseAccount;
}

export interface ManagedCouponPass {
  id: string;
  status: PurchaseStatus;
  coupon: BaseCoupon;
  attendee: {
    account: BaseAccount;
  };
  createdAt: string;
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

export interface BaseTransferLog {
  id: number;
  fromRegistrationId: string;
  fromRegistration: {
    account: BaseAccount;
  };
  toRegistrationId: string;
  toRegistration: {
    account: BaseAccount;
  };
}

export interface TransferLog extends BaseTransferLog {
  purchaseId: string;
  purchase: BasePass;
  createdAt: string;
}

export interface BaseSpeaker {
  id: string;
  slug: string;
  firstName: string;
  lastName: string | null;
  bio: string | null;
  title: string | null;
  company: string | null;
  companyBio: string | null;
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
  location: BaseSessionLocation | null;
  image: BaseImage | null;
  startTime: string;
  endTime: string;
  sortOrder: number | null;
  nonSession: boolean;
  registrationEnabled: boolean;
  registrationEnd: string | null;
  price: number | null;
  access: SessionAccess;
  eventId: string;
  taxCode: string | null;
  taxIncluded: boolean;
}

export interface Session extends BaseSession {
  longDescription: string | null;
  tracks: BaseTrack[];
  speakers: BaseSpeaker[];
  sponsors: BaseAccount[];
  accounts?: BaseAccount[]; // if you have saved this session = Array > 0
  supply?: number | null;
  meeting: BaseMeeting | null;
  streams: BaseStreamInput[];
  _count: {
    sections: number;
  };
}

export const isTypeSession = (
  session: BaseSession | Session
): session is Session => {
  return (
    (session as Omit<Session, keyof BaseSession>).longDescription !== undefined
  );
};

export interface BaseSessionLocation {
  id: string;
  name: string;
  description: string | null;
  address1: string | null;
  address2: string | null;
  zip: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  image: BaseImage | null;
  googlePlaceId: string | null;
}

export interface SessionLocation extends BaseSessionLocation {
  createdAt: string | null;
  updatedAt: string | null;
}

export interface BaseEventSessionAccess {
  id: string;
  status: PurchaseStatus;
  sessionId: string;
  passId: string;
  session: BaseSession;
  responses: EventSessionQuestionResponse[];
}

export interface EventSessionAccess extends BaseEventSessionAccess {
  pass: BasePass;
  createdAt: string;
  updatedAt: string;
}

export interface BaseEventSessionSection {
  id: string;
  name: string;
  description: string | null;
  sortOrder: number;
}

export interface EventSessionSection extends BaseEventSessionSection {
  questions: EventSessionQuestion[];
}

export enum EventSessionQuestionType {
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
  quantity = "quantity",
  location = "location",
}

export interface BaseEventSessionQuestion {
  id: string;
  featured: boolean;
  type: EventSessionQuestionType;
  name: string;
  required: boolean;
  description: string | null;
  label: string | null;
  placeholder: string | null;
  default: string | null;
  searchListId: string | null;
  mutable: boolean;
  min: string | null;
  max: string | null;
  masked: boolean;
  validation: string | null;
  validationMessage: string | null;
  locationOption: LocationQuestionOption | null;
  sortOrder: number;
  choices: BaseEventSessionQuestionChoice[];
  price: number | null;
  supply: number | null;
}

export interface EventSessionQuestion extends BaseEventSessionQuestion {}

export interface BaseEventSessionQuestionChoice {
  id: string;
  value: string;
  text: string | null;
  supply: number | null;
  description: string | null;
  sortOrder: number;
  subQuestions: EventSessionQuestion[] | { questionId: string }[];
}

export interface EventSessionQuestionChoice
  extends BaseEventSessionQuestionChoice {}

export interface BaseEventSessionQuestionResponse {
  questionId: string;
  question: BaseEventSessionQuestion;
  value: string;
}

export interface EventSessionQuestionResponse
  extends BaseEventSessionQuestionResponse {}

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
  complimentaryTicket: BasePassType;
  quantity: number;
}

export interface ComplimentaryTicket extends BaseComplimentaryTicket {}

export interface BaseFaq {
  id: string;
  slug: string;
  question: string;
  answer?: string;
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
  bug = "bug",
  feedback = "feedback",
}

export enum SupportTicketState {
  new = "new",
  awaitingAdmin = "awaitingAdmin",
  awaitingClient = "awaitingClient",
  resolved = "resolved",
  spam = "spam",
}

export interface SupportTicket extends BaseSupportTicket {
  type: SupportTicketType;
  email: string;
  request: string;
  account: BaseAccount | null;
  event: BaseEvent | null;
  ticket: BasePassType | null;
  state: SupportTicketState;
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

export enum GroupMembershipRole {
  member = "member",
  moderator = "moderator",
}

export interface BaseGroupMembership {
  accountId: string;
  group: BaseGroup;
  role: GroupMembershipRole;
  activityNotificationPreference: ActivityPreference;
  announcementEmailNotification: boolean;
  announcementPushNotification: boolean;
}

export interface GroupMembership extends BaseGroupMembership {
  account: BaseAccount;
  createdAt: string;
  updatedAt: string;
}

export const isTypeGroupMembership = (
  groupMembership: BaseGroupMembership | GroupMembership
): groupMembership is GroupMembership => {
  return (
    (groupMembership as Omit<GroupMembership, keyof BaseGroupMembership>)
      .createdAt !== undefined
  );
};

export interface BaseChannel {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image: BaseImage;
  private: boolean;
  creatorId: string | null;
  _count: {
    subscribers: number;
    contents: number;
  };
}

export interface Channel extends BaseChannel {
  banner: BaseImage | null;
  priority: number;
  externalUrl: string | null;
  appleUrl: string | null;
  spotifyUrl: string | null;
  googleUrl: string | null;
  youtubeUrl: string | null;
  visilble: boolean;
  group: BaseGroup | null;
  creator: BaseAccount | null;
}

export const isTypeChannel = (
  channel: BaseChannel | Channel
): channel is Channel => {
  return (channel as Omit<Channel, keyof BaseChannel>).priority !== undefined;
};

export interface BaseChannelSubscriber {
  channelId: string;
  accountId: string;
  contentEmailNotification: boolean;
  contentPushNotification: boolean;
  activityNotificationPreference: ActivityPreference;
  updatedAt: string;
  createdAt: string;
}

export interface ChannelSubscriber extends BaseChannelSubscriber {
  channel: BaseChannel;
  account: BaseAccount;
}

export interface BaseChannelCollection {
  id: string;
  slug: string;
  channelId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChannelCollection extends BaseChannelCollection {}

export interface BaseContent {
  id: string;
  featured: boolean;
  slug: string;
  title: string | null;
  description: string | null;
  imageUrl: string | null;
  image: BaseImage | null;
  squareImage: BaseImage | null;
  audio: BaseFile | null;
  video: BaseVideo | null;
  duration: string | null;
  channel: BaseChannel;
  published: string | null;
}

export interface Content extends BaseContent {
  body: string | null;
  externalUrl: string | null;
  appleUrl: string | null;
  spotifyUrl: string | null;
  googleUrl: string | null;
  youtubeUrl: string | null;
  guests: BaseContentGuest[];
  publishSchedule: BaseSchedule | null;
  email: boolean;
  push: boolean;
  createdAt: string;
  updatedAt: string;
  likes: {
    createdAt: string;
  }[]; // if you have liked = length > 0
}

export const isTypeContent = (
  content: BaseContent | Content
): content is Content => {
  return (content as Omit<Content, keyof BaseContent>).body !== undefined;
};

export enum ContentGuestType {
  guest = "guest",
  host = "host",
  author = "author",
}

export interface BaseContentGuest {
  id: string;
  slug: string;
  contentId: string;
  accountId: string | null;
  account: BaseAccount | null;
  type: ContentGuestType;
  name: string;
  title: string | null;
  bio: string | null;
  company: string | null;
  companyLink: string | null;
  companyBio: string | null;
  imageId: string | null;
  image: BaseImage | null;
  website: string | null;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  linkedIn: string | null;
  tikTok: string | null;
  youtube: string | null;
  discord: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface ContentGuest extends BaseContentGuest {}

interface BaseRegistration {
  id: string;
  alternateId: number;
  accountId: string;
  eventId: string;
  activityNotificationPreference: ActivityPreference;
  announcementEmailNotification: boolean;
  announcementPushNotification: boolean;
}

export interface Registration extends BaseRegistration {
  event: RegistrationEventDetails;
  account: BaseAccount;
  passes: BasePass[];
  packages: BaseAttendeePackage[];
  payments: Payment[];
  coupons: ManagedCoupon[];
  createdAt: string;
  _count: {
    fromTransferLogs: number;
  };
}

export interface ListingRegistration extends BaseRegistration {
  event: RegistrationEventDetails;
  account: BaseAccount & { email: string | null; phone: string | null };
  couponId: string | null;
  coupon: BaseCoupon | null;
  passes: BasePass[];
  packages: BaseAttendeePackage[];
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
  source: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  currency: string;
  last4: string | null;
  stripeId: string | null;
  lineItems: BasePaymentLineItem[];
  createdAt: string;
}

export interface Payment extends BasePayment {
  refunds: BasePayment[];
  refunded: BasePayment | null;
  integration: { type: string };
  event: BaseEvent | null;
  registration: BaseRegistration | null;
  passType: BasePassType | null;
  pass: BasePass | null;
  session: BaseSession | null;
  place: BaseBookingPlace | null;
  space: BaseBookingSpace | null;
  membership: BaseSubscriptionProduct | null;
  coupon: BaseCoupon | null;
  invoice: BaseInvoice | null;
  lineItems: PaymentLineItem[];
}

export enum PaymentLineItemType {
  pass = "pass",
  package = "package",
  reservation = "reservation",
  addOn = "addOn",
  access = "access",
  invoice = "invoice",
  booking = "booking",
  coupon = "coupon",
  subscription = "subscription",
}

export interface BasePaymentLineItem {
  id: string;
  type: keyof typeof PaymentLineItemType;
  name: string;
  quantity: number;
  amount: number;
  paid: number;
  refunded: number;
  discount: number;
  deferred: number;
  salesTax: number;
  taxCode: string | null;
  taxIncluded: boolean;
  // PARENT
  eventId: string | null;
  accountId: string | null;
  addOnId: string | null;
  sessionId: string | null;
  placeId: string | null;
  spaceId: string | null;
  // ITEM IDS
  passId: string | null;
  packageId: string | null;
  passAddOnId: string | null;
  reservationId: string | null;
  accessId: string | null;
  bookingId: string | null;
  subscriptionId: string | null;
  paymentId: number;
}

export interface PaymentLineItem extends BasePaymentLineItem {
  pass: BasePass | null;
  package: BaseAttendeePackage | null;
  passAddOn: BasePassAddon | null;
  reservation: BaseEventRoomTypeReservation | null;
  access: BaseEventSessionAccess | null;
  invoice: BaseInvoice | null;
  booking: BaseBooking | null;
  subscription: BaseSubscription | null;
  payment: BasePayment | null;
}

export enum LeadStatus {
  new = "new",
  favorited = "favorited",
  archived = "archived",
  deleted = "deleted",
}
export interface BaseLead {
  id: string;
  firstName: string | null;
  lastName: string | null;
  shareAccount: {
    id: string;
    image: BaseImage | null;
  };
  status: LeadStatus;
  createdAt: string;
}

export interface Lead extends BaseLead {
  email: string | null;
  phone: string | null;
  website: string | null;
  facebook: string | null;
  instagram: string | null;
  linkedIn: string | null;
  twitter: string | null;
  tikTok: string | null;
  note: string | null;
  eventId: string | null;
  event: BaseEvent | null;
  attributes: { name: string; value: string }[];
  updatedAt: string;
}

export const isTypeLead = (lead: BaseLead | Lead): lead is Lead => {
  return (lead as Omit<Lead, keyof BaseLead>).email !== undefined;
};

export interface NotificationPreferences {
  newFollowerPush: boolean;
  likePush: boolean;
  resharePush: boolean;
  commentPush: boolean;
  transferPush: boolean;
  transferEmail: boolean;
  supportTicketConfirmationEmail: boolean;
  chatPush: boolean;
  chatUnreadPush: boolean;
  chatUnreadEmail: boolean;
  activityNotificationPreference: OrganizationActivityPreference;
  organizationAnnouncementEmail: boolean;
  organizationAnnouncementPush: boolean;
  groupInvitationEmail: boolean;
  groupInvitationPush: boolean;
  groupRequestAcceptedEmail: boolean;
  groupRequestAcceptedPush: boolean;
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
  name: string | null;
  model: string | null;
  brand: string | null;
  manufacturer: string | null;
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
  group: BaseGroup | null;
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

export enum EventActivationType {
  public = "public",
  private = "private",
  protected = "protected",
}

export interface BaseEventActivation {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  maxPoints: number;
  startAfter: string;
  image: BaseImage | null;
  type: EventActivationType;
  accessLevel: TicketEventAccessLevel;
}

export interface EventActivation extends BaseEventActivation {
  event: BaseEvent;
  longDescription: string | null;
  completions?: BaseEventActivationCompletion[]; // if you have completed = Array > 0
  createdAt: string;
  updatedAt: string;
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
  earnedPoints: number;
  createdAt: string;
}

export interface EventActivationCompletion
  extends BaseEventActivationCompletion {
  eventId: string;
  eventActivationId: string;
  eventActivation: BaseEventActivation;
  pass: BasePass;
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

export interface BaseLinkPreview {
  id: number;
  activityId: string;
  url: string;
  title: string | null;
  siteName: string | null;
  description: string | null;
  mediaType: string | null;
  channel: string | null;
  image: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
  video: string | null;
  favicon: string | null;
}

export interface LinkPreview extends BaseLinkPreview {}

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
  name: string;
  slug: string;
  description: string | null;
  longDescription: string | null;
  startDate: string | null;
  endDate: string | null;
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
  readyToStream: boolean;
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
  currency: string;
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

export enum InvoiceStatus {
  sent = "sent",
  paid = "paid",
  void = "void",
}

export interface BaseInvoice {
  id: string;
  alternateId: number;
  title: string;
  description: string | null;
  sentDate: string | null;
  dueDate: string;
  status: InvoiceStatus;
}

export interface Invoice extends BaseInvoice {
  lineItems: BaseInvoiceLineItem[];
  createdAt: string;
  updatedAt: string;
  type?: string;
  intentId?: string;
  connectionId?: string;
  secret?: string;
  account: Self | null;
  event: BaseEvent | null;
  organization: BaseOrganization;
  notes: string | null;
  payments: BasePayment[];
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

export interface BaseEventAddOn {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string | null;
  supply: number | null;
  price: number;
  pricePerNight: boolean;
  taxCode: string | null;
  taxIncluded: boolean;
  sortOrder: number;
  eventId: string;
  image: BaseImage | null;
  createdAt: string;
  updatedAt: string;
}

export interface EventAddOn extends BaseEventAddOn {
  event: BaseEvent;
}
export enum GroupRequestStatus {
  requested = "requested",
  rejected = "rejected",
}

export interface BaseGroupRequest {
  id: string;
  status: GroupRequestStatus;
  groupId: string;
  group: BaseGroup;
  account: BaseAccount;
  createdAt: string;
  updatedAt: string;
}

export interface GroupRequest extends BaseGroupRequest {
  group: BaseGroup;
}

export enum GroupInvitationStatus {
  invited = "invited",
  rejected = "rejected",
  canceled = "canceled",
}

export interface BaseGroupInvitation {
  id: string;
  status: GroupInvitationStatus;
  groupId: string;
  group: BaseGroup;
  account: BaseAccount;
  inviter: BaseAccount;
  createdAt: string;
  updatedAt: string;
}

export interface GroupInvitation extends BaseGroupInvitation {
  group: BaseGroup;
}

export enum EventEmailType {
  confirmation = "confirmation",
  cancellation = "cancellation",
  reminder = "reminder",
}

export interface BaseEventEmail {
  type: EventEmailType;
  eventId: string;
  body: string;
  replyTo: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventEmail extends BaseEventEmail {}

export interface InvitableAccount extends Account {
  groupRequests: {
    id: string;
    status: GroupRequestStatus;
  }[];
  groupInvitations: {
    id: string;
    status: GroupInvitationStatus;
  }[];
  groups: {
    role: GroupMembershipRole;
  }[];
}

export enum PaymentIntentSource {
  registration = "registration",
  invoice = "invoice",
  pass = "pass",
  coupon = "coupon",
  session = "session",
  booking = "booking",
}

export interface BasePaymentIntent {
  id: string;
  source: PaymentIntentSource;
  integrationId: string;
  accountId: string;
  description: string | null;
  secret: string;
  referenceId: string;
  currency: string;
  metadata: Record<string, any>;
  eventId: string | null;
  registrationId: string | null;
  invoiceId: string | null;
  bookingId: string | null;
  country: string;
  state: string;
  zip: string;
  coupon: BaseCoupon | null;
  lineItems: BasePaymentLineItem[];
  createdAt: string;
  integration: {
    connectionId: string;
    type: string;
  };
  taxIntegration: {
    connectionId: string;
    type: string;
  } | null;
}
export interface PaymentIntent extends BasePaymentIntent {
  account: BaseAccount;
  event: BaseEvent | null;
  session: BaseSession | null;
  registration: BaseRegistration | null;
  pass: BasePass | null;
  passType: BasePassType | null;
  place: BaseBookingPlace | null;
  space: BaseBookingSpace | null;
}
export interface BaseFile {
  id: number;
  name: string;
  r2Path: string;
  url?: string;
  createdAt: string;
  updatedAt: string;
}

export interface File extends BaseFile {}

export enum ThreadCircleAccountRole {
  member = "member",
  manager = "manager",
  invited = "invited",
}

export interface BaseThreadCircle {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ThreadCircle extends BaseThreadCircle {}

export interface BaseThreadCircleAccount {
  accountId: string;
  role: ThreadCircleAccountRole;
  account: BaseAccount;
}

export interface ThreadCircleAccount extends BaseThreadCircleAccount {}

export interface BaseThread {
  id: string;
  subject: string;
  image: BaseImage | null;
  lastMessageAt: string | null;
}

export enum ThreadMessageType {
  user = "user",
  bot = "bot",
  system = "system",
}

export interface Thread extends BaseThread {
  viewers: {
    accountId: string;
    lastReadAt: string | null;
  }[];
}

export interface BaseThreadViewer {
  lastReadAt: string | null;
  notifications: boolean;
  account: BaseAccount;
}

export interface ThreadViewer extends BaseThreadViewer {
  status: string;
}

export interface BaseThreadMessage {
  id: string;
  type: ThreadMessageType;
  editedAt: string | null;
  body: string;
  sentAt: string;
  accountId: string;
  viewer: BaseThreadViewer;
}

export interface ThreadMessage extends BaseThreadMessage {
  reactions: BaseThreadMessageReaction[];
}

export interface BaseThreadMessageEntity {
  type: ActivityEntityType;
  startIndex: number;
  endIndex: number;
  marks: string[];
  account: BaseAccount | null;
  linkPreview: BaseLinkPreview | null;
}

export interface ThreadMessageEntity extends BaseThreadMessageEntity {}

export interface BaseThreadMessageReaction {
  id: string;
  accountId: string;
  emojiName: string;
}

export interface ThreadMessageReaction extends BaseThreadMessageReaction {
  account: BaseAccount;
  createdAt: string;
}

export enum DefaultAuthAction {
  signIn = "signIn",
  signUp = "signUp",
}

export enum PrimaryModule {
  activities = "activities",
  events = "events",
  channels = "channels",
  groups = "groups",
  threads = "threads",
}

export enum OrganizationModuleType {
  activities = "activities",
  events = "events",
  groups = "groups",
  accounts = "accounts",
  channels = "channels",
  threads = "threads",
  storage = "storage",
  support = "support",
  sponsors = "sponsors",
  benefits = "benefits",
  interests = "interests",
  advertisements = "advertisements",
  subscriptions = "subscriptions",
  invoices = "invoices",
  announcements = "announcements",
  bookings = "bookings",
  surveys = "surveys",
}

export enum PaymentIntegrationType {
  free = "free",
  stripe = "stripe",
  paypal = "paypal",
  braintree = "braintree",
  authorizenet = "authorizenet",
  manual = "manual",
}

export interface OrganizationConfig {
  ENVIRONMENT: "prod" | "staging";
  ORGANIZATION_ID: string;
  SLUG: string;
  WEBSITE_URL: string;
  COGNITO_USERPOOL_ID: string;
  COGNITO_CLIENT_ID: string;
  COGNITO_HOSTED_URL: string;
  BUNDLE_IDENTIFIER: string | null;
  EXPO_PROJECT_ID: string | null;
  EXPO_SLUG: string | null;
  API_URL:
    | "https://client-api.connected.dev"
    | "https://staging-client-api.connected.dev";
  OPENGRAPH_URL:
    | "https://opengraph-api.connected.dev"
    | "https://staging-opengraph-api.connected.dev";
  CHAT_URL:
    | "wss://websocket.connected.dev"
    | "wss://staging-websocket.connected.dev";
  APPLE_APPSTORE_LINK: string | null;
  GOOGLE_PLAYSTORE_LINK: string | null;
  GOOGLE_TAG_MANAGER_ID: string | null;
  NAME: string;
  DESCRIPTION: string;
  PRIMARY_MODULE: PrimaryModule;
  PRIMARY_COLOR: string;
  SECONDARY_COLOR: string;
  CLIENT_THEME: string;
  LOGO: {
    LIGHT: string;
    DARK?: string;
  };
  ICON: {
    LIGHT: string;
    DARK?: string;
  };
  APP_NAME: string;
  APP_ICON: string | null;
  ADAPTIVE_ICON: string | null;
  SPLASH_SCREEN: string | null;
  SPLASH_SCREEN_COLOR: string;
  INTERNAL_REF_ID_NAME: string;
  DEFAULT_LOCALE: string;
  LOCALES: string[];
  LANGUAGES: Partial<Record<string, Record<string, string>>>;
  AUTH: {
    LAYOUT: "default" | "social";
    DEFAULT_ACTION: DefaultAuthAction;
    EMAIL: boolean;
    FACEBOOK: boolean;
    GOOGLE: boolean;
    APPLE: boolean;
    CUSTOM: OrganizationOAuth[];
    FIELDS: {
      PHONE: boolean;
      INTERNAL_REF_ID: boolean;
    };
  };
  MODULES: Record<keyof typeof OrganizationModuleType, OrganizationModule>;
  CUSTOM_MODULES: {
    name: string;
    url: string;
    iconName: string;
    color: string;
    position: "top" | "bottom";
    translations: {
      locale: string;
      name: string;
    }[];
  }[];
  SOCIAL: {
    facebook: string | null;
    instagram: string | null;
    twitter: string | null;
    linkedIn: string | null;
    tikTok: string | null;
    youtube: string | null;
    discord: string | null;
  };
  PAYMENT: {
    TYPE: PaymentIntegrationType | "none";
    CONNECTION_ID: string | null;
    CURRENCY: string;
  };
  INTEGRATIONS: Integration[];
  ATTRIBUTES: {
    id: string;
    name: string;
    label: string;
    description: string | null;
    type: AccountAttributeType;
    editable: boolean;
    required: boolean;
    public: boolean;
  }[];
  OPTIONS: Record<string, any> | null;
}
export interface OrganizationModule {
  requireAuth: boolean;
  enabled: boolean;
  enabledTiers: string[];
  editable: boolean;
  editableTiers: string[];
  options: Record<string, any>;
}

export interface OrganizationOAuth {
  name: string;
  btnText?: string | null;
  icon?: string | null;
  color: string;
  textColor: string;
  borderColor?: string | null;
}

export interface BaseSchedule {
  name: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface Schedule extends BaseSchedule {}

export interface BasePassTypeRefundSchedule {
  id: string;
  percentage: number;
  startDate: string;
  endDate: string;
}

export interface PassTypeRefundSchedule extends BasePassTypeRefundSchedule {}

export interface BaseEventRoomType {
  id: string;
  name: string;
  price: number;
  pricePerNight: boolean;
  image: BaseImage;
  minPasses: number | null;
  maxPasses: number | null;
  minStart: string | null;
  defaultStart: string | null;
  maxStart: string | null;
  minEnd: string | null;
  defaultEnd: string | null;
  maxEnd: string | null;
  taxCode: string | null;
  taxIncluded: boolean;
  sortOrder: number;
  passTypes: BaseEventRoomTypePassTypeDetails[];
  addOns: BaseEventRoomTypeAddOnDetails[];
  supply: number | null;
}

export interface EventRoomType extends BaseEventRoomType {
  description: string | null;
  createdAt: string;
  updatedAt: string;
  rooms: BaseRoom[];
}

export interface BaseRoom {
  id: string;
  roomName: string;
}

export interface Room extends BaseRoom {
  roomTypes: BaseEventRoomType[];
  reservation: BaseEventRoomTypeReservation | null;
}

export interface BaseEventRoomTypeReservation {
  id: string;
  start: string | null;
  end: string | null;
  eventRoomTypeId: string;
  eventRoomType: BaseEventRoomType;
  roomId: string | null;
  room: BaseRoom | null;
}

export interface EventRoomTypeReservation extends BaseEventRoomTypeReservation {
  createdAt: string;
  updatedAt: string;
}

export interface BaseEventRoomTypePassTypeDetails {
  id: string;
  passTypeId: string;
  passType: BasePassType;
  enabled: boolean;
  premium: number;
  includedNights: number;
  minPasses: number | null;
  maxPasses: number | null;
  minStart: string | null;
  defaultStart: string | null;
  maxStart: string | null;
  minEnd: string | null;
  defaultEnd: string | null;
  maxEnd: string | null;
}

export interface EventRoomTypePassTypeDetails
  extends BaseEventRoomTypePassTypeDetails {
  createdAt: string;
  updatedAt: string;
}

export interface BaseEventRoomTypeAddOnDetails {
  id: string;
  addOnId: string;
  minStart: string | null;
  defaultStart: string | null;
  maxStart: string | null;
  minEnd: string | null;
  defaultEnd: string | null;
  maxEnd: string | null;
}

export interface EventRoomTypeAddOnDetails
  extends BaseEventRoomTypeAddOnDetails {
  createdAt: string;
  updatedAt: string;
}

export interface BaseBookingPlace {
  id: string;
  name: string;
  slug: string;
  timezone: string;
  description: string | null;
  image: BaseImage | null;
}

export interface BookingPlace extends BaseBookingPlace {
  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface BaseBookingSpace {
  id: string;
  name: string;
  slug: string;
  supply: number;
  slotDuration: number;
  price: number;
  description: string | null;
  image: BaseImage | null;
}

export interface BookingSpace extends BaseBookingSpace {
  start: string | null;
  end: string | null;
  createdAt: string;
  updatedAt: string;
}

export enum DayOfWeek {
  sunday = "sunday",
  monday = "monday",
  tuesday = "tuesday",
  wednesday = "wednesday",
  thursday = "thursday",
  friday = "friday",
  saturday = "saturday",
}
export interface BaseBookingSpaceAvailability {
  id: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
}

export interface BookingSpaceAvailability extends BaseBookingSpaceAvailability {
  createdAt: string;
  updatedAt: string;
}

export interface BaseBookingSpaceBlackout {
  id: string;
  start: string;
  end: string;
}

export interface BookingSpaceBlackout extends BaseBookingSpaceBlackout {
  createdAt: string;
  updatedAt: string;
}

export interface BaseBooking {
  id: string;
  alternateId: number;
  day: string;
  time: string;
  duration: number;
  status: string;
}

export interface Booking extends BaseBooking {
  space: BaseBookingSpace;
  place: BaseBookingPlace;
  createdAt: string;
  updatedAt: string;
}

export interface BookingDaySlots {
  day: string;
  slots: BookingSpaceSlot[];
}

export interface BookingSpaceSlot {
  time: string;
  supply: number | null;
}

export interface BaseEventPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  passes: BaseEventPackagePass[];
  image: BaseImage | null;
  sortOrder: number;
  taxCode: string | null;
  taxIncluded: boolean;
}

export interface EventPackage extends BaseEventPackage {
  createdAt: string;
  updatedAt: string;
}

export interface BaseEventPackagePass {
  id: string;
  passTypeId: string;
  passType: BasePassType;
  quantity: number;
}

export interface EventPackagePass extends BaseEventPackagePass {
  createdAt: string;
  updatedAt: string;
}

export interface BaseAttendeePackage {
  id: string;
  attendeeId: string;
  packageId: string;
  package: BaseEventPackage;
  status: keyof typeof PurchaseStatus;
  createdAt: string;
}

export interface AttendeePackage extends BaseAttendeePackage {
  passes: BasePass[];
  updatedAt: string;
}

export interface BaseEventSponsorshipLevel {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sponsorsPerRow: number;
}

export interface EventSponsorshipLevel extends BaseEventSponsorshipLevel {
  sponsors: BaseEventSponsorship[];
  createdAt: string;
  updatedAt: string;
}

export interface BaseEventSponsorship {
  id: string;
  name: string;
  description: string | null;
  url: string | null;
  account: BaseAccount | null;
  image: BaseImage | null;
}

export interface EventSponsorship extends BaseEventSponsorship {
  createdAt: string;
  updatedAt: string;
}

export interface BaseSurvey {
  id: string;
  slug: string;
  name: string;
}

export interface Survey extends BaseSurvey {
  description: string | null;
  image: BaseImage | null;
  requireAuth: boolean;
  submissionsPerAccount: number;
}

export interface BaseSurveySection {
  id: string;
  name: string;
  description: string | null;
  sortOrder: number;
}

export interface SurveySection extends BaseSurveySection {
  questions: SurveyQuestion[];
}

export enum SurveyQuestionType {
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
  location = "location",
}

export interface BaseSurveyQuestion {
  id: string;
  featured: boolean;
  type: SurveyQuestionType;
  name: string;
  required: boolean;
  description: string | null;
  label: string | null;
  placeholder: string | null;
  default: string | null;
  searchListId: string | null;
  mutable: boolean;
  min: string | null;
  max: string | null;
  masked: boolean;
  validation: string | null;
  validationMessage: string | null;
  locationOption: LocationQuestionOption | null;
  sortOrder: number;
  choices: BaseSurveyQuestionChoice[];
}

export interface SurveyQuestion extends BaseSurveyQuestion {}

export interface BaseSurveyQuestionChoice {
  id: string;
  value: string;
  text: string | null;
  supply: number | null;
  description: string | null;
  sortOrder: number;
  subQuestions: SurveyQuestion[] | { questionId: string }[];
}

export interface SurveyQuestionChoice extends BaseSurveyQuestionChoice {}

export interface BaseSurveyQuestionResponse {
  questionId: string;
  question: BaseSurveyQuestion;
  value: string;
}

export interface SurveyQuestionResposne extends BaseSurveyQuestionResponse {}

export interface BaseSurveySubmission {
  id: string;
  responses: BaseSurveyQuestionResponse[];
  status: PurchaseStatus;
}

export interface SurveySubmission extends BaseSurveySubmission {}

export interface BaseEventMediaItem {
  id: string;
  name: string;
  description: string | null;
  imageId: string;
  image: BaseImage;
  videoId: string;
  video: BaseVideo;
  fileId: number;
  file: BaseFile;
}

export interface EventMediaItem extends BaseEventMediaItem {
  allowedPassTypes: BasePassType[];
  createdAt: string;
  updatedAt: string;
}

export interface BaseRound {
  id: string;
  number: number;
  event: BaseEvent | null;
  session: BaseSession | null;
}

export interface Round extends BaseRound {}

export interface BaseMatch {
  id: string;
  number: number;
  title: string | null;
  description: string | null;
  round: BaseRound;
}

export interface Match extends BaseMatch {}

export interface BaseActivityReport {
  id: string;
  activityId: string;
  accountId: string;
  createdAt: string;
}

export interface ActivityReport extends BaseActivityReport {
  activity: BaseActivity;
  account: BaseAccount;
}

export interface BaseBlockedAccount {
  id: string;
  blockerId: true;
  accountId: true;
  createdAt: string;
}

export interface BlockedAccount extends BaseBlockedAccount {
  account: BaseAccount;
  blocker: BaseAccount;
}

export interface BaseLogin {
  id: string;
  userPoolId: string;
  username: string;
  sub: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  internalRefId: string | null;
  status: string;
  enabled: boolean;
  verified: boolean;
}

export interface Login extends BaseLogin {
  accounts: Self[];
}

export enum MeetingType {
  GROUP_CALL = "GROUP_CALL",
  WEBINAR = "WEBINAR",
  AUDIO_ROOM = "AUDIO_ROOM",
  LIVESTREAM = "LIVESTREAM",
}

export interface BaseMeeting {
  id: string;
  title?: string;
  type: MeetingType;
}

export interface Meeting extends BaseMeeting {
  event?: BaseEvent;
  session?: BaseSession;
  group?: BaseGroup;
  streams: BaseStreamInput[];
}

export interface BaseStreamInput {
  id: string;
  connected: boolean;
  name: string;
  public: boolean;
  image: BaseImage | null;
  locale: string;
  cloudflareId: string;
}

export interface StreamInput extends BaseStreamInput {
  eventId: string | null;
  groupId: string | null;
  sessionId: string | null;
  meetingId: string | null;
}
