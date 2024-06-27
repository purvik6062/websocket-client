// import { NextApiRequest, NextApiResponse } from "next";
// import { io } from "socket.io-client";

// const socket = io("http://localhost:3001", {
//   withCredentials: true,
// });

// export default function POST(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === "POST") {
//     const { message, addresses } = req.body;

//     if (!message || !Array.isArray(addresses)) {
//       return res.status(400).json({ success: false, error: "Invalid input" });
//     }

//     socket.emit("send_message", { addresses, message });

//     return res.status(200).json({ success: true });
//   } else {
//     res.setHeader("Allow", ["POST"]);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }
