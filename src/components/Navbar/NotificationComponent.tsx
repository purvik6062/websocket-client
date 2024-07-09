"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Badge } from "@nextui-org/react";
import { useAccount } from "wagmi";
import { useSocket } from "@/app/hooks/useSocket";
import { toast } from "react-toastify";
import { NotificationIcon } from "./NotificationIcon";

function NotificationComponent() {
  const { address } = useAccount();
  const socket = useSocket();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [socketId, setSocketId] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
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
        const notificationsData = result.data.map((notification: any) => ({
          content: notification.content,
          createdAt: notification.createdAt,
          read: notification.read_status,
          title: notification.notification_name,
          type: notification.notification_type,
        }));
        setNotifications(notificationsData);
      } else {
        console.error("Failed to fetch notifications");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, [address]);

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 5000);

    return () => clearInterval(interval);
  }, [fetchNotifications]);

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
          title: "booking",
        };
        setNotifications((prevNotifications) => [
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

  // Check if there are any unread notifications
  const hasUnreadNotifications = notifications.some(
    (notification) => !notification.read
  );

  return (
    <>
      <div>
        <Badge
          isInvisible={!hasUnreadNotifications}
          content={""}
          color="danger"
          shape="circle"
          placement="top-right"
        >
          <div>
            <NotificationIcon size={30} />
          </div>
        </Badge>
      </div>
    </>
  );
}

export default NotificationComponent;
