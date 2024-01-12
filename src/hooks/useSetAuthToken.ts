import { useConnectedXM } from "./useConnectedXM";

export const useSetToken = () => {
  const { setAuthToken } = useConnectedXM();
  return setAuthToken;
};
