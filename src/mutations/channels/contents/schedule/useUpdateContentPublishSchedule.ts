import { ConnectedXMResponse, Content } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";

export interface UpdateContentPublishScheduleParams extends MutationParams {
  channelId: string;
  contentId: string;
  date: string;
}

export const UpdateContentPublishSchedule = async ({
  channelId,
  contentId,
  date,
  clientApiParams,
}: UpdateContentPublishScheduleParams): Promise<
  ConnectedXMResponse<Content>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<Content>>(
    `/channels/${channelId}/contents/${contentId}/schedule`,
    {
      date,
    }
  );

  return data;
};

export const useUpdateContentPublishSchedule = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateContentPublishSchedule>>,
      Omit<
        UpdateContentPublishScheduleParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateContentPublishScheduleParams,
    Awaited<ReturnType<typeof UpdateContentPublishSchedule>>
  >(UpdateContentPublishSchedule, options);
};
