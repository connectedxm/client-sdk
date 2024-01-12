import { useConnectedXM } from "./useConnectedXM";

export const useSetAuthToken = () => {
  const { setAuthToken } = useConnectedXM();
  return setAuthToken;
};
