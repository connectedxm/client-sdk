import {
  GetBaseSingleQueryKeys,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ClientAPI } from "@src/ClientAPI";
import type { Registration } from "@interfaces";
import { useConnectedXM } from "@src/hooks/useConnectedXM";
import { getQueryParamSync } from "@context/hooks/useQueryParam";
import { NextRouter, useRouter } from "next/router";
import RemoveQueryParam from "@utilities/RemoveQueryParam";
import { SELF_QUERY_KEY } from "../useGetSelf";
import { QueryClient } from "@tanstack/react-query";

export const SELF_EVENT_REGISTRATION_QUERY_KEY = (eventId: string) => [
  ...SELF_QUERY_KEY(),
  "EVENT_REGISTRATION",
  eventId,
];

export const SET_SELF_EVENT_REGISTRATION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SELF_EVENT_REGISTRATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSelfEventRegistration>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SELF_EVENT_REGISTRATION_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

interface GetSelfEventRegistrationProps extends SingleQueryParams {
  eventId: string;
  router: NextRouter;
}

export const GetSelfEventRegistration = async ({
  eventId,
  router,
  locale,
}: GetSelfEventRegistrationProps): Promise<
  ConnectedXMResponse<Registration>
> => {
  let ticket = "";
  let quantity = "";
  let coupon = "";

  if (typeof window !== "undefined") {
    ticket = getQueryParamSync("productId");
    quantity = getQueryParamSync("quantity");
    coupon = getQueryParamSync("coupon");
  }

  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(`/self/events/${eventId}/registration`, {
    params: {
      ticket: ticket || undefined,
      quantity: quantity || undefined,
      coupon: coupon || undefined,
    },
  });

  if (ticket) RemoveQueryParam(router, "productId");
  if (quantity) RemoveQueryParam(router, "quantity");
  if (coupon) RemoveQueryParam(router, "coupon");

  return data;
};

const useGetSelfEventRegistration = (eventId: string) => {
  const { token } = useConnectedXM();
  const router = useRouter();

  return useConnectedSingleQuery<
    Awaited<ReturnType<typeof GetSelfEventRegistration>>
  >(
    SELF_EVENT_REGISTRATION_QUERY_KEY(eventId),
    () =>
      GetSelfEventRegistration({
        eventId,
        router,
      }),
    {
      enabled: !!token && !!eventId && !!router,
      retry: false,
      staleTime: Infinity,
      refetchOnMount: false,
      onSuccess: () => {},
    }
  );
};

export default useGetSelfEventRegistration;
