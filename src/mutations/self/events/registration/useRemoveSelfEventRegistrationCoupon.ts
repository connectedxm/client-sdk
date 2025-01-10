import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { SELF_EVENT_REGISTRATION_QUERY_KEY } from "@src/queries";

export interface RemoveSelfEventRegistrationCouponParams
  extends MutationParams {
  eventId: string;
}

export const RemoveSelfEventRegistrationCoupon = async ({
  eventId,
  clientApiParams,
  queryClient,
}: RemoveSelfEventRegistrationCouponParams): Promise<
  ConnectedXMResponse<null>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<null>>(
    `/self/events/${eventId}/registration/coupon`
  );

  if (queryClient && data.status === "ok") {
    queryClient.removeQueries({
      queryKey: SELF_EVENT_REGISTRATION_QUERY_KEY(eventId),
    });
  }

  return data;
};

export const useRemoveSelfEventRegistrationCoupon = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof RemoveSelfEventRegistrationCoupon>>,
      Omit<
        RemoveSelfEventRegistrationCouponParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveSelfEventRegistrationCouponParams,
    Awaited<ReturnType<typeof RemoveSelfEventRegistrationCoupon>>
  >(RemoveSelfEventRegistrationCoupon, options);
};
