import { ConnectedXMResponse, Content } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";

export interface DeleteContentPublishScheduleParams extends MutationParams {
  channelId: string;
  contentId: string;
}

export const DeleteContentPublishSchedule = async ({
  channelId,
  contentId,
  clientApiParams,
}: DeleteContentPublishScheduleParams): Promise<
  ConnectedXMResponse<Content>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<Content>>(
    `/channels/managed/${channelId}/contents/${contentId}/schedule`
  );

  return data;
};

export const useDeleteContentPublishSchedule = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteContentPublishSchedule>>,
      Omit<
        DeleteContentPublishScheduleParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteContentPublishScheduleParams,
    Awaited<ReturnType<typeof DeleteContentPublishSchedule>>
  >(DeleteContentPublishSchedule, options);
};
