import { NextRequest, NextResponse } from "next/server";
import { io } from "socket.io-client";

export const revalidate = 0;

export async function POST(req: NextRequest) {
  const { num1, num2 } = await req.json();

  console.log(num1 + " " + num2);

  if (typeof num1 !== "number" || typeof num2 !== "number") {
    return NextResponse.json(
      { success: false, error: "Invalid input" },
      { status: 400 }
    );
  }

  const result = num1 + num2;

  return new Promise((resolve) => {
    const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Connected to WebSocket server from API");
      socket.emit("sum", result);
    });

    socket.on("sum_result", (data: any) => {
      console.log("Received:", data);
      socket.disconnect();
      resolve(
        NextResponse.json({ success: true, data: data }, { status: 200 })
      );
    });

    socket.on("connect_error", (err: any) => {
      console.error("WebSocket connection error:", err);
      resolve(
        NextResponse.json(
          { success: false, error: "WebSocket connection error" },
          { status: 500 }
        )
      );
    });

    socket.on("error", (err: any) => {
      console.error("WebSocket error:", err);
      resolve(
        NextResponse.json(
          { success: false, error: "WebSocket error" },
          { status: 500 }
        )
      );
    });

    // // Add a timeout to ensure the function doesn't hang indefinitely
    // setTimeout(() => {
    //   socket.disconnect();
    //   resolve(
    //     NextResponse.json(
    //       { success: false, error: "Operation timed out" },
    //       { status: 504 }
    //     )
    //   );
    // }, 10000);
  });
}
