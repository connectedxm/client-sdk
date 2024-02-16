import { ConnectedXM, ConnectedXMResponse } from "@context/api/ConnectedXM";
import { Account } from "@context/interfaces";
import { QUERY_KEY as SELF } from "@context/queries/self/useGetSelf";
import { useQueryClient } from "@tanstack/react-query";

import useConnectedMutation, { MutationParams } from "../useConnectedMutation";

interface UpdateSelfParams extends MutationParams {
  firstName: string;
  lastName: string;
  phone: string;
  title: string;
  company: string;
  bio: string;
  dietaryRestrictions: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  facebook: string;
  twitter: string;
  instagram: string;
  tikTok: string;
  linkedIn: string;
  youtube: string;
  discord: string;
  video: string;
  website: string;
  username: string;
}

export const UpdateSelf = async (params: UpdateSelfParams) => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.put(`/self`, params);
  return data;
};

export const useUpdateSelf = () => {
  const queryClient = useQueryClient();

  return useConnectedMutation<UpdateSelfParams>(UpdateSelf, {
    onSuccess: (_response: ConnectedXMResponse<Account>) => {
      queryClient.invalidateQueries([SELF]);
    },
  });
};

export default useUpdateSelf;
