import { BrowserRouter, Route, Routes } from "react-router";

import Home from "./router/Home/Home.tsx";
import { ChatDirectMessage, ChatGuild } from "./router/Chat/mod.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<Home />} />
        <Route path="/channel/:id" element={<ChatGuild />} />
        <Route path="/chat/:id" element={<ChatDirectMessage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
