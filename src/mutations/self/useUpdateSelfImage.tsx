import { ConnectedXM, ConnectedXMResponse } from "@context/api/ConnectedXM";
import { Account } from "@context/interfaces";
import { QUERY_KEY as SELF } from "@context/queries/self/useGetSelf";
import { useQueryClient } from "@tanstack/react-query";

import useConnectedMutation, { MutationParams } from "../useConnectedMutation";
interface UpdateSelfImageParams extends MutationParams {
  base64: string;
}

export const UpdateSelfImage = async ({ base64 }: UpdateSelfImageParams) => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.put(`/self/image`, {
    buffer: `data:image/jpeg;base64,${base64}`,
  });

  return data;
};

export const useUpdateSelfImage = () => {
  const queryClient = useQueryClient();

  return useConnectedMutation<UpdateSelfImageParams>(UpdateSelfImage, {
    onSuccess: (_response: ConnectedXMResponse<Account>) => {
      queryClient.invalidateQueries([SELF]);
    },
  });
};

export default useUpdateSelfImage;
