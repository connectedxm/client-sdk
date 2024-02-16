import { ConnectedXMResponse } from "@context/api/ConnectedXM";
import {
  MutationFunction,
  useMutation,
  UseMutationOptions,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Alert } from "react-native";

export interface MutationParams {}

export const useConnectedMutation = <TVariables = unknown>(
  mutation: MutationFunction<ConnectedXMResponse<any>, TVariables>,
  options?: UseMutationOptions<
    ConnectedXMResponse<any>,
    Error | AxiosError<ConnectedXMResponse<any>>,
    TVariables
  >,
  _loadingText?: string,
  noToast: boolean = false
) => {
  return useMutation<
    ConnectedXMResponse<any>,
    AxiosError<ConnectedXMResponse<any>> | Error,
    TVariables
  >(mutation, {
    ...options,
    onMutate: (variables): void => {
      options?.onMutate && options.onMutate(variables);
    },
    onSuccess: (data, variables, context) => {
      options?.onSuccess && options.onSuccess(data, variables, context);
    },
    onError: (error: any, variables, context) => {
      const message: string = error?.response?.data?.message || error?.message;
      if (!noToast) Alert.alert(message);
      options?.onError && options?.onError(error, variables, context);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error(error.response.data);
        console.error(error.request?.responseURL);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.error(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error", error.message);
      }
    },
  });
};

export default useConnectedMutation;
