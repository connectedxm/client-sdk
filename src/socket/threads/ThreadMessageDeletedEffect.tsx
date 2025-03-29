import { MessageEffect } from "../WSMessageBus";

const ThreadMessageDeletedEffect: MessageEffect<string> = (
  queryClient,
  locale,
  data
) => {
  console.log("ThreadMessageDeletedEffect", data);
};

export default ThreadMessageDeletedEffect;
