import useConnectedSingleQuery, {
  SingleQueryOptions,
  SingleQueryParams,
} from "../useConnectedSingleQuery";
import { SERIES_REGISTRATION_QUERY_KEY } from "./useGetSeriesRegistration";
import { ConnectedXMResponse, PaymentIntent } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { QueryKey } from "@tanstack/react-query";

export const SERIES_REGISTRATION_INTENT_QUERY_KEY = (
  seriesId: string,
  addressId?: string
): QueryKey => {
  const key = [...SERIES_REGISTRATION_QUERY_KEY(seriesId), "INTENT"];
  if (addressId) {
    key.push(addressId);
  }
  return key;
};

export interface GetSeriesRegistrationIntentProps extends SingleQueryParams {
  seriesId: string;
  addressId: string;
}

export const GetSeriesRegistrationIntent = async ({
  seriesId,
  addressId,
  clientApiParams,
}: GetSeriesRegistrationIntentProps): Promise<
  Awaited<ConnectedXMResponse<PaymentIntent>>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/series/${seriesId}/registration/intent`,
    {
      params: {
        addressId,
      },
    }
  );
  return data;
};

export const useGetSeriesRegistrationIntent = (
  seriesId: string = "",
  addressId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetSeriesRegistrationIntent>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<
    ReturnType<typeof GetSeriesRegistrationIntent>
  >(
    SERIES_REGISTRATION_INTENT_QUERY_KEY(seriesId, addressId),
    (params) =>
      GetSeriesRegistrationIntent({ seriesId, addressId, ...params }),
    {
      staleTime: Infinity,
      retry: false,
      retryOnMount: false,
      ...options,
      enabled:
        !!authenticated &&
        !!seriesId &&
        !!addressId &&
        (options?.enabled ?? true),
    }
  );
};
