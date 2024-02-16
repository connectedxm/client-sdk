import { Registration } from "@context/interfaces";
import useConnectedMutation, {
  MutationParams,
} from "@context/mutations/useConnectedMutation";
import { QUERY_KEY as EVENT } from "@context/queries/events/useGetEvent";
import { QUERY_KEY as EVENT_REGISTRANTS } from "@context/queries/events/useGetEventRegistrants";
import { QUERY_KEY as EVENT_REGISTRATION } from "@context/queries/self/registration/useGetSelfEventRegistration";
import { SELF_EVENT_REGISTRATION_CHECKOUT_QUERY_KEY } from "@context/queries/self/registration/useGetSelfEventRegistrationCheckout";
import { QUERY_KEY as SELF_EVENTS } from "@context/queries/self/useGetSelfEvents";
import { useQueryClient } from "@tanstack/react-query";
import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";

interface RemoveSelfEventRegistrationCouponParams extends MutationParams {
  eventId: string;
  registrationId: string;
}

export const RemoveSelfEventRegistrationCoupon = async ({
  eventId,
  registrationId,
}: RemoveSelfEventRegistrationCouponParams) => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/self/events/${eventId}/registration/${registrationId}/draft/coupon`
  );
  return data;
};

export const useRemoveSelfEventRegistrationCoupon = (
  eventId: string,
  registrationId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<any>(
    () => RemoveSelfEventRegistrationCoupon({ eventId, registrationId }),
    {
      onSuccess: (response: ConnectedXMResponse<Registration>) => {
        queryClient.removeQueries(
          SELF_EVENT_REGISTRATION_CHECKOUT_QUERY_KEY(eventId, registrationId)
        );
        queryClient.setQueryData([EVENT_REGISTRATION, eventId], response);
        queryClient.invalidateQueries([SELF_EVENTS]);
        queryClient.invalidateQueries([EVENT, eventId]);
        queryClient.invalidateQueries([EVENT_REGISTRANTS, eventId]);
      },
    }
  );
};

export default useRemoveSelfEventRegistrationCoupon;
