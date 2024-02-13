import { ChatChannelMember, ConnectedXMResponse } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { useConnectedXM } from "@src/hooks/useConnectedXM";
import { SELF_CHAT_CHANNEL_QUERY_KEY } from "./useGetSelfChatChannel";

export const SELF_CHAT_CHANNEL_MEMBERS_QUERY_KEY = (channelId: string) => [
  ...SELF_CHAT_CHANNEL_QUERY_KEY(channelId),
  "MEMBERS",
];

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

interface GetSelfChatChannelMembersProps extends InfiniteQueryParams {
  channelId: string;
}

export const GetSelfChatChannelMembers = async ({
  channelId,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApi,
}: GetSelfChatChannelMembersProps): Promise<
  ConnectedXMResponse<ChatChannelMember[]>
> => {
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

const useGetSelfChatChannelMembers = (
  channelId: string,
  params: Omit<InfiniteQueryParams, "pageParam" | "queryClient" | "clientApi">,
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSelfChatChannelMembers>>
  > = {}
) => {
  const { token } = useConnectedXM();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfChatChannelMembers>>
  >(
    SELF_CHAT_CHANNEL_MEMBERS_QUERY_KEY(channelId),
    (params) => GetSelfChatChannelMembers({ ...params, channelId }),
    params,
    {
      ...options,
      enabled: !!token && !!channelId && (options?.enabled ?? true),
    }
  );
};

export default useGetSelfChatChannelMembers;
