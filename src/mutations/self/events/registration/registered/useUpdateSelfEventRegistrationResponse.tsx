import { Registration } from "@context/interfaces";
import useConnectedMutation, {
  MutationParams,
} from "@context/mutations/useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";

export interface UpdateSelfEventRegistrationResponseParams
  extends MutationParams {
  eventId: string;
  registrationId: string;
  questionId: string;
  response: string;
}

export const UpdateSelfEventRegistrationResponse = async ({
  eventId,
  registrationId,
  questionId,
  response,
}: UpdateSelfEventRegistrationResponseParams) => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.put(
    `/self/events/${eventId}/registration/${registrationId}/registered/response`,
    {
      response,
    },
    {
      params: {
        questionId,
      },
    }
  );

  return data;
};

export const useUpdateSelfEventRegistrationResponse = (
  eventId: string,
  registrationId: string,
  questionId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation(
    (response: string) =>
      UpdateSelfEventRegistrationResponse({
        eventId,
        registrationId,
        questionId,
        response,
      }),
    {
      onSuccess: (response: ConnectedXMResponse<Registration>) => {
        queryClient.setQueryData(
          ["SELF_EVENT_REGISTRATION", eventId],
          response
        );
      },
    }
  );
};

export default useUpdateSelfEventRegistrationResponse;
