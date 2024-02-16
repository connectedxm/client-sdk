import { ConnectedXM, ConnectedXMResponse } from "@context/api/ConnectedXM";
import { Registration } from "@context/interfaces";
import { QUERY_KEY as EVENT_REGISTRATIONS } from "@context/queries/self/useGetSelfEventListingRegistrations";
import { useQueryClient } from "@tanstack/react-query";

import useConnectedMutation, { MutationParams } from "../useConnectedMutation";

interface SelfCheckinEventListingRegistrationParams extends MutationParams {
  accountId: string;
  eventId: string;
}

export const SelfCheckinEventListingRegistration = async ({
  accountId,
  eventId,
}: SelfCheckinEventListingRegistrationParams) => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/self/events/listings/${eventId}/registrations/${accountId}`,
  );
  return data;
};

export const useSelfCheckinEventLisingRegistration = (eventId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<any>(
    (params: any) =>
      SelfCheckinEventListingRegistration({ eventId, ...params }),
    {
      onSuccess: (_response: ConnectedXMResponse<Registration>) => {
        queryClient.invalidateQueries([EVENT_REGISTRATIONS, eventId]);
      },
    },
  );
};

export default useSelfCheckinEventLisingRegistration;
