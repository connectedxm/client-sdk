import { ChatChannelMember, ConnectedXMResponse } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { SELF_CHAT_CHANNEL_QUERY_KEY } from "./useGetSelfChatChannel";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";

export const SELF_CHAT_CHANNEL_MEMBERS_QUERY_KEY = (
  channelId: string
): QueryKey => [...SELF_CHAT_CHANNEL_QUERY_KEY(channelId), "MEMBERS"];

export const SET_SELF_CHAT_CHANNEL_MEMBERS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SELF_CHAT_CHANNEL_MEMBERS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSelfChatChannelMembers>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SELF_CHAT_CHANNEL_MEMBERS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetSelfChatChannelMembersProps extends InfiniteQueryParams {
  channelId: string;
}

export const GetSelfChatChannelMembers = async ({
  channelId,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetSelfChatChannelMembersProps): Promise<
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

export const useGetSelfChatChannelMembers = (
  channelId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSelfChatChannelMembers>>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfChatChannelMembers>>
  >(
    SELF_CHAT_CHANNEL_MEMBERS_QUERY_KEY(channelId),
    (params) => GetSelfChatChannelMembers({ ...params, channelId }),
    params,
    {
      ...options,
      enabled: !!authenticated && !!channelId && (options?.enabled ?? true),
    }
  );
};
