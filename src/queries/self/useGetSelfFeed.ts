import { ClientAPI } from "@src/ClientAPI";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { Activity, ConnectedXMResponse } from "@interfaces";
import { useConnectedXM } from "@src/hooks/useConnectedXM";
import { SELF_QUERY_KEY } from "./useGetSelf";
import {
  ACTIVITY_QUERY_KEY,
  SET_ACTIVITY_QUERY_DATA,
} from "../activities/useGetActivity";
import CacheIndividualQueries from "@src/utilities/CacheIndividualQueries";

export const SELF_FEED_QUERY_KEY = () => [...SELF_QUERY_KEY(), "FEED"];

interface GetSelfFeedProps extends InfiniteQueryParams {}

export const GetSelfFeed = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  locale,
  queryClient,
}: GetSelfFeedProps): Promise<ConnectedXMResponse<Activity[]>> => {
  const clientApi = await ClientAPI(locale);

  const { data } = await clientApi.get(`/self/activities/feed`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  if (queryClient && data.status === "ok") {
    CacheIndividualQueries(
      data,
      queryClient,
      (activityId) => ACTIVITY_QUERY_KEY(activityId),
      SET_ACTIVITY_QUERY_DATA
    );
  }

  return data;
};

const useGetSelfFeed = (
  params: InfiniteQueryParams,
  options: InfiniteQueryOptions<ReturnType<typeof GetSelfFeed>> = {}
) => {
  const { token } = useConnectedXM();

  return useConnectedInfiniteQuery<ReturnType<typeof GetSelfFeed>>(
    SELF_FEED_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetSelfFeed(params),
    params,
    {
      ...options,
      enabled: !!token && (options?.enabled ?? true),
    }
  );
};

export default useGetSelfFeed;
