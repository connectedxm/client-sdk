import { ConnectedXMResponse, LinkPreview } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";

export interface UpsertLinkPreviewParams extends MutationParams {
  href: string;
}

export const UpsertLinkPreview = async ({
  href,
  clientApiParams,
}: UpsertLinkPreviewParams): Promise<ConnectedXMResponse<LinkPreview | null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<LinkPreview | null>>(
    `/organization/link-preview`,
    {
      href,
    }
  );
  return data;
};

export const useUpsertLinkPreview = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpsertLinkPreview>>,
      Omit<UpsertLinkPreviewParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpsertLinkPreviewParams,
    Awaited<ReturnType<typeof UpsertLinkPreview>>
  >(UpsertLinkPreview, options);
};
