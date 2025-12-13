import { Account, ConnectedXMResponse } from "@src/interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { EVENT_ATTENDEE_QUERY_KEY as SELF_EVENT_ATTENDEE_QUERY_KEY } from "../attendee/useGetEventAttendee";

export const SELF_EVENT_ATTENDEE_TRANSFER_ACCOUNTS_QUERY_KEY = (
  eventId: string,
  passId: string,
  search: string
): QueryKey => [
  ...SELF_EVENT_ATTENDEE_QUERY_KEY(eventId),
  "PASSES",
  passId,
  "TRANSFER_ACCOUNTS",
  search,
];

export const SET_TRANSFER_ACCOUNTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SELF_EVENT_ATTENDEE_TRANSFER_ACCOUNTS_QUERY_KEY>,
  response: ReturnType<typeof GetSelfEventAttendeeTransferAccounts>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SELF_EVENT_ATTENDEE_TRANSFER_ACCOUNTS_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetSelfEventAttendeeTransferAccountsProps
  extends SingleQueryParams {
  eventId: string;
  passId: string;
  search: string;
}

export const GetSelfEventAttendeeTransferAccounts = async ({
  eventId,
  passId,
  search,
  clientApiParams,
}: GetSelfEventAttendeeTransferAccountsProps): Promise<
  ConnectedXMResponse<Account[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/attendee/passes/${passId}/transfer/accounts`,
    {
      params: {
        search: search || undefined,
      },
    }
  );

  return data;
};

export const useGetSelfEventAttendeeTransferAccounts = (
  eventId: string,
  passId: string,
  search: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventAttendeeTransferAccounts>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfEventAttendeeTransferAccounts>
  >(
    SELF_EVENT_ATTENDEE_TRANSFER_ACCOUNTS_QUERY_KEY(eventId, passId, search),
    (params) =>
      GetSelfEventAttendeeTransferAccounts({
        ...params,
        eventId,
        passId,
        search,
      }),
    {
      ...options,
      enabled:
        !!authenticated &&
        !!eventId &&
        !!passId &&
        !!search &&
        (options?.enabled ?? true),
    }
  );
};
