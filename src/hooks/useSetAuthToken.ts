import { useConnectedXMContext } from "./useConnectedXMContext";

export const useSetToken = () => {
  const { setAuthToken } = useConnectedXMContext();
  return setAuthToken;
};
