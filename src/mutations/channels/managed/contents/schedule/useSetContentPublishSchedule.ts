import { ConnectedXMResponse, Content } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";

export interface SetContentPublishScheduleParams extends MutationParams {
  channelId: string;
  contentId: string;
  date: string;
  email?: boolean;
  push?: boolean;
  visible?: boolean;
}

export const SetContentPublishSchedule = async ({
  channelId,
  contentId,
  date,
  email,
  push,
  visible,
  clientApiParams,
}: SetContentPublishScheduleParams): Promise<ConnectedXMResponse<Content>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Content>>(
    `/channels/managed/${channelId}/contents/${contentId}/schedule`,
    {
      date,
      email,
      push,
      visible,
    }
  );

  return data;
};

export const useSetContentPublishSchedule = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof SetContentPublishSchedule>>,
      Omit<SetContentPublishScheduleParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    SetContentPublishScheduleParams,
    Awaited<ReturnType<typeof SetContentPublishSchedule>>
  >(SetContentPublishSchedule, options);
};
