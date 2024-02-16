import ConnectedXM from "@context/api/ConnectedXM";
import { QUERY_KEY as NOTIFICATION_PREFERENCES } from "@context/queries/self/useGetSelfNotificationPreferences";
import { useQueryClient } from "@tanstack/react-query";

import useConnectedMutation, { MutationParams } from "../useConnectedMutation";

interface UpdateSelfNotificationPreferencesParams extends MutationParams {
  newFollowerPush?: boolean;
  newFollowerEmail?: boolean;
  likePush?: boolean;
  resharePush?: boolean;
  commentPush?: boolean;
  transferPush?: boolean;
  transferEmail?: boolean;
  supportTicketConfirmationEmail?: boolean;
  chatPush?: boolean;
  chatUnreadPush?: boolean;
  chatUnreadEmail?: boolean;
}

export const UpdateSelfNotificationPreferences = async (
  params: UpdateSelfNotificationPreferencesParams,
) => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.put(
    `/self/notificationPreferences`,
    params,
  );
  return data;
};

export const useUpdateSelfNotificationPreferences = () => {
  const queryClient = useQueryClient();

  return useConnectedMutation<UpdateSelfNotificationPreferencesParams>(
    UpdateSelfNotificationPreferences,
    {
      onMutate: (newData) => {
        queryClient.setQueryData([NOTIFICATION_PREFERENCES], (oldData: any) => {
          if (oldData?.data) {
            oldData.data = { ...oldData.data, ...newData };
            return oldData;
          } else {
            return oldData;
          }
        });
      },
    },
  );
};

export default useUpdateSelfNotificationPreferences;
