import { GetClientAPI } from "@src/ClientAPI";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { SELF_EVENT_LISTING_REGISTRATIONS_QUERY_KEY } from "@src/queries";

export interface SelfCheckinRegistrationParams extends MutationParams {
  eventId: string;
  registrationId: string;
}

export const SelfCheckinRegistration = async ({
  eventId,
  registrationId,
  clientApiParams,
  queryClient,
}: SelfCheckinRegistrationParams) => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post(
    `/self/events/listings/${eventId}/registrations/${registrationId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_LISTING_REGISTRATIONS_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_LISTING_REGISTRATIONS_QUERY_KEY(eventId),
    });
  }
  return data;
};

export const useSelfCheckinRegistration = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof SelfCheckinRegistration>>,
      Omit<SelfCheckinRegistrationParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    SelfCheckinRegistrationParams,
    Awaited<ReturnType<typeof SelfCheckinRegistration>>
  >(SelfCheckinRegistration, options);
};
