import { Auth } from "@aws-amplify/auth";
import { ConnectedXM, ConnectedXMResponse } from "@context/api/ConnectedXM";
import { useQueryClient } from "@tanstack/react-query";

import useConnectedMutation from "../useConnectedMutation";

export const DeleteSelf = async () => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(`/self`);
  await Auth.signOut();
  return data;
};

export const useDeleteSelf = () => {
  const queryClient = useQueryClient();

  return useConnectedMutation(DeleteSelf, {
    onSuccess: (_response: ConnectedXMResponse<null>) => {
      queryClient.clear();
    },
  });
};

export default useDeleteSelf;
