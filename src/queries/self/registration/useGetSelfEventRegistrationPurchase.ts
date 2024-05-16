import {
  ConnectedXMResponse,
  Purchase,
  RegistrationQuestion,
  RegistrationQuestionResponse,
} from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../useConnectedSingleQuery";
import { SELF_QUERY_KEY } from "../useGetSelf";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";

interface ResponseWithQuestion extends RegistrationQuestionResponse {
  question: RegistrationQuestion;
}

interface PurchaseWithResponseQuestions extends Purchase {
  responses: ResponseWithQuestion[];
}

export const SELF_EVENT_REGISTRATION_PURCHASE_QUERY_KEY = (
  eventId: string,
  registrationId: string,
  purchaseId: string
): QueryKey => [
  ...SELF_QUERY_KEY(),
  "EVENT",
  eventId,
  "REGISTRATION",
  registrationId,
  "PURCHASE",
  purchaseId,
];

export const SET_SELF_EVENT_REGISTRATION_PURCHASE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SELF_EVENT_REGISTRATION_PURCHASE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSelfEventRegistrationPurchase>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SELF_EVENT_REGISTRATION_PURCHASE_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetSelfEventRegistrationPurchaseProps
  extends SingleQueryParams {
  eventId: string;
  registrationId: string;
  purchaseId: string;
}

export const GetSelfEventRegistrationPurchase = async ({
  eventId,
  registrationId,
  purchaseId,
  clientApiParams,
}: GetSelfEventRegistrationPurchaseProps): Promise<
  ConnectedXMResponse<PurchaseWithResponseQuestions>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/registration/${registrationId}/registered/purchases/${purchaseId}`,
    {}
  );

  return data;
};

export const useGetSelfEventRegistrationPurchase = (
  eventId: string,
  registrationId: string,
  purchaseId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventRegistrationPurchase>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfEventRegistrationPurchase>
  >(
    SELF_EVENT_REGISTRATION_PURCHASE_QUERY_KEY(
      eventId,
      registrationId,
      purchaseId
    ),
    (params: SingleQueryParams) =>
      GetSelfEventRegistrationPurchase({
        eventId,
        registrationId,
        purchaseId,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!authenticated &&
        !!eventId &&
        !!registrationId &&
        !!purchaseId &&
        (options?.enabled ?? true),
    }
  );
};
