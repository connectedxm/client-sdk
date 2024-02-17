import { UpdateCommentsSingle } from "../activities/optimistic/UpdateComments";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { Activity, ConnectedXMResponse } from "@src/interfaces";

export interface CreateActivity {
  message: string;
  contentId?: string;
  eventId?: string;
  communityId?: string;
  commentedId?: string;
}
export interface SelfCreateActivityParams extends MutationParams {
  activity: CreateActivity;
  base64Image?: any;
}

export const SelfCreateActivity = async ({
  activity,
  base64Image,
  clientApi,
  queryClient,
}: SelfCreateActivityParams): Promise<ConnectedXMResponse<Activity>> => {
  if (queryClient) {
    if (activity.commentedId) {
      UpdateCommentsSingle(true, queryClient, [
        ACTIVITY,
        data.activity.commentedId,
      ]);
      UpdateCommentsInfinite(
        true,
        queryClient,
        [ACTIVITIES],
        data.activity.commentedId
      );
    }
  }

  const { data } = await clientApi.post<ConnectedXMResponse<Activity>>(
    `/self/activities`,
    {
      activity,
      buffer: base64Image ? `data:image/jpeg;base64,${base64Image}` : undefined,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries([ACTIVITIES]);

    AppendInfiniteQuery(queryClient, [ACTIVITIES, ""], response?.data);
    AppendInfiniteQuery(
      queryClient,
      [ACTIVITIES, SELF_ACTIVITIES],
      response?.data
    );

    if (response.data.contentId) {
      AppendInfiniteQuery(
        queryClient,
        [ACTIVITIES, CONTENT_ACTIVITIES, response.data.contentId, ""],
        response?.data
      );
    }

    if (response.data.eventId) {
      AppendInfiniteQuery(
        queryClient,
        [ACTIVITIES, EVENT_ACTIVITIES, response.data.eventId, ""],
        response?.data
      );
    }

    if (response.data.communityId) {
      AppendInfiniteQuery(
        queryClient,
        [ACTIVITIES, COMMUNITY_ACTIVITIES, response.data.communityId, ""],
        response?.data
      );
    }

    if (response.data.commentedId) {
      AppendInfiniteQuery(
        queryClient,
        [ACTIVITIES, COMMUNITY_ACTIVITIES, response.data.communityId, ""],
        response?.data
      );
    }
  }
  return data;
};

export const useSelfCreateActivity = (
  options: MutationOptions<
    Awaited<ReturnType<typeof SelfCreateActivity>>,
    SelfCreateActivityParams
  >
) => {
  return useConnectedMutation<
    SelfCreateActivityParams,
    Awaited<ReturnType<typeof SelfCreateActivity>>
  >((params) => SelfCreateActivity({ ...params }), options);
};

export default useSelfCreateActivity;
