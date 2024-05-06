import { GetClientAPI } from "@src/ClientAPI";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { LISTING_REGISTRATIONS_QUERY_KEY } from "@src/queries";

export interface CheckinListingRegistrationParams extends MutationParams {
  eventId: string;
  registrationId: string;
}

export const CheckinListingRegistration = async ({
  eventId,
  registrationId,
  clientApiParams,
  queryClient,
}: CheckinListingRegistrationParams) => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post(
    `/listings/${eventId}/registrations/${registrationId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: LISTING_REGISTRATIONS_QUERY_KEY(eventId),
    });
  }

  return data;
};

export const useCheckinListingRegistration = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CheckinListingRegistration>>,
      Omit<CheckinListingRegistrationParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CheckinListingRegistrationParams,
    Awaited<ReturnType<typeof CheckinListingRegistration>>
  >(CheckinListingRegistration, options);
};
