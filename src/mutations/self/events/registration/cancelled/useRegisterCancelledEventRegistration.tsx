import { Registration } from "@context/interfaces";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { QUERY_KEY as EVENT } from "@context/queries/events/useGetEvent";
import { QUERY_KEY as EVENT_REGISTRANTS } from "@context/queries/events/useGetEventRegistrants";
import { QUERY_KEY as EVENT_REGISTRATION } from "@context/queries/self/registration/useGetSelfEventRegistration";
import { QUERY_KEY as SELF_EVENTS } from "@context/queries/self/useGetSelfEvents";
import { useQueryClient } from "@tanstack/react-query";
import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";

interface RegisterCancelledEventRegistrationParams {
  eventId: string;
  registrationId: string;
}

export const RegisterCancelledEventRegistration = async ({
  eventId,
  registrationId,
}: RegisterCancelledEventRegistrationParams) => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/self/events/${eventId}/registration/${registrationId}/cancelled/register`
  );
  return data;
};

export const useRegisterCancelledEventRegistration = (
  eventId: string,
  registrationId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<
    Omit<RegisterCancelledEventRegistrationParams, "eventId" | "registrationId">
  >(
    (params) =>
      RegisterCancelledEventRegistration({
        eventId,
        registrationId,
        ...params,
      }),
    {
      onSuccess: (response: ConnectedXMResponse<Registration>) => {
        queryClient.setQueryData([EVENT_REGISTRATION, eventId], response);
        queryClient.invalidateQueries([SELF_EVENTS]);
        queryClient.invalidateQueries([EVENT, eventId]);
        queryClient.invalidateQueries([EVENT_REGISTRANTS, eventId]);
      },
    }
  );
};

export default useRegisterCancelledEventRegistration;
