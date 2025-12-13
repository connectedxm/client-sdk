import { ConnectedXMResponse, Content } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";

/**
 * @category Params
 * @group Channels
 */
export interface DeleteContentPublishScheduleParams extends MutationParams {
  channelId: string;
  contentId: string;
}

/**
 * @category Methods
 * @group Channels
 */
export const DeleteContentPublishSchedule = async ({
  channelId,
  contentId,
  clientApiParams,
}: DeleteContentPublishScheduleParams): Promise<
  ConnectedXMResponse<Content>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<Content>>(
    `/channels/${channelId}/contents/${contentId}/schedule`
  );

  return data;
};

/**
 * @category Mutations
 * @group Channels
 */
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
