import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_REGISTRATION_INTENT_QUERY_KEY,
  EVENT_REGISTRATION_QUESTIONS_QUERY_KEY,
  EVENT_REGISTRATION_ROOM_TYPES_QUERY_KEY,
} from "@src/queries/events/registration";
import { EventRegistrationAddOnsUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Events
 */
export interface UpdateSelfEventRegistrationPurchaseAddOnParams extends MutationParams {
  eventId: string;
  addOns: EventRegistrationAddOnsUpdateInputs;
}

/**
 * @category Methods
 * @group Events
 */
export const UpdateSelfEventRegistrationPurchaseAddOn = async ({
  eventId,
  addOns,
  clientApiParams,
  queryClient,
}: UpdateSelfEventRegistrationPurchaseAddOnParams): Promise<
  ConnectedXMResponse<null>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<null>>(
    `/self/events/${eventId}/registration/addOns`,
    addOns
  );

  if (queryClient && data.status === "ok") {
    queryClient.removeQueries({
      queryKey: EVENT_REGISTRATION_ROOM_TYPES_QUERY_KEY(eventId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_REGISTRATION_QUESTIONS_QUERY_KEY(eventId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_REGISTRATION_INTENT_QUERY_KEY(eventId),
      exact: false,
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useUpdateSelfEventRegistrationPurchaseAddOn = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateSelfEventRegistrationPurchaseAddOn>>,
      Omit<
        UpdateSelfEventRegistrationPurchaseAddOnParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSelfEventRegistrationPurchaseAddOnParams,
    Awaited<ReturnType<typeof UpdateSelfEventRegistrationPurchaseAddOn>>
  >(UpdateSelfEventRegistrationPurchaseAddOn, options);
};
