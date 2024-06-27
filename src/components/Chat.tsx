"use client";
import { useSocket } from "@/app/hooks/useSocket";
import React, { useState, useEffect } from "react";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [address, setAddress] = useState("");
  const [messages, setMessages] = useState<any>([]);
  const socket = useSocket();

  useEffect(() => {
    const userAddress = "0x6186f005bf26884F952099bE94dac1F1b3E429e1";
    if (socket) {
      console.log("Registering address:", userAddress);
      socket.emit("register", userAddress);

      socket.on("receive_message", (message: any) => {
        console.log("Received message:", message);
        setMessages((prevMessages: any) => [...prevMessages, message]);
      });

      return () => {
        socket.off("receive_message");
      };
    }
  }, [socket]);

  const sendMessage = async () => {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, addresses: [address] }),
    });
    const result = await response.json();
    console.log("result in API", result);
    if (response.ok) {
      setMessage("");
    }
  };

  return (
    <div>
      <h1>Chat</h1>
      <input
        className="mr-2 text-black"
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message"
      />
      <input
        className="mr-2 text-black"
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Recipient Address"
      />
      <button onClick={sendMessage}>Send</button>
      <ul>
        {messages.map((msg: any, index: any) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}
