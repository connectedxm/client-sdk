import { ChatChannelMember, ConnectedXMResponse } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { CHAT_CHANNEL_QUERY_KEY } from "./useGetChatChannel";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";

export const CHAT_CHANNEL_MEMBERS_QUERY_KEY = (
  channelId: string
): QueryKey => [...CHAT_CHANNEL_QUERY_KEY(channelId), "MEMBERS"];

export const SET_CHAT_CHANNEL_MEMBERS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CHAT_CHANNEL_MEMBERS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetChatChannelMembers>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...CHAT_CHANNEL_MEMBERS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetChatChannelMembersProps extends InfiniteQueryParams {
  channelId: string;
}

export const GetChatChannelMembers = async ({
  channelId,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetChatChannelMembersProps): Promise<
  ConnectedXMResponse<ChatChannelMember[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/chat/channels/${channelId}/members`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );
  return data;
};

export const useGetChatChannelMembers = (
  channelId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetChatChannelMembers>>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetChatChannelMembers>>
  >(
    CHAT_CHANNEL_MEMBERS_QUERY_KEY(channelId),
    (params) => GetChatChannelMembers({ ...params, channelId }),
    params,
    {
      ...options,
      enabled: !!authenticated && !!channelId && (options?.enabled ?? true),
    }
  );
};
