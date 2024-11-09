import {
  ACTIVITIES_QUERY_KEY,
  ACTIVITY_COMMENTS_QUERY_KEY,
  ACTIVITY_QUERY_KEY,
  GROUP_ACTIVITIES_QUERY_KEY,
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
import { CHANNEL_CONTENT_ACTIVITIES_QUERY_KEY } from "@src/queries/channels";
import { ActivityCreateInputs, InterestCreateInputs } from "@src/params";

export interface SelfCreateActivityParams extends MutationParams {
  activity: ActivityCreateInputs;
  base64Image?: any;
  interests?: InterestCreateInputs[];
}

export const SelfCreateActivity = async ({
  activity,
  base64Image,
  interests,
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
      interests: interests ?? undefined,
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

    if (activity.contentId && data.data.content) {
      nested = true;
      AppendInfiniteQuery<Activity>(
        queryClient,
        [
          ...CHANNEL_CONTENT_ACTIVITIES_QUERY_KEY(
            data.data.content.channel.slug,
            activity.contentId
          ),
          ...GetBaseInfiniteQueryKeys(clientApiParams.locale),
        ],
        data.data
      );
      AppendInfiniteQuery<Activity>(
        queryClient,
        [
          ...CHANNEL_CONTENT_ACTIVITIES_QUERY_KEY(
            data.data.content.channel.id,
            activity.contentId
          ),
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

    if (activity.groupId) {
      nested = true;
      AppendInfiniteQuery<Activity>(
        queryClient,
        [
          ...GROUP_ACTIVITIES_QUERY_KEY(activity.groupId),
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
