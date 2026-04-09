import { useEffect, useRef, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { useConnected } from "./useConnected";

interface AnalyticsEvent {
  event_id: string;
  organization_id: string;
  user_id?: string;
  anonymous_id?: string;
  event_name: string;
  platform: string;
  client_timestamp: string;
  properties: Record<string, any>;
}

const BATCH_SIZE = 10;
const FLUSH_INTERVAL_MS = 30000;
const ANONYMOUS_ID_KEY = "cxm_anonymous_id";

export const useAnalytics = (platform: "web" | "mobile") => {
  const { apiUrl, organizationId, token } = useConnected();
  const eventQueue = useRef<AnalyticsEvent[]>([]);
  const flushInterval = useRef<NodeJS.Timeout | null>(null);

  // Get or create anonymous ID
  const getAnonymousId = useCallback(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      let anonId = localStorage.getItem(ANONYMOUS_ID_KEY);
      if (!anonId) {
        anonId = uuidv4();
        localStorage.setItem(ANONYMOUS_ID_KEY, anonId);
      }
      return anonId;
    }
    return uuidv4(); // Fallback for environments without localStorage
  }, []);

  const flush = useCallback(async () => {
    if (eventQueue.current.length === 0) return;

    const eventsToSend = [...eventQueue.current];
    eventQueue.current = []; // Clear queue immediately to prevent duplicates

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`https://${apiUrl}/collect`, {
        method: "POST",
        headers,
        body: JSON.stringify({ events: eventsToSend }),
        keepalive: true, // Important for sending when app is minimized/closing
      });

      if (!response.ok) {
        console.error("Failed to send analytics events", await response.text());
        // Re-queue events if failed (optional, depending on reliability requirements)
        // eventQueue.current = [...eventsToSend, ...eventQueue.current];
      }
    } catch (error) {
      console.error("Error sending analytics events", error);
      // Re-queue events if network error
      // eventQueue.current = [...eventsToSend, ...eventQueue.current];
    }
  }, [apiUrl, token]);

  const track = useCallback(
    (eventName: string, properties: Record<string, any> = {}) => {
      if (!organizationId) {
        console.warn("Analytics: organizationId is not set");
        return;
      }

      // We don't have direct access to user_id here without decoding the token or fetching profile.
      // In a real implementation, you might get this from a user context or pass it in.
      // For now, we rely on the backend to extract it from the token if present, or we just send anonymous_id.

      const event: AnalyticsEvent = {
        event_id: uuidv4(),
        organization_id: organizationId,
        anonymous_id: getAnonymousId(),
        event_name: eventName,
        platform,
        client_timestamp: new Date().toISOString(),
        properties,
      };

      eventQueue.current.push(event);

      if (eventQueue.current.length >= BATCH_SIZE) {
        flush();
      }
    },
    [organizationId, platform, getAnonymousId, flush]
  );

  // Set up timer-based flush
  useEffect(() => {
    flushInterval.current = setInterval(flush, FLUSH_INTERVAL_MS);

    return () => {
      if (flushInterval.current) {
        clearInterval(flushInterval.current);
      }
      // Flush remaining events on unmount
      flush();
    };
  }, [flush]);

  // Handle app minimize/close (Web)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleVisibilityChange = () => {
        if (document.visibilityState === "hidden") {
          flush();
        }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("beforeunload", flush);

      return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        window.removeEventListener("beforeunload", flush);
      };
    }
  }, [flush]);

  // Note: For React Native app minimize, you would typically use AppState from 'react-native'
  // Since this hook needs to work for both, the consumer app might need to call flush() manually
  // when AppState changes to 'background'.

  return { track, flush };
};
