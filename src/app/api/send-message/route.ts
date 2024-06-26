import { initSocket } from "@/utils/socket";

export default function handler(req: any, res: any) {
  if (req.method === "POST") {
    const socket = initSocket();
    socket.emit("message", req.body.message);
    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
