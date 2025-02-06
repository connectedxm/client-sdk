import { GetClientAPI } from "@src/ClientAPI";
import { BaseCoupon, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { SELF_EVENT_REGISTRATION_QUERY_KEY } from "@src/queries";

export interface SelectSelfEventRegistrationCouponParams
  extends MutationParams {
  eventId: string;
  couponCode: string;
  passes: {
    id: string;
    ticketId: string;
  }[];
}

export const SelectSelfEventRegistrationCoupon = async ({
  eventId,
  passes,
  couponCode,
  clientApiParams,
  queryClient,
}: SelectSelfEventRegistrationCouponParams): Promise<
  ConnectedXMResponse<BaseCoupon>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<BaseCoupon>>(
    `/self/events/${eventId}/registration/coupon`,
    { passes, couponCode }
  );

  if (queryClient && data.status === "ok") {
    queryClient.removeQueries({
      queryKey: SELF_EVENT_REGISTRATION_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      predicate: ({ queryKey }) => {
        return queryKey.includes("INTENT");
      },
    });
  }

  return data;
};

export const useSelectSelfEventRegistrationCoupon = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof SelectSelfEventRegistrationCoupon>>,
      Omit<
        SelectSelfEventRegistrationCouponParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    SelectSelfEventRegistrationCouponParams,
    Awaited<ReturnType<typeof SelectSelfEventRegistrationCoupon>>
  >(SelectSelfEventRegistrationCoupon, options);
};
