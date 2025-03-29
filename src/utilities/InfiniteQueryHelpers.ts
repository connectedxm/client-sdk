import { InfiniteData, QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "..";
import { Draft, produce } from "immer";
import { GetBaseInfiniteQueryKeys } from "@src/queries/useConnectedInfiniteQuery";

export const PrependInfiniteQuery = <TData>(
  queryClient: QueryClient,
  key: QueryKey,
  locale: string,
  newData: TData
) => {
  queryClient.setQueryData(
    [...key, ...GetBaseInfiniteQueryKeys(locale)] as QueryKey,
    (oldData: InfiniteData<ConnectedXMResponse<TData[]>>) => {
      return produce(oldData, (draft) => {
        if (draft?.pages?.[0]?.data) {
          if (
            draft?.pages?.[0]?.data &&
            draft?.pages?.[0]?.data?.length > 0 &&
            newData
          ) {
            draft?.pages?.[0]?.data?.unshift(newData as any);
          } else {
            draft.pages[0].data = [newData as any];
          }
        }
      });
    }
  );
};

export const AppendInfiniteQuery = <TData>(
  queryClient: QueryClient,
  key: QueryKey,
  locale: string,
  newData: TData
) => {
  queryClient.setQueryData(
    [...key, ...GetBaseInfiniteQueryKeys(locale)] as QueryKey,
    (oldData: InfiniteData<ConnectedXMResponse<TData[]>>) => {
      return produce(oldData, (draft) => {
        if (draft?.pages?.[0]?.data) {
          if (
            draft?.pages?.[0]?.data &&
            draft?.pages?.[0]?.data?.length > 0 &&
            newData
          ) {
            draft?.pages?.[0]?.data?.push(newData as Draft<TData>);
          } else {
            draft.pages[0].data = [newData as Draft<TData>];
          }
        }
      });
    }
  );
};

export const UpdateInfiniteQueryItem = <TData>(
  queryClient: QueryClient,
  key: QueryKey,
  locale: string,
  updatedData: (item: Draft<TData>) => Draft<TData>,
  findFn: (item: TData) => boolean
) => {
  queryClient.setQueryData(
    [...key, ...GetBaseInfiniteQueryKeys(locale)] as QueryKey,
    (oldData: InfiniteData<ConnectedXMResponse<TData[]>>) => {
      return produce(oldData, (draft) => {
        if (draft?.pages) {
          for (const page of draft.pages) {
            if (page?.data) {
              const index = page.data.findIndex((item: any) => findFn(item));
              if (index !== -1) {
                page.data[index] = updatedData(page.data[index]!);
                break;
              }
            }
          }
        }
      });
    }
  );
};

export const RemoveInfiniteQueryItem = <TData>(
  queryClient: QueryClient,
  key: QueryKey,
  locale: string,
  findFn: (item: TData) => boolean
) => {
  queryClient.setQueryData(
    [...key, ...GetBaseInfiniteQueryKeys(locale)] as QueryKey,
    (oldData: InfiniteData<ConnectedXMResponse<TData[]>>) => {
      return produce(oldData, (draft) => {
        if (draft?.pages) {
          for (const page of draft.pages) {
            if (page?.data) {
              const index = page.data.findIndex((item: any) => findFn(item));
              if (index !== -1) {
                page.data.splice(index, 1);
                break;
              }
            }
          }
        }
      });
    }
  );
};
