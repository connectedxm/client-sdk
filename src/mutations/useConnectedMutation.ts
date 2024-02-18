import {
  MutationFunction,
  QueryClient,
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError, AxiosInstance } from "axios";
import { ConnectedXMResponse, useClientAPI, useConnectedXM } from "..";

export interface MutationParams {
  clientApi: AxiosInstance;
  locale?: string;
  queryClient?: QueryClient;
}

export interface MutationOptions<TResponseData, TMutationParams>
  extends UseMutationOptions<
    TResponseData,
    AxiosError<TResponseData> | Error,
    TMutationParams
  > {}

export const useConnectedMutation = <
  TMutationParams extends MutationParams,
  TResponseData extends ConnectedXMResponse<any>
>(
  mutation: MutationFunction<TResponseData, TMutationParams>,
  params?: Omit<MutationParams, "queryClient" | "clientApi">,
  options?: Omit<
    MutationOptions<
      TResponseData,
      Omit<TMutationParams, "queryClient" | "clientApi">
    >,
    "mutationFn"
  >
) => {
  const { locale } = useConnectedXM();
  const queryClient = useQueryClient();
  const clientApi = useClientAPI();

  return useMutation<
    TResponseData,
    AxiosError<TResponseData> | Error,
    Omit<TMutationParams, "queryClient" | "clientApi">
  >({
    mutationFn: (data) =>
      mutation({
        locale: params?.locale || locale,
        ...data,
        queryClient,
        clientApi,
      } as TMutationParams),
    ...options,
  });
};

export default useConnectedMutation;
