import { ConnectedXMResponse, Self } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { SELF_QUERY_KEY } from "@src/queries";

export interface UpdateSelfParams extends MutationParams {
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

export const UpdateSelf = async ({
  clientApi,
  queryClient,
  ...params
}: UpdateSelfParams): Promise<ConnectedXMResponse<Self>> => {
  const { data } = await clientApi.put<ConnectedXMResponse<Self>>(
    `/self`,
    params
  );

  if (queryClient && data.status !== "ok") {
    queryClient.invalidateQueries({ queryKey: SELF_QUERY_KEY() });
  }

  return data;
};

export const useUpdateSelf = (
  params: Omit<MutationParams, "queryClient" | "clientApi"> = {},
  options: MutationOptions<
    Awaited<ConnectedXMResponse<Self>>,
    UpdateSelfParams
  > = {}
) => {
  return useConnectedMutation<
    UpdateSelfParams,
    Awaited<ConnectedXMResponse<Self>>
  >(UpdateSelf, params, options);
};
