"use client";
// components/Chat.js
import { useEffect, useState } from "react";
import { initSocket, getSocket } from "../utils/socket";
import { useSocket } from "@/app/hooks/useSocket";

const Chat = () => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);
  const socket = useSocket();
  console.log("socket", socket);
  //   useEffect(() => {
  //     const socket = initSocket();

  //     socket.on("message", (data: any) => {
  //       setMessages((prevMessages: any) => [...prevMessages, data]);
  //     });

  //     return () => {
  //       socket.disconnect();
  //     };
  //   }, []);

  //   const sendMessage = (message: any) => {
  //     const socket = getSocket();
  //     socket.emit("message", message);
  //   };

  useEffect(() => {
    if (socket) {
      socket.on("message2", (data: string) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      });
    }
  }, [socket]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message && socket) {
      socket.emit("message2", message);
      setMessage("");
    }
  };

  return (
    // Your chat component JSX
    <>
      <div>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
        <form onSubmit={handleSubmit}>
          <input
            className="text-black"
            type="text"
            value={message}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setMessage(e.target.value)
            }
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </>
  );
};

export default Chat;
