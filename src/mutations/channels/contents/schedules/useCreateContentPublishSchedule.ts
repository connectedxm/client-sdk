import { ConnectedXMResponse, Content } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import { ContentPublishScheduleSetInputs } from "@src/params";

/**
 * @category Params
 * @group Channels
 */
export interface CreateContentPublishScheduleParams extends MutationParams {
  channelId: string;
  contentId: string;
  schedule: ContentPublishScheduleSetInputs;
}

/**
 * @category Methods
 * @group Channels
 */
export const CreateContentPublishSchedule = async ({
  channelId,
  contentId,
  schedule,
  clientApiParams,
}: CreateContentPublishScheduleParams): Promise<ConnectedXMResponse<Content>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Content>>(
    `/channels/${channelId}/contents/${contentId}/schedule`,
    schedule
  );

  return data;
};

/**
 * @category Mutations
 * @group Channels
 */
export const useCreateContentPublishSchedule = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateContentPublishSchedule>>,
      Omit<CreateContentPublishScheduleParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateContentPublishScheduleParams,
    Awaited<ReturnType<typeof CreateContentPublishSchedule>>
  >(CreateContentPublishSchedule, options);
};
