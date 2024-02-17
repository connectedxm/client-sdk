export interface RegisterCancelledEventRegistrationParams {
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
