import { Activity, ConnectedXMResponse } from "@src/interfaces";
import { InfiniteData, QueryClient, QueryKey } from "@tanstack/react-query";
import { produce } from "immer";

export const UpdateResharesSingle = (
  increment: boolean,
  queryClient: QueryClient,
  KEY: QueryKey
) => {
  queryClient.setQueryData(KEY, (originalData: ConnectedXMResponse<Activity>) =>
    produce(originalData, (draft) => {
      if (!draft?.data) {
        return;
      }

      draft.data._count.reshares += increment ? 1 : -1;
      draft.data.reshares = increment ? [{ id: Date.now().toString() }] : [];
    })
  );
};

export const UpdateResharesInfinite = (
  increment: boolean,
  queryClient: QueryClient,
  KEY: QueryKey,
  activityId: string
) => {
  queryClient.setQueriesData(
    { queryKey: KEY, exact: false },
    (originalData: InfiniteData<ConnectedXMResponse<Activity[]>> | undefined) =>
      produce(originalData, (draft) => {
        if (!draft?.pages || draft.pages.length === 0) {
          return;
        }

        for (const page of draft.pages) {
          for (const activity of page.data) {
            if (activity.id === activityId) {
              activity._count.reshares += increment ? 1 : -1;
              activity.reshares = increment
                ? [{ id: Date.now().toString() }]
                : [];
            }
          }
        }
      })
  );
};
