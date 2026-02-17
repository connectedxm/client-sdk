import axios from "axios";
import { ConnectedXMResponse } from "../interfaces";

export const ERR_NOT_GROUP_MEMBER = 453;
export const ERR_NOT_EVENT_REGISTERED = 454;
export const ERR_REGISTRATION_UNAVAILABLE = 455;
export const ERR_FEATURE_NOT_AVAILABLE = 456;
export const ERR_TIER_REQUIRED = 457;
export const ERR_INTEGRATION_PERMISSION_DENIED = 459;
export const ERR_KNOWN_ERROR = 460;
export const ERR_PRIVATE_CHANNEL = 461;
export const ERR_BANNED_USER = 462;
export const ERR_NO_ACCOUNT_SELECTED = 463;
export const ERR_REGISTER_THROUGH_SERIES = 464;

export const CUSTOM_ERROR_CODES = [
  ERR_NOT_GROUP_MEMBER,
  ERR_NOT_EVENT_REGISTERED,
  ERR_REGISTRATION_UNAVAILABLE,
  ERR_FEATURE_NOT_AVAILABLE,
  ERR_TIER_REQUIRED,
  ERR_INTEGRATION_PERMISSION_DENIED,
  ERR_KNOWN_ERROR,
  ERR_PRIVATE_CHANNEL,
  ERR_BANNED_USER,
  ERR_NO_ACCOUNT_SELECTED,
  ERR_REGISTER_THROUGH_SERIES,
];

export const GetErrorMessage = (
  error: any,
  fallback: string = "Something went wrong"
) => {
  let message: string = fallback;
  if (axios.isAxiosError(error)) {
    message =
      (error.response?.data as ConnectedXMResponse<any>)?.message || message;
  } else {
    message = (error as Error).message;
  }

  return message;
};
