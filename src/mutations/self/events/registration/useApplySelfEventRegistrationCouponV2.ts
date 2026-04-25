import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse, RegistrationDraft } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import {
  SELF_EVENT_REGISTRATION_INTENT_QUERY_KEY,
  SELF_EVENT_REGISTRATION_QUERY_KEY,
} from "@src/queries";

export interface ApplySelfEventRegistrationCouponV2Params
  extends MutationParams {
  eventId: string;
  draftId: string;
  code: string;
}

export const ApplySelfEventRegistrationCouponV2 = async ({
  eventId,
  draftId,
  code,
  clientApiParams,
  queryClient,
}: ApplySelfEventRegistrationCouponV2Params): Promise<
  ConnectedXMResponse<RegistrationDraft>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<RegistrationDraft>>(
    `/self/events/${eventId}/registration/v2/draft/${draftId}/coupon`,
    { code }
  );

  if (queryClient && data.status === "ok") {
    queryClient.removeQueries({
      queryKey: SELF_EVENT_REGISTRATION_QUERY_KEY(eventId),
    });
    queryClient.removeQueries({
      queryKey: SELF_EVENT_REGISTRATION_INTENT_QUERY_KEY(eventId),
      exact: false,
    });
  }

  return data;
};

export const useApplySelfEventRegistrationCouponV2 = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof ApplySelfEventRegistrationCouponV2>>,
      Omit<
        ApplySelfEventRegistrationCouponV2Params,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    ApplySelfEventRegistrationCouponV2Params,
    Awaited<ReturnType<typeof ApplySelfEventRegistrationCouponV2>>
  >(ApplySelfEventRegistrationCouponV2, options);
};
