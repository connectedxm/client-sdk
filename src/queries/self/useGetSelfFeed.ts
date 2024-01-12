import { ClientAPI } from "@src/ClientAPI";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { Activity } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import CacheIndividualQueries from "@src/utilities/CacheIndividualQueries";
import { useConnectedXM } from "@src/hooks/useConnectedXM";
import { SELF_QUERY_KEY } from "./useGetSelf";
import { SET_ACTIVITY_QUERY_DATA } from "../activities/useGetActivity";

export const SELF_FEED_QUERY_KEY = () => [...SELF_QUERY_KEY(), "FEED"];

interface GetSelfFeedProps extends InfiniteQueryParams {}

export const GetSelfFeed = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  locale,
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
  return data;
};

const useGetSelfFeed = () => {
  const queryClient = useQueryClient();
  const { token } = useConnectedXM();

  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetSelfFeed>>>(
    SELF_FEED_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetSelfFeed(params),
    {
      enabled: !!token,
      onSuccess: (data) =>
        CacheIndividualQueries(
          data,
          queryClient,
          (activityId) => [activityId],
          SET_ACTIVITY_QUERY_DATA
        ),
    }
  );
};

export default useGetSelfFeed;
