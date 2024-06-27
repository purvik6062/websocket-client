"use client";
import { useState, useEffect } from "react";
import { useSocket } from "@/app/hooks/useSocket";

const HomePage = () => {
  const [num1, setNum1] = useState<number>(0);
  const [num2, setNum2] = useState<number>(0);
  const [message, setMessage] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const socket = useSocket();

  const handleSum = async () => {
    try {
      const response = await fetch("/api/websocket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ num1, num2 }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("API response:", data);
    } catch (err: any) {
      console.error("API error:", err);
      setError("API error: " + err.message);
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("sum_result", (data: any) => {
        console.log("Received sum result from server:", data);
        setMessage(data);
      });

      socket.on("connect_error", (err: any) => {
        setError("WebSocket connection error: " + err.message);
      });

      socket.on("error", (err: any) => {
        setError("WebSocket error: " + err.message);
      });

      return () => {
        socket.off("sum_result");
        socket.off("connect_error");
        socket.off("error");
      };
    }
  }, [socket]);

  return (
    <div>
      <h1>WebSocket API Example</h1>
      <div>
        <input
          className="mr-2 text-black"
          type="number"
          value={num1}
          onChange={(e) => setNum1(Number(e.target.value))}
          placeholder="Enter first number"
        />
        <input
          className="mr-2 text-black"
          type="number"
          value={num2}
          onChange={(e) => setNum2(Number(e.target.value))}
          placeholder="Enter second number"
        />
        <button onClick={handleSum}>Sum</button>
      </div>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <p style={{ color: "white" }}>{message}</p>
      )}
    </div>
  );
};

export default HomePage;
