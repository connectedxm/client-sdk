import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";

export interface CheckLoginParams extends MutationParams {
  email: string;
}

export const CheckLogin = async ({
  email,
  clientApiParams,
}: CheckLoginParams): Promise<ConnectedXMResponse<string>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<string>>(
    `/login/check`,
    { email }
  );

  return data;
};

export const useCheckLogin = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CheckLogin>>,
      Omit<CheckLoginParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CheckLoginParams,
    Awaited<ReturnType<typeof CheckLogin>>
  >(CheckLogin, options);
};
