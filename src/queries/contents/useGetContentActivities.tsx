import { ClientAPI } from "@src/ClientAPI";
import { Activity } from "@interfaces";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  GetBaseInfiniteQueryKeys,
  setFirstPageData,
} from "../useConnectedInfiniteQuery";
import CacheIndividualQueries from "@src/utilities/CacheIndividualQueries";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { useConnectedXM } from "@src/hooks/useConnectedXM";
import { CONTENT_QUERY_KEY } from "./useGetContent";
import { SET_ACTIVITY_QUERY_DATA } from "../activities/useGetActivity";
import { ConnectedXMResponse } from "@interfaces";

export const CONTENT_ACTIVITIES_QUERY_KEY = (contentId: string) => [
  "ACTIVITIES",
  ...CONTENT_QUERY_KEY(contentId),
];

export const SET_CONTENT_ACTIVITIES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CONTENT_ACTIVITIES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetContentActivities>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...CONTENT_ACTIVITIES_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

interface GetContentParams extends InfiniteQueryParams {
  contentId: string;
}

export const GetContentActivities = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  contentId,
  locale,
}: GetContentParams): Promise<ConnectedXMResponse<Activity[]>> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(`/contents/${contentId}/activities`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  return data;
};

const useGetContentActivities = (contentId: string) => {
  const { token } = useConnectedXM();
  const queryClient = useQueryClient();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetContentActivities>>
  >(
    CONTENT_ACTIVITIES_QUERY_KEY(contentId),
    (params: InfiniteQueryParams) =>
      GetContentActivities({ contentId, ...params }),
    {
      enabled: !!token && !!contentId,
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

export default useGetContentActivities;
