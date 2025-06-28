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
} from "./optimistic/UpdateComments";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import {
  Activity,
  ConnectedXMResponse,
  ActivityEntityType,
  MarkType,
} from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { AppendInfiniteQuery } from "@src/utilities";
import { GetBaseInfiniteQueryKeys } from "@src/queries/useConnectedInfiniteQuery";
import { CHANNEL_CONTENT_ACTIVITIES_QUERY_KEY } from "@src/queries/channels";

export interface BaseActivityEntityInput {
  type: ActivityEntityType;
  startIndex: number;
  endIndex: number;
  marks: MarkType[];
}

export interface MentionInput extends BaseActivityEntityInput {
  type: ActivityEntityType.mention;
  accountId: string;
}

export interface LinkInput extends BaseActivityEntityInput {
  type: ActivityEntityType.link;
  href: string;
}

export interface InterestInput extends BaseActivityEntityInput {
  type: ActivityEntityType.interest;
  interestId: string;
}

export interface SegmentInput extends BaseActivityEntityInput {
  type: ActivityEntityType.segment;
}

export type ActivityEntityInput =
  | MentionInput
  | LinkInput
  | InterestInput
  | SegmentInput;

interface ActivityCreateParams {
  message: string;
  entities: ActivityEntityInput[];
  imageId?: string;
  videoId?: string;
  eventId?: string;
  groupId?: string;
  contentId?: string;
  commentedId?: string;
}

export interface CreateActivityParams extends MutationParams {
  activity: ActivityCreateParams;
}

export const CreateActivity = async ({
  activity,
  clientApiParams,
  queryClient,
}: CreateActivityParams): Promise<ConnectedXMResponse<Activity>> => {
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
    `/activities`,
    activity
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

      const iDIDKey = [
        ...CHANNEL_CONTENT_ACTIVITIES_QUERY_KEY(
          data.data.content.channel.id,
          activity.contentId
        ),
        ...GetBaseInfiniteQueryKeys(clientApiParams.locale),
      ];

      const slugIDKey = [
        ...CHANNEL_CONTENT_ACTIVITIES_QUERY_KEY(
          data.data.content.channel.slug,
          activity.contentId
        ),
        ...GetBaseInfiniteQueryKeys(clientApiParams.locale),
      ];

      const iDSlugKey = [
        ...CHANNEL_CONTENT_ACTIVITIES_QUERY_KEY(
          data.data.content.channel.id,
          data.data.content.slug
        ),
        ...GetBaseInfiniteQueryKeys(clientApiParams.locale),
      ];

      const slugSlugKey = [
        ...CHANNEL_CONTENT_ACTIVITIES_QUERY_KEY(
          data.data.content.channel.slug,
          data.data.content.slug
        ),
        ...GetBaseInfiniteQueryKeys(clientApiParams.locale),
      ];

      AppendInfiniteQuery<Activity>(
        queryClient,
        iDIDKey,
        data.data
      );
      AppendInfiniteQuery<Activity>(
        queryClient,
        iDSlugKey,
        data.data
      );
      AppendInfiniteQuery<Activity>(
        queryClient,
        slugIDKey,
        data.data
      );
      AppendInfiniteQuery<Activity>(
        queryClient,
        slugSlugKey,
        data.data
      );
    }

    if (activity.eventId) {
      nested = true;

      const iDKey = [
        ...EVENT_ACTIVITIES_QUERY_KEY(activity.eventId),
        ...GetBaseInfiniteQueryKeys(clientApiParams.locale),
      ];

      const slugKey = [
        ...EVENT_ACTIVITIES_QUERY_KEY(data.data.event?.slug || ""),
        ...GetBaseInfiniteQueryKeys(clientApiParams.locale),
      ];

      AppendInfiniteQuery<Activity>(
        queryClient,
        iDKey,
        data.data,
      );
      AppendInfiniteQuery<Activity>(
        queryClient,
        slugKey,
        data.data
      );
    }

    if (activity.groupId) {
      nested = true;

      const iDKey = [
        ...GROUP_ACTIVITIES_QUERY_KEY(activity.groupId),
        ...GetBaseInfiniteQueryKeys(clientApiParams.locale),
      ];

      const slugKey = [
        ...GROUP_ACTIVITIES_QUERY_KEY(data.data.group?.slug || ""),
        ...GetBaseInfiniteQueryKeys(clientApiParams.locale),
      ];

      AppendInfiniteQuery<Activity>(
        queryClient,
        iDKey,
        data.data
      );
      AppendInfiniteQuery<Activity>(
        queryClient,
        slugKey,
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

export const useCreateActivity = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateActivity>>,
      Omit<CreateActivityParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateActivityParams,
    Awaited<ReturnType<typeof CreateActivity>>
  >(CreateActivity, options);
};
