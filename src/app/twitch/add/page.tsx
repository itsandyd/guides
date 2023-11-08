"use client"

import { ChannelForm } from "@/components/twitch/AddStreamer";

export default function AddStreamerPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Add Streamer</h1>
      <ChannelForm />
    </div>
  );
}