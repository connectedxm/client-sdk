import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { QueryKey } from "@tanstack/react-query";
import { EVENT_QUERY_KEY } from "./useGetEvent";
import { ConnectedXMResponse, EventGalleryImage } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const EVENT_IMAGES_QUERY_KEY = (eventId: string): QueryKey => [
  ...EVENT_QUERY_KEY(eventId),
  "IMAGES",
];

export interface GetEventImagesProps extends SingleQueryParams {
  eventId: string;
}

export const GetEventImages = async ({
  eventId,
  clientApiParams,
}: GetEventImagesProps): Promise<ConnectedXMResponse<EventGalleryImage[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/events/${eventId}/images`);
  return data;
};

export const useGetEventImages = (
  eventId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventImages>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventImages>>(
    EVENT_IMAGES_QUERY_KEY(eventId),
    (params) => GetEventImages({ eventId, ...params }),
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    }
  );
};
