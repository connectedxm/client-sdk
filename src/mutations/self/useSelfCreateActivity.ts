import { ConnectedXM } from "@context/api/ConnectedXM";
import { QUERY_KEY as ACTIVITIES } from "@context/queries/activities/useGetActivities";
import { QUERY_KEY as ACTIVITY } from "@context/queries/activities/useGetActivity";
import { QUERY_KEY as COMMUNITY_ACTIVITIES } from "@context/queries/communities/useGetCommunityActivities";
import { QUERY_KEY as CONTENT_ACTIVITIES } from "@context/queries/contents/useGetContentActivities";
import { QUERY_KEY as EVENT_ACTIVITIES } from "@context/queries/events/useGetEventActivities";
import { QUERY_KEY as SELF_ACTIVITIES } from "@context/queries/self/useGetSelfActivities";
import AppendInfiniteQuery from "@context/utilities/AppendInfiniteQuery";
import {
  UpdateCommentsInfinite,
  UpdateCommentsSingle,
} from "@context/utilities/optimistic/UpdateComments";
import { useQueryClient } from "@tanstack/react-query";

import useConnectedMutation, { MutationParams } from "../useConnectedMutation";

interface CreateActivity {
  message: string;
  contentId?: string;
  eventId?: string;
  communityId?: string;
  commentedId?: string;
}
interface SelfCreateActivityParams extends MutationParams {
  activity: CreateActivity;
  base64Image?: any;
}

export const SelfCreateActivity = async ({
  activity,
  base64Image,
}: SelfCreateActivityParams) => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(`/self/activities`, {
    activity,
    buffer: base64Image ? `data:image/jpeg;base64,${base64Image}` : undefined,
  });
  return data;
};

export const useSelfCreateActivity = () => {
  const queryClient = useQueryClient();
  return useConnectedMutation<SelfCreateActivityParams>(
    ({ activity, base64Image }) =>
      SelfCreateActivity({ activity, base64Image }),
    {
      onMutate: (data) => {
        if (data.activity.commentedId) {
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
      },
      onSuccess: (response) => {
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
      },
    }
  );
};

export default useSelfCreateActivity;
