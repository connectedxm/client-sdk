import { ConnectedXMResponse, Content } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";

export interface SetContentPublishScheduleParams extends MutationParams {
  channelId: string;
  contentId: string;
  date: string;
}

export const SetContentPublishSchedule = async ({
  channelId,
  contentId,
  date,
  clientApiParams,
}: SetContentPublishScheduleParams): Promise<ConnectedXMResponse<Content>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Content>>(
    `/channels/${channelId}/contents/${contentId}/schedule`,
    {
      date,
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
