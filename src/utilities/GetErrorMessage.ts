import axios from "axios";
import { ConnectedXMResponse } from "../interfaces";

export const ERR_NOT_GROUP_MEMBER = 453;
export const ERR_NOT_EVENT_REGISTERED = 454;
export const ERR_REGISTRATION_UNAVAILABLE = 455;
export const ERR_FEATURE_NOT_AVAILABLE = 456;
export const ERR_TIER_REQUIRED = 457;
export const ERR_SUBSCRIPTION_REQUIRED = 458;

export const CUSTOM_ERROR_CODES = [
  ERR_NOT_GROUP_MEMBER,
  ERR_NOT_EVENT_REGISTERED,
  ERR_REGISTRATION_UNAVAILABLE,
  ERR_FEATURE_NOT_AVAILABLE,
  ERR_TIER_REQUIRED,
  ERR_SUBSCRIPTION_REQUIRED,
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
