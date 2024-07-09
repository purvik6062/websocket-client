import { connectDB } from "@/config/connectDB";
import { SOCKET_BASE_URL } from "@/config/constants";
import { NextResponse, NextRequest } from "next/server";
import { io } from "socket.io-client";

interface MeetingRequestBody {
  host_address: string;
  attendee_address: string;
  booking_status: string;
  dao_name: string;
  title: string;
  session_type: string;
}

export async function POST(req: NextRequest) {
  const {
    host_address,
    attendee_address,
    booking_status,
    dao_name,
    title,
    session_type,
  }: MeetingRequestBody = await req.json();

  try {
    const client = await connectDB();

    const db = client.db();
    const bookingCollection = db.collection("ws1");

    const result = await bookingCollection.insertOne({
      host_address,
      attendee_address,
      booking_status,
      dao_name,
      title,
      session_type,
    });

    if (result.insertedId) {
      const insertedDocument = await bookingCollection.findOne({
        _id: result.insertedId,
      });
      console.log("inside inserted doc", insertedDocument);

      // Create notifications
      const notificationToHost = {
        receiver_address: host_address,
        content: `${attendee_address} has booked your session on ${dao_name}.`,
        createdAt: Date.now(),
        read_status: false,
        notification_name: "booking",
        notification_type: "newBookingForHost",
      };

      const notificationToGuest = {
        receiver_address: attendee_address,
        content: `Your session on ${dao_name} has been successfully booked with ${host_address}.`,
        createdAt: Date.now(),
        read_status: false,
        notification_name: "booking",
        notification_type: "newBookingForHost",
      };

      const notificationCollection = db.collection("notifications");

      const notificationResults = await notificationCollection.insertMany([
        notificationToHost,
        notificationToGuest,
      ]);

      console.log("notificationResults", notificationResults);

      if (notificationResults.insertedCount === 2) {
        const insertedNotifications = await notificationCollection
          .find({
            _id: { $in: Object.values(notificationResults.insertedIds) },
          })
          .toArray();

        console.log("insertedNotifications", insertedNotifications);
      }

      const socket = io(`${SOCKET_BASE_URL}`, {
        withCredentials: true,
      });
      const dataToSendHost = notificationToHost.content;
      const dataToSendGuest = notificationToGuest.content;
      socket.on("connect", () => {
        console.log("Connected to WebSocket server from API");
        socket.emit("new_session", {
          host_address,
          dataToSendHost,
          attendee_address,
          dataToSendGuest,
        });
        console.log("Message sent from API to socket server");
        socket.disconnect();
      });

      socket.on("connect_error", (err) => {
        console.error("WebSocket connection error:", err);
      });

      socket.on("error", (err) => {
        console.error("WebSocket error:", err);
      });

      client.close();
      return NextResponse.json(
        { success: true, result: insertedDocument },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Failed to retrieve inserted document" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error storing meeting:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
