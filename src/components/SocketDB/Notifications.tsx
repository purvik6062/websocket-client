"use client";
import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useSocket } from "@/app/hooks/useSocket";
import { toast } from "react-toastify";

function Notifications() {
  const { address } = useAccount();
  const socket = useSocket();
  const [notifications, setNotifications] = useState<any>([]);
  const [newNotifications, setNewNotifications] = useState<any>([]);
  const [socketId, setSocketId] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
          address: address,
        });

        const requestOptions: RequestInit = {
          method: "POST",
          headers: myHeaders,
          body: raw,
        };
        const response = await fetch("/api/notifications", requestOptions);
        const result = await response.json();
        console.log("result", result);
        if (result.success && result.data) {
          setNotifications(result.data);
        } else {
          console.error("Failed to fetch notifications");
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [address]);

  useEffect(() => {
    if (socket) {
      // Capture the socket ID when the socket connects
      socket.on("connect", () => {
        setSocketId(socket.id);
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        setSocketId(null);
      });
    }
  }, [socket]);

  useEffect(() => {
    const hostAddress = address;
    if (socket && address && socketId) {
      console.log(
        "Registering address:",
        hostAddress,
        "with socket ID:",
        socketId
      );
      socket.emit("register_host", { hostAddress, socketId });

      socket.on("new_notification", (message: any) => {
        const notificationData: any = {
          content: message,
          createdAt: Date.now(),
          read: false,
          type: "booking",
        };
        setNewNotifications((prevNotifications: any) => [
          ...prevNotifications,
          notificationData,
        ]);
        toast(message);
      });
    }

    return () => {
      if (socket) {
        socket.off("new_notification");
      }
    };
  }, [socket, address, socketId]);

  function convertTimestampToReadableString(timestamp: any) {
    // Convert the timestamp to a Date object
    const date = new Date(timestamp);

    // Get the local readable string
    const readableString = date.toLocaleString();

    return readableString;
  }

  const allNotifications = [...newNotifications, ...notifications].sort(
    (a, b) => b.createdAt - a.createdAt
  );

  return (
    <div>
      <h2>Notifications</h2>
      {allNotifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <ul>
          {allNotifications.map((notification: any, index: any) => (
            <li key={index}>
              {notification.content} -{" "}
              {convertTimestampToReadableString(notification.createdAt)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Notifications;
