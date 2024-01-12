import axios from "axios";
import { useConnectedXM } from "./hooks/useConnectedXM";

const ClientAPI = async () => {
  const { apiUrl, authToken, organizationId, executeAs, locale } =
    useConnectedXM();

  const api = axios.create({
    baseURL: apiUrl,
    headers: {
      authorization: authToken,
      organization: organizationId,
      executeAs: executeAs,
      locale: !!locale && locale !== "en" ? locale : undefined,
    },
  });

  return api;
};

export default ClientAPI;
