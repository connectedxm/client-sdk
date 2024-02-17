import { QueryClient, QueryKey } from "@tanstack/react-query";

export const UpdateResharesSingle = (
  increment: boolean,
  queryClient: QueryClient,
  KEY: QueryKey
) => {
  queryClient.setQueryData(KEY, (data: any) => {
    if (!data?.data) {
      return data;
    }
    data = data.data;
    if (typeof data?._count != "undefined") {
      return {
        data: {
          ...data,
          _count: {
            ...data._count,
            reshares: increment
              ? data._count.reshares + 1
              : data._count.reshares - 1,
          },
          reshares: increment ? [{}] : undefined,
        },
      };
    }
  });
};

export const UpdateResharesInfinite = (
  increment: boolean,
  queryClient: QueryClient,
  KEY: QueryKey,
  activityId: string
) => {
  // Optimistic mutation for infinite query
  queryClient.setQueriesData({ queryKey: KEY, exact: false }, (data: any) => {
    if (!data?.pages || data?.pages?.length === 0) {
      return data;
    }
    const pages = data.pages;
    let activityIndex;
    let pageIndex;
    let reshareActivityIndex;
    let resharePageIndex;
    for (let x = 0; x < pages?.length; x++) {
      for (let y = 0; y < pages?.[x]?.data?.length; y++) {
        if (pages?.[x]?.data?.[y]?.id === activityId) {
          pageIndex = x;
          activityIndex = y;
        }
        if (pages?.[x]?.data?.[y]?.reshared?.id === activityId) {
          resharePageIndex = x;
          reshareActivityIndex = y;
        }
      }
    }
    if (
      typeof pageIndex != "undefined" &&
      typeof activityIndex != "undefined"
    ) {
      pages[pageIndex].data[activityIndex]._count.reshares = increment
        ? pages?.[pageIndex]?.data[activityIndex]._count.reshares + 1
        : pages?.[pageIndex]?.data[activityIndex]._count.reshares - 1;
      pages[pageIndex].data[activityIndex].reshares = increment
        ? [{}]
        : undefined;
    }
    if (
      typeof resharePageIndex != "undefined" &&
      typeof reshareActivityIndex != "undefined"
    ) {
      pages[resharePageIndex].data[
        reshareActivityIndex
      ].reshared._count.reshares = increment
        ? pages?.[resharePageIndex]?.data[reshareActivityIndex].reshared._count
            .reshares + 1
        : pages?.[resharePageIndex]?.data[reshareActivityIndex].reshared._count
            .reshares - 1;
      pages[resharePageIndex].data[reshareActivityIndex].reshared.reshares =
        increment ? [{}] : undefined;
    }
    return { ...data, pages };
  });
};
