import { useConnectedXM } from "@src/hooks/useConnectedXM";
import { Announcement, ConnectedXMResponse } from "@interfaces";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { SELF_QUERY_KEY } from "./useGetSelf";

export const SELF_ANNOUNCEMENT_QUERY_KEY = (announcementId: string) => [
  ...SELF_QUERY_KEY(),
  "ANNOUNCEMENT",
  announcementId,
];

interface GetSelfAnnouncementProps extends SingleQueryParams {
  announcementId: string;
}

export const GetSelfAnnouncement = async ({
  announcementId,
  clientApi,
}: GetSelfAnnouncementProps): Promise<ConnectedXMResponse<Announcement>> => {
  const { data } = await clientApi.get(`/self/announcements/${announcementId}`);
  return data;
};

const useGetSelfAnnouncement = (
  announcementId: string,
  options: SingleQueryOptions<ReturnType<typeof GetSelfAnnouncement>> = {}
) => {
  const { token } = useConnectedXM();
  return useConnectedSingleQuery<ReturnType<typeof GetSelfAnnouncement>>(
    SELF_ANNOUNCEMENT_QUERY_KEY(announcementId),
    (params) => GetSelfAnnouncement({ announcementId, ...params }),
    {
      ...options,
      enabled: !!token && !!announcementId && (options?.enabled ?? true),
    }
  );
};

export default useGetSelfAnnouncement;
