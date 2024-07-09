"use client";
import { useSocket } from "@/app/hooks/useSocket";
import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [messages, setMessages] = useState<any>([]);
  const socket = useSocket();
  const { address } = useAccount();
  useEffect(() => {
    const senderAddress = address;
    if (socket) {
      console.log("Registering address:", senderAddress);
      socket.emit("register", senderAddress);

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
      body: JSON.stringify({ message, addresses: [recipientAddress] }),
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
        value={recipientAddress}
        onChange={(e) => setRecipientAddress(e.target.value)}
        placeholder="Recipient address"
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
