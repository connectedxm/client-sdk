import {
  BaseRegistrationQuestionResponse,
  Registration,
} from "@context/interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";

import useConnectedMutation, {
  MutationParams,
} from "../../../../useConnectedMutation";

export interface UpdateSelfEventRegistrationResponsesParams
  extends MutationParams {
  eventId: string;
  registrationId: string;
  responses: BaseRegistrationQuestionResponse[];
}

export const UpdateSelfEventRegistrationResponses = async ({
  eventId,
  registrationId,
  responses,
}: UpdateSelfEventRegistrationResponsesParams) => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.put(
    `/self/events/${eventId}/registration/${registrationId}/draft/responses`,
    responses
  );

  return data;
};

export const useUpdateSelfEventRegistrationResponses = (
  eventId: string,
  registrationId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation(
    (responses: BaseRegistrationQuestionResponse[]) =>
      UpdateSelfEventRegistrationResponses({
        eventId,
        registrationId,
        responses,
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

export default useUpdateSelfEventRegistrationResponses;
