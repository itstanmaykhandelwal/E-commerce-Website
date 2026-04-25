import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

// ⚠️ socket ko outside rakhenge (single connection)
const socket = io("http://localhost:4000");

const Navbar = ({ setToken }) => {
  const [count, setCount] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);

  // 🔊 Enable audio after first user interaction
  useEffect(() => {
    const enableAudio = () => {
      setAudioEnabled(true);
      window.removeEventListener("click", enableAudio);
    };

    window.addEventListener("click", enableAudio);

    return () => {
      window.removeEventListener("click", enableAudio);
    };
  }, []);

  // 🔔 Socket listener
  useEffect(() => {
    const handleNewOrder = (data) => {
      console.log("NEW ORDER:", data);

      // 🔔 Bell count update
      setCount((prev) => prev + 1);

      // 🔊 Play sound only if allowed
      if (audioEnabled) {
        const audio = new Audio("/notification.wav");
        audio.play().catch((err) => {
          console.log("Sound blocked:", err);
        });
      }

      // 📢 Toast notification
      toast.info("New Order Received 🚀", {
        position: "top-right",
      });
    };

    socket.on("newOrder", handleNewOrder);

    return () => {
      socket.off("newOrder", handleNewOrder);
    };
  }, [audioEnabled]);

  return (
    <div className="flex items-center py-2 px-[4%] justify-between bg-white shadow">
      
      {/* Logo */}
      <img
        className="w-[max(10%,80px)]"
        src={assets.logo}
        alt="logo"
      />

      {/* Right Side */}
      <div className="flex items-center gap-5">

        {/* 🔔 Bell Icon */}
        <div className="relative cursor-pointer text-2xl">
          🔔
          {count > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
              {count}
            </span>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={() => setToken("")}
          className="bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm"
        >
          Logout
        </button>

      </div>
    </div>
  );
};

export default Navbar;