import { ContentGuest } from "@interfaces";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  InfiniteQueryOptions,
} from "../../useConnectedInfiniteQuery";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { CHANNEL_CONTENT_QUERY_KEY } from "@src/queries/channels/content/useGetChannelContent";

export const CONTENT_GUESTS_QUERY_KEY = (contentId: string): QueryKey => [
  CONTENT_QUERY_KEY(contentId),
  "CONTENTS",
];

export interface GetChannelContentGuestsParams extends InfiniteQueryParams {
  channelId: string;
  contentId: string;
}

export const GetChannelContentGuests = async ({
  channelId,
  contentId,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetChannelContentGuestsParams): Promise<
  ConnectedXMResponse<ContentGuest[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/channels/${channelId}/contents/${contentId}/guests`,
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

export const useGetChannelContentGuests = (
  channelId: string,
  contentId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetChannelContentGuests>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetChannelContentGuests>>
  >(
    CONTENT_GUESTS_QUERY_KEY(contentId),
    (params: InfiniteQueryParams) =>
      GetChannelContentGuests({ channelId, contentId, ...params }),
    params,
    {
      ...options,
      enabled: !!channelId && !!contentId && (options?.enabled ?? true),
    }
  );
};
