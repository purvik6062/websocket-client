import { SOCKET_BASE_URL } from "@/config/constants";
import { NextRequest, NextResponse } from "next/server";
import { io } from "socket.io-client";

export const revalidate = 0;

export async function POST(req: NextRequest) {
  const { message, addresses } = await req.json();

  console.log("message in API", message);
  console.log("addresses in API", addresses);
  const socket = io(`${SOCKET_BASE_URL}`, {
    withCredentials: true,
  });

  socket.on("connect", () => {
    console.log("Connected to WebSocket server from API");
    socket.emit("send_message", { addresses, message });
    console.log("Message sent from API to socket server");
    socket.disconnect();
  });

  socket.on("connect_error", (err) => {
    console.error("WebSocket connection error:", err);
  });

  socket.on("error", (err) => {
    console.error("WebSocket error:", err);
  });

  return NextResponse.json({ success: true }, { status: 200 });
}
