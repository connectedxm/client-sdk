import { GetClientAPI } from "@src/ClientAPI";
import { BaseCoupon, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { SELF_EVENT_REGISTRATION_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Self
 */
export interface SelectSelfEventRegistrationCouponParams
  extends MutationParams {
  eventId: string;
  couponCode: string;
  passes: {
    id: string;
    ticketId: string;
    couponId?: string;
    packageId?: string;
  }[];
  packages: {
    id: string;
    packageId: string;
  }[];
}

/**
 * @category Methods
 * @group Self
 */
export const SelectSelfEventRegistrationCoupon = async ({
  eventId,
  passes,
  packages,
  couponCode,
  clientApiParams,
  queryClient,
}: SelectSelfEventRegistrationCouponParams): Promise<
  ConnectedXMResponse<BaseCoupon>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<BaseCoupon>>(
    `/self/events/${eventId}/registration/coupon`,
    { passes, packages, couponCode }
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

/**
 * @category Mutations
 * @group Self
 */
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
