"use client";
import React, { useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import { useSocket } from "@/app/hooks/useSocket";

function SocketDB() {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const socket = useSocket();
  const [daoName, setDaoName] = useState<any>();
  const [formData, setFormData] = useState({
    host_address: "",
    attendee_address: address,
    booking_status: "",
    dao_name: "",
    title: "",
    session_type: "",
  });
  useEffect(() => {
    if (chain && chain?.name) {
      setDaoName(chain?.name);
    }
  }, [chain, chain?.name, daoName]);

  useEffect(() => {
    setFormData((prevFormData) => ({ ...prevFormData, dao_name: daoName }));
  }, [daoName]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const bookSession = async () => {
    const response = await fetch("/api/socket-db", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const result = await response.json();
    console.log("result in API", result);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Book a Session
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            bookSession();
          }}
          className="space-y-4"
        >
          <input
            type="text"
            name="host_address"
            placeholder="Host Address"
            value={formData.host_address}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-black"
          />
          <input
            type="text"
            name="booking_status"
            placeholder="Booking Status"
            value={formData.booking_status}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-black"
          />
          <input
            type="text"
            name="dao_name"
            placeholder="DAO Name"
            value={daoName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-black"
          />
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-black"
          />
          <input
            type="text"
            name="session_type"
            placeholder="Session Type"
            value={formData.session_type}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-black"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Book Session
          </button>
        </form>
      </div>
    </div>
  );
}

export default SocketDB;
