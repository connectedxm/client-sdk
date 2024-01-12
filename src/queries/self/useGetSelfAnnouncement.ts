import { ConnectedXM, ConnectedXMResponse } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks/useConnectedXM";
import { Announcement } from "@interfaces";
import {
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
  locale,
}: GetSelfAnnouncementProps): Promise<ConnectedXMResponse<Announcement>> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(`/self/announcements/${announcementId}`);
  return data;
};

const useGetSelfAnnouncement = (announcementId: string) => {
  const { token } = useConnectedXM();
  return useConnectedSingleQuery<
    Awaited<ReturnType<typeof GetSelfAnnouncement>>
  >(
    SELF_ANNOUNCEMENT_QUERY_KEY(announcementId),
    (params) => GetSelfAnnouncement({ announcementId, ...params }),
    {
      enabled: !!announcementId && !!token,
    }
  );
};

export default useGetSelfAnnouncement;
