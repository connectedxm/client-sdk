import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "@src/queries/useConnectedSingleQuery";

import type { Image, ConnectedXMResponse } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const IMAGE_QUERY_KEY = (imageId: string): QueryKey => [
  "IMAGE",
  imageId,
];

export const SET_IMAGE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof IMAGE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetImage>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [...IMAGE_QUERY_KEY(...keyParams), ...GetBaseSingleQueryKeys(...baseKeys)],
    response
  );
};

export interface GetImageProps extends SingleQueryParams {
  imageId: string;
}

export const GetImage = async ({
  imageId,
  clientApiParams,
}: GetImageProps): Promise<ConnectedXMResponse<Image>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/storage/images/${imageId}`);
  return data;
};

export const useGetImage = (
  imageId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetImage>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetImage>>(
    IMAGE_QUERY_KEY(imageId),
    (_params) => GetImage({ imageId, ..._params }),
    {
      ...options,
      enabled: !!imageId && (options?.enabled ?? true),
    }
  );
};
