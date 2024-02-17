import { QueryClient, QueryKey } from "@tanstack/react-query";

export const UpdateCommentsSingle = (
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
            comments: increment
              ? data._count.comments + 1
              : data._count.comments - 1,
          },
          comments: increment ? [{}] : undefined,
        },
      };
    }
  });
};

export const UpdateCommentsInfinite = (
  increment: boolean,
  queryClient: QueryClient,
  KEY: QueryKey,
  activityId: string
) => {
  queryClient.setQueriesData(
    {
      queryKey: KEY,
      exact: false,
    },
    (data: any) => {
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
        pages[pageIndex].data[activityIndex]._count.comments = increment
          ? pages?.[pageIndex]?.data[activityIndex]._count.comments + 1
          : pages?.[pageIndex]?.data[activityIndex]._count.comments - 1;
        pages[pageIndex].data[activityIndex].comments = increment
          ? [{}]
          : undefined;
      }
      if (
        typeof resharePageIndex != "undefined" &&
        typeof reshareActivityIndex != "undefined"
      ) {
        pages[resharePageIndex].data[
          reshareActivityIndex
        ].reshared._count.comments = increment
          ? pages?.[resharePageIndex]?.data[reshareActivityIndex].reshared
              ._count.comments + 1
          : pages?.[resharePageIndex]?.data[reshareActivityIndex].reshared
              ._count.comments - 1;
        pages[resharePageIndex].data[reshareActivityIndex].reshared.comments =
          increment ? [{}] : undefined;
      }
      return { ...data, pages };
    }
  );
};
