import { ConnectedXMResponse, BookingSpaceQuestion } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { BOOKING_PLACE_SPACE_QUERY_KEY } from "./useGetBookingPlaceSpace";

export const BOOKING_PLACE_SPACE_QUESTIONS_QUERY_KEY = (
  placeId: string,
  spaceId: string
): QueryKey => [
  ...BOOKING_PLACE_SPACE_QUERY_KEY(placeId, spaceId),
  "QUESTIONS",
];

export const SET_BOOKING_PLACE_SPACE_QUESTIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof BOOKING_PLACE_SPACE_QUESTIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetBookingSpaceQuestions>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...BOOKING_PLACE_SPACE_QUESTIONS_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetBookingSpaceQuestionsProps extends SingleQueryParams {
  placeId: string;
  spaceId: string;
}

export const GetBookingSpaceQuestions = async ({
  placeId,
  spaceId,
  clientApiParams,
}: GetBookingSpaceQuestionsProps): Promise<
  ConnectedXMResponse<BookingSpaceQuestion[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/bookings/places/${placeId}/spaces/${spaceId}/questions`,
    {}
  );

  return data;
};

export const useGetBookingSpaceQuestions = (
  placeId: string,
  spaceId: string,
  options: SingleQueryOptions<ReturnType<typeof GetBookingSpaceQuestions>> = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<ReturnType<typeof GetBookingSpaceQuestions>>(
    BOOKING_PLACE_SPACE_QUESTIONS_QUERY_KEY(placeId, spaceId),
    (params: SingleQueryParams) =>
      GetBookingSpaceQuestions({
        placeId,
        spaceId,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!authenticated && !!placeId && !!spaceId && (options?.enabled ?? true),
    }
  );
};
