import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { SELF_EVENT_LISTING_REGISTRATIONS_QUERY_KEY } from "@src/queries";

export interface SelfCheckinRegistrationParams extends MutationParams {
  accountId: string;
  eventId: string;
}

export const SelfCheckinRegistration = async ({
  accountId,
  eventId,
  clientApi,
  queryClient,
}: SelfCheckinRegistrationParams) => {
  const { data } = await clientApi.post(
    `/self/events/listings/${eventId}/registrations/${accountId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_LISTING_REGISTRATIONS_QUERY_KEY(eventId, true),
    });
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_LISTING_REGISTRATIONS_QUERY_KEY(eventId, false),
    });
  }
  return data;
};

export const useSelfCheckinRegistration = (
  params: Omit<MutationParams, "queryClient" | "clientApi"> = {},
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof SelfCheckinRegistration>>,
      Omit<SelfCheckinRegistrationParams, "queryClient" | "clientApi">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    SelfCheckinRegistrationParams,
    Awaited<ReturnType<typeof SelfCheckinRegistration>>
  >(SelfCheckinRegistration, params, options);
};
