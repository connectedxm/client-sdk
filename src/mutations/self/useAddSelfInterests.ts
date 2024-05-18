import { GetClientAPI } from "@src/ClientAPI";
import { Account, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationParams,
  MutationOptions,
} from "../useConnectedMutation";
import { SELF_INTERESTS_QUERY_KEY } from "@src/queries";

export interface AddSelfInterestsParams extends MutationParams {
  interestIds: string[];
}

export const AddSelfInterests = async ({
  interestIds,
  clientApiParams,
  queryClient,
}: AddSelfInterestsParams): Promise<ConnectedXMResponse<Account>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Account>>(
    "/self/interests",
    { interestIds }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SELF_INTERESTS_QUERY_KEY(),
    });
  }

  return data;
};

export const useAddSelfInterests = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof AddSelfInterests>>,
      Omit<AddSelfInterestsParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddSelfInterestsParams,
    Awaited<ReturnType<typeof AddSelfInterests>>
  >(AddSelfInterests, options);
};
