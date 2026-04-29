import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse, RegistrationDraft } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";

export interface ApplyEventRegistrationCouponParams extends MutationParams {
  eventId: string;
  draft: RegistrationDraft;
  code: string;
}

export const ApplyEventRegistrationCoupon = async ({
  eventId,
  draft,
  code,
  clientApiParams,
}: ApplyEventRegistrationCouponParams): Promise<
  ConnectedXMResponse<RegistrationDraft>
> => {
  const clientApi = await GetClientAPI(clientApiParams);

  const { data } = await clientApi.post<ConnectedXMResponse<RegistrationDraft>>(
    `/events/${eventId}/registration/coupon`,
    { draft, code }
  );

  return data;
};

export const useApplyEventRegistrationCoupon = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof ApplyEventRegistrationCoupon>>,
      Omit<
        ApplyEventRegistrationCouponParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    ApplyEventRegistrationCouponParams,
    Awaited<ReturnType<typeof ApplyEventRegistrationCoupon>>
  >(ApplyEventRegistrationCoupon, options);
};
