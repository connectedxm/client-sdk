import { MessageEffect } from "../WSMessageBus";
import { ThreadMessage } from "@src/interfaces";

const ThreadMessageUpdatedEffect: MessageEffect<ThreadMessage> = (
  queryClient,
  locale,
  data
) => {
  console.log("ThreadMessageUpdatedEffect", data);
};

export default ThreadMessageUpdatedEffect;
