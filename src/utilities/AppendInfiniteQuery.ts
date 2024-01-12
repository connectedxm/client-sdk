import { QueryClient } from "@tanstack/react-query";

const AppendInfiniteQuery = (
  queryClient: QueryClient,
  key: Array<string>,
  newData: any
) => {
  queryClient.setQueriesData(key, (data: any) => {
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

export default AppendInfiniteQuery;
