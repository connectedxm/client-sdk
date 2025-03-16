import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { EventGalleryImage } from "@interfaces";
import { EVENT_IMAGES_QUERY_KEY } from "./useGetEventImages";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const EVENT_IMAGE_QUERY_KEY = (
  eventId: string,
  galleryImageId: string
): QueryKey => [...EVENT_IMAGES_QUERY_KEY(eventId), galleryImageId];

export interface GetEventImageProps extends SingleQueryParams {
  eventId: string;
  galleryImageId: string;
}

export const GetEventImage = async ({
  eventId,
  galleryImageId,
  clientApiParams,
}: GetEventImageProps): Promise<ConnectedXMResponse<EventGalleryImage>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/events/${eventId}/images/${galleryImageId}`
  );
  return data;
};

export const useGetEventImage = (
  eventId: string = "",
  galleryImageId: string,
  options: SingleQueryOptions<ReturnType<typeof GetEventImage>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventImage>>(
    EVENT_IMAGE_QUERY_KEY(eventId, galleryImageId),
    (params) => GetEventImage({ eventId, galleryImageId, ...params }),
    {
      ...options,
      enabled: !!eventId && !!galleryImageId && (options?.enabled ?? true),
    }
  );
};
