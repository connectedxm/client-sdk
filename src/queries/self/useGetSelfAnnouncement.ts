import { Announcement, ConnectedXMResponse } from "@interfaces";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "@src/queries/useConnectedSingleQuery";
import { SELF_QUERY_KEY } from "./useGetSelf";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";

export const SELF_ANNOUNCEMENT_QUERY_KEY = (
  announcementId: string
): QueryKey => [...SELF_QUERY_KEY(), "ANNOUNCEMENT", announcementId];

export interface GetSelfAnnouncementProps extends SingleQueryParams {
  announcementId: string;
}

export const GetSelfAnnouncement = async ({
  announcementId,
  clientApiParams,
}: GetSelfAnnouncementProps): Promise<ConnectedXMResponse<Announcement>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/self/announcements/${announcementId}`);
  return data;
};

export const useGetSelfAnnouncement = (
  announcementId: string,
  options: SingleQueryOptions<ReturnType<typeof GetSelfAnnouncement>> = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<ReturnType<typeof GetSelfAnnouncement>>(
    SELF_ANNOUNCEMENT_QUERY_KEY(announcementId),
    (params) => GetSelfAnnouncement({ announcementId, ...params }),
    {
      ...options,
      enabled:
        !!authenticated && !!announcementId && (options?.enabled ?? true),
    }
  );
};
