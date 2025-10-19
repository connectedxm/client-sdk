import { ConnectedXMResponse, Self } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { SELF_QUERY_KEY } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

export interface UpdateSelfParams extends MutationParams {
  username?: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  title?: string | null;
  company?: string | null;
  bio?: string | null;
  dietaryRestrictions?: string | null;
  facebook?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  tikTok?: string | null;
  linkedIn?: string | null;
  youtube?: string | null;
  discord?: string | null;
  video?: string | null;
  website?: string | null;
  locale?: string | null;
  termsAccepted?: boolean;
  attributes?: Record<string, string>;
}

export const UpdateSelf = async ({
  clientApiParams,
  queryClient,
  ...params
}: UpdateSelfParams): Promise<ConnectedXMResponse<Self>> => {
  const clientApi = await GetClientAPI(clientApiParams);

  const { data } = await clientApi.put<ConnectedXMResponse<Self>>(
    `/self`,
    params
  );

  if (queryClient && data.status !== "ok") {
    queryClient.refetchQueries({ queryKey: SELF_QUERY_KEY() });
  }

  return data;
};

export const useUpdateSelf = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateSelf>>,
      Omit<UpdateSelfParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSelfParams,
    Awaited<ReturnType<typeof UpdateSelf>>
  >(UpdateSelf, options);
};
