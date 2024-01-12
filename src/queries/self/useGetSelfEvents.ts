import { ClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@hooks/useConnectedXM";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { Event } from "@interfaces";
import CacheIndividualQueries from "@src/utilities/CacheIndividualQueries";
import { useQueryClient } from "@tanstack/react-query";
import { SET_EVENT_QUERY_DATA } from "../events/useGetEvent";
import { SELF_QUERY_KEY } from "./useGetSelf";

export const SELF_EVENTS_QUERY_KEY = (past?: boolean) => {
  let keys = [...SELF_QUERY_KEY(), "EVENTS"];
  if (typeof past !== "undefined") keys.push(past ? "PAST" : "UPCOMING");
  return keys;
};

interface GetSelfEventsProps extends InfiniteQueryParams {
  past?: boolean;
}

export const GetSelfEvents = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  past,
  locale,
}: GetSelfEventsProps): Promise<ConnectedXMResponse<Event[]>> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(`/self/events`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      past: past || false,
    },
  });
  return data;
};

const useGetSelfEvents = (past?: boolean) => {
  const { token } = useConnectedXM();
  const queryClient = useQueryClient();

  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetSelfEvents>>>(
    SELF_EVENTS_QUERY_KEY(past),
    (params: InfiniteQueryParams) => GetSelfEvents({ ...params, past }),
    {
      enabled: !!token,
      onSuccess: (data) =>
        CacheIndividualQueries(
          data,
          queryClient,
          (eventId) => [eventId],
          SET_EVENT_QUERY_DATA
        ),
    }
  );
};

export default useGetSelfEvents;
