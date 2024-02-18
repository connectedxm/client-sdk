import { QueryClient, QueryFilters, QueryKey } from "@tanstack/react-query";

export const AppendInfiniteQuery = <TData = unknown>(
  queryClient: QueryClient,
  key: QueryKey,
  newData: TData
) => {
  queryClient.setQueriesData(key as QueryFilters, (data: any) => {
    if (data?.pages?.[0]?.data) {
      if (
        data?.pages?.[0]?.data &&
        data?.pages?.[0]?.data?.length > 0 &&
        newData
      ) {
        data?.pages?.[0]?.data?.unshift(newData);
      } else {
        data.pages[0].data = [newData];
      }
    }
    return data;
  });
};
