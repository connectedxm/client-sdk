import { ClientAPI } from "@src/ClientAPI";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { Activity } from "@interfaces";
import CacheIndividualQueries from "@src/utilities/CacheIndividualQueries";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { useConnectedXM } from "@src/hooks/useConnectedXM";
import { ACTIVITY_QUERY_KEY, SET_ACTIVITY_QUERY_DATA } from "./useGetActivity";
import { ConnectedXMResponse } from "@interfaces";

export const ACTIVITY_COMMENTS_QUERY_KEY = (activityId: string) => [
  ...ACTIVITY_QUERY_KEY(activityId),
  "ACTIVITY_COMMENTS",
];

export const SET_ACTIVITY_COMMENTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACTIVITY_COMMENTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetActivityComments>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...ACTIVITY_COMMENTS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

interface GetActivityCommentsProps extends InfiniteQueryParams {
  activityId: string;
}

export const GetActivityComments = async ({
  activityId,
  pageParam,
  pageSize,
  orderBy,
  search,
  locale,
}: GetActivityCommentsProps): Promise<ConnectedXMResponse<Activity[]>> => {
  const clientApi = await ClientAPI(locale);

  const { data } = await clientApi.get(`/activities/${activityId}/comments`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetActivityComments = (activityId: string) => {
  const { token } = useConnectedXM();
  const queryClient = useQueryClient();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetActivityComments>>
  >(
    ACTIVITY_COMMENTS_QUERY_KEY(activityId),
    (params: InfiniteQueryParams) =>
      GetActivityComments({ activityId, ...params }),
    {
      enabled: !!token && !!activityId,
      onSuccess: (data) => {
        CacheIndividualQueries(
          data,
          queryClient,
          (activityId) => [activityId],
          SET_ACTIVITY_QUERY_DATA
        );
      },
    }
  );
};

export default useGetActivityComments;
