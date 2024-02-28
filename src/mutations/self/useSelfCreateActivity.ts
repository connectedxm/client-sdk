import {
  ACTIVITIES_QUERY_KEY,
  ACTIVITY_QUERY_KEY,
  COMMUNITY_ACTIVITIES_QUERY_KEY,
  CONTENT_ACTIVITIES_QUERY_KEY,
  EVENT_ACTIVITIES_QUERY_KEY,
  SELF_ACTIVITIES_QUERY_KEY,
  SELF_FEED_QUERY_KEY,
} from "@src/queries";
import {
  UpdateCommentsInfinite,
  UpdateCommentsSingle,
} from "../activities/optimistic/UpdateComments";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { Activity, ConnectedXMResponse } from "@src/interfaces";
import { AppendInfiniteQuery } from "@src/utilities";
import { GetClientAPI } from "@src/ClientAPI";

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
  videoUri?: string;
}

export const SelfCreateActivity = async ({
  activity,
  base64Image,
  videoUri,
  clientApiParams,
  queryClient,
}: SelfCreateActivityParams): Promise<ConnectedXMResponse<Activity>> => {
  if (queryClient) {
    if (activity.commentedId) {
      UpdateCommentsSingle(true, queryClient, [
        ...ACTIVITY_QUERY_KEY(activity.commentedId),
        clientApiParams.locale,
      ]);
      UpdateCommentsInfinite(
        true,
        queryClient,
        [...ACTIVITIES_QUERY_KEY(), clientApiParams.locale],
        activity.commentedId
      );
    }
  }

  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Activity>>(
    `/self/activities`,
    {
      activity,
      buffer: base64Image ? `data:image/jpeg;base64,${base64Image}` : undefined,
      videoUri: videoUri || undefined,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: [...ACTIVITIES_QUERY_KEY(), clientApiParams.locale],
    });

    AppendInfiniteQuery<Activity>(
      queryClient,
      [...ACTIVITIES_QUERY_KEY(), clientApiParams.locale],
      data.data
    );

    if (!data.data.commented?.id) {
      AppendInfiniteQuery(
        queryClient,
        [...SELF_FEED_QUERY_KEY(), clientApiParams.locale],
        data
      );
    }

    AppendInfiniteQuery<Activity>(
      queryClient,
      [...SELF_ACTIVITIES_QUERY_KEY(), clientApiParams.locale],
      data.data
    );

    if (data.data?.content?.id) {
      AppendInfiniteQuery<Activity>(
        queryClient,
        [
          ...CONTENT_ACTIVITIES_QUERY_KEY(data.data.content.id),
          clientApiParams.locale,
        ],
        data.data
      );
    }

    if (data.data?.event?.id) {
      AppendInfiniteQuery<Activity>(
        queryClient,
        [
          ...EVENT_ACTIVITIES_QUERY_KEY(data.data.event.id),
          clientApiParams.locale,
        ],
        data.data
      );
    }

    if (data.data?.community?.id) {
      AppendInfiniteQuery<Activity>(
        queryClient,
        [
          ...COMMUNITY_ACTIVITIES_QUERY_KEY(data.data.community.id),
          clientApiParams.locale,
        ],
        data.data
      );
    }
  }
  return data;
};

export const useSelfCreateActivity = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof SelfCreateActivity>>,
      Omit<SelfCreateActivityParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    SelfCreateActivityParams,
    Awaited<ReturnType<typeof SelfCreateActivity>>
  >(SelfCreateActivity, options);
};
