"use client";
import React, { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import NotificationComponent from "./NotificationComponent";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();
  return (
    <>
      <div className="bg-gray-800 flex p-5 h-[5rem]">
        <div className="relative z-50 flex items-center">
          <Link href={`/notifications`}>
            <NotificationComponent />
          </Link>
        </div>
        <div className="absolute text-slate-100 right-10">
          <ConnectButton />
        </div>
      </div>
    </>
  );
}
