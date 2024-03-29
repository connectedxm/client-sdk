import {
  ACTIVITIES_QUERY_KEY,
  ACTIVITY_COMMENTS_QUERY_KEY,
  ACTIVITY_QUERY_KEY,
  COMMUNITY_ACTIVITIES_QUERY_KEY,
  CONTENT_ACTIVITIES_QUERY_KEY,
  EVENT_ACTIVITIES_QUERY_KEY,
  GetBaseSingleQueryKeys,
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
import { GetClientAPI } from "@src/ClientAPI";
import { AppendInfiniteQuery } from "@src/utilities";
import { GetBaseInfiniteQueryKeys } from "@src/queries/useConnectedInfiniteQuery";

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
        ...GetBaseSingleQueryKeys(clientApiParams.locale),
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
      imageUri: base64Image ?? undefined,
      videoUri: videoUri ?? undefined,
    }
  );

  if (queryClient && data.status === "ok") {
    let nested = false;

    if (activity.commentedId) {
      nested = true;
      AppendInfiniteQuery<Activity>(
        queryClient,
        [
          ...ACTIVITY_COMMENTS_QUERY_KEY(activity.commentedId),
          ...GetBaseInfiniteQueryKeys(clientApiParams.locale),
        ],
        data.data
      );
    }

    if (activity.contentId) {
      nested = true;
      AppendInfiniteQuery<Activity>(
        queryClient,
        [
          ...CONTENT_ACTIVITIES_QUERY_KEY(activity.contentId),
          ...GetBaseInfiniteQueryKeys(clientApiParams.locale),
        ],
        data.data
      );
    }

    if (activity.eventId) {
      nested = true;
      AppendInfiniteQuery<Activity>(
        queryClient,
        [
          ...EVENT_ACTIVITIES_QUERY_KEY(activity.eventId),
          ...GetBaseInfiniteQueryKeys(clientApiParams.locale),
        ],
        data.data
      );
    }

    if (activity.communityId) {
      nested = true;
      AppendInfiniteQuery<Activity>(
        queryClient,
        [
          ...COMMUNITY_ACTIVITIES_QUERY_KEY(activity.communityId),
          ...GetBaseInfiniteQueryKeys(clientApiParams.locale),
        ],
        data.data
      );
    }

    if (!nested) {
      AppendInfiniteQuery<Activity>(
        queryClient,
        [
          ...ACTIVITIES_QUERY_KEY(),
          ...GetBaseInfiniteQueryKeys(clientApiParams.locale),
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
