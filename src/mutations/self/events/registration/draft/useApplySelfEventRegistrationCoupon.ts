import { ConnectedXMResponse, Registration } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_QUERY_KEY,
  EVENT_REGISTRANTS_QUERY_KEY,
  SELF_EVENTS_QUERY_KEY,
  SELF_EVENT_REGISTRATION_CHECKOUT_QUERY_KEY,
  SET_SELF_EVENT_REGISTRATION_QUERY_DATA,
} from "@src/queries";

export interface SelectSelfEventRegistrationCouponParams
  extends MutationParams {
  eventId: string;
  registrationId: string;
  couponId: string;
}

export const SelectSelfEventRegistrationCoupon = async ({
  eventId,
  registrationId,
  couponId,
  clientApi,
  queryClient,
  locale = "en",
}: SelectSelfEventRegistrationCouponParams): Promise<
  ConnectedXMResponse<Registration>
> => {
  const { data } = await clientApi.post<ConnectedXMResponse<Registration>>(
    `/self/events/${eventId}/registration/${registrationId}/draft/coupon`,
    {
      couponId,
    }
  );

  if (queryClient && data.status === "ok") {
    SET_SELF_EVENT_REGISTRATION_QUERY_DATA(queryClient, [eventId], data, [
      locale,
    ]);
    queryClient.removeQueries({
      queryKey: SELF_EVENT_REGISTRATION_CHECKOUT_QUERY_KEY(
        eventId,
        registrationId
      ),
    });
    queryClient.invalidateQueries({
      queryKey: SELF_EVENTS_QUERY_KEY(false),
    });
    queryClient.invalidateQueries({
      queryKey: SELF_EVENTS_QUERY_KEY(true),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_REGISTRANTS_QUERY_KEY(eventId),
    });
  }
  return data;
};

export const useSelectSelfEventRegistrationCoupon = (
  params: Omit<MutationParams, "clientApi" | "queryClient"> = {},
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof SelectSelfEventRegistrationCoupon>>,
      Omit<SelectSelfEventRegistrationCouponParams, "queryClient" | "clientApi">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    SelectSelfEventRegistrationCouponParams,
    Awaited<ReturnType<typeof SelectSelfEventRegistrationCoupon>>
  >(SelectSelfEventRegistrationCoupon, params, options);
};
