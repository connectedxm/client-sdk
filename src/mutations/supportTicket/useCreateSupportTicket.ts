import { ConnectedXM } from "@context/api/ConnectedXM";

import useConnectedMutation, { MutationParams } from "../useConnectedMutation";

interface CreateSupportTicketParams extends MutationParams {
  type: "support" | "inquiry";
  email: string;
  request: any;
  eventId?: string;
  productId?: string;
}

export const CreateSupportTicket = async ({
  type,
  email,
  request,
  eventId,
  productId,
}: CreateSupportTicketParams) => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.post("/supportTickets", {
    type,
    email,
    request,
    eventId: eventId || undefined,
    productId: productId || undefined,
  });

  return data;
};

export const useCreateSupportTicket = () => {
  return useConnectedMutation<CreateSupportTicketParams>(
    (props: CreateSupportTicketParams) => CreateSupportTicket({ ...props }),
  );
};

export default useCreateSupportTicket;
