import { ContentGuest } from "@interfaces";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  InfiniteQueryOptions,
} from "../../../useConnectedInfiniteQuery";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { MANAGED_CHANNEL_CONTENT_QUERY_KEY } from "./useGetManagedChannelContent";

export const MANAGED_CHANNEL_CONTENT_GUESTS_QUERY_KEY = (
  channelId: string,
  contentId: string
): QueryKey => [
  ...MANAGED_CHANNEL_CONTENT_QUERY_KEY(channelId, contentId),
  "GUESTS",
];

export interface GetManagedChannelContentGuestsParams
  extends InfiniteQueryParams {
  channelId: string;
  contentId: string;
}

export const GetManagedChannelContentGuests = async ({
  channelId,
  contentId,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetManagedChannelContentGuestsParams): Promise<
  ConnectedXMResponse<ContentGuest[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/channels/managed/${channelId}/contents/${contentId}/guests`,
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

export const useGetManagedChannelContentGuests = (
  channelId: string,
  contentId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetManagedChannelContentGuests>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetManagedChannelContentGuests>>
  >(
    MANAGED_CHANNEL_CONTENT_GUESTS_QUERY_KEY(channelId, contentId),
    (params: InfiniteQueryParams) =>
      GetManagedChannelContentGuests({ channelId, contentId, ...params }),
    params,
    {
      ...options,
      enabled: !!channelId && !!contentId && (options?.enabled ?? true),
    }
  );
};
