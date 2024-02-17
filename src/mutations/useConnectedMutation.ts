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
  locale?: string;
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
  TMutationParams extends Omit<
    MutationParams,
    "locale" | "queryClient" | "clientApi"
  >,
  TResponseData extends ConnectedXMResponse<any>
>(
  mutation: MutationFunction<TResponseData, TMutationParams>,
  params?: Omit<MutationParams, "queryClient" | "clientApi">,
  options?: MutationOptions<TResponseData, TMutationParams>
) => {
  const { locale } = useConnectedXM();
  const queryClient = useQueryClient();
  const clientApi = useClientAPI();

  return useMutation<
    TResponseData,
    AxiosError<TResponseData> | Error,
    TMutationParams
  >({
    mutationFn: (data) =>
      mutation({
        queryClient,
        locale: params?.locale || locale,
        clientApi,
        ...data,
      }),
    ...options,
  });
};

export default useConnectedMutation;
