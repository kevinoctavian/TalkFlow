import _React from "react";
import { useParams } from "react-router";

function ChatDirectMessage() {
  const params = useParams();

  return <div>ChatDirectMessage {params.id}</div>;
}

export default ChatDirectMessage;
