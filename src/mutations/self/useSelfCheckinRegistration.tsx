//
// Pretty sure we don't need this
//

// import { ConnectedXMResponse } from "@src/interfaces";
// import useConnectedMutation, { MutationParams } from "../useConnectedMutation";

// export interface SelfCheckinEventListingRegistrationParams
//   extends MutationParams {
//   accountId: string;
//   eventId: string;
// }

// export const SelfCheckinEventListingRegistration = async ({
//   accountId,
//   eventId,
//   clientApi,
//   queryClient
// }: SelfCheckinEventListingRegistrationParams): Promise<ConnectedXMResponse< => {

//   const { data } = await clientApi.post(
//     `/self/events/listings/${eventId}/registrations/${accountId}`
//   );
//   return data;
// };

// export const useSelfCheckinEventLisingRegistration = (eventId: string) => {
//   const queryClient = useQueryClient();

//   return useConnectedMutation<any>(
//     (params: any) =>
//       SelfCheckinEventListingRegistration({ eventId, ...params }),
//     {
//       onSuccess: (_response: ConnectedXMResponse<Registration>) => {
//         queryClient.invalidateQueries([EVENT_REGISTRATIONS, eventId]);
//       },
//     }
//   );
// };

// export default useSelfCheckinEventLisingRegistration;
