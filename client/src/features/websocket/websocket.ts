import { createSlice } from "@reduxjs/toolkit";

interface MessageData {
  event: string;
  data: unknown;
}

const websocketSlice = createSlice({
  name: "websocket",
  initialState: {
    socket: null,
    messages: <MessageData[]> [], // To store incoming messages
  },
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
});

export const { setSocket, addMessage } = websocketSlice.actions;
export default websocketSlice.reducer;
