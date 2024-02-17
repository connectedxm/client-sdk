import {
  MutationFunction,
  QueryClient,
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError, AxiosInstance } from "axios";
import { ConnectedXMResponse, useClientAPI } from "..";

export interface MutationParams {
  clientApi: AxiosInstance;
  queryClient?: QueryClient;
}

export interface MutationOptions<TResponseData, TMutationParams>
  extends UseMutationOptions<
    TResponseData,
    AxiosError<TResponseData> | Error,
    TMutationParams
  > {}

export const useConnectedMutation = <
  TMutationParams extends Omit<MutationParams, "queryClient" | "clientApi">,
  TResponseData extends ConnectedXMResponse<any>
>(
  mutation: MutationFunction<TResponseData, TMutationParams>,
  options?: MutationOptions<TResponseData, TMutationParams>
) => {
  const queryClient = useQueryClient();
  const clientApi = useClientAPI();

  return useMutation<
    TResponseData,
    AxiosError<TResponseData> | Error,
    TMutationParams
  >({
    mutationFn: (params) => mutation({ queryClient, clientApi, ...params }),
    ...options,
  });
};

export default useConnectedMutation;
