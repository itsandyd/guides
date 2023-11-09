"use client"

import { ChannelForm } from "@/components/twitch/AddStreamer";
import { authOptions, getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AddStreamerPage() {

  // const session = await getAuthSession()

  // if (!session?.user) {
  //   redirect(authOptions?.pages?.signIn || '/login')
  // }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Add Streamer</h1>
      <ChannelForm />
    </div>
  );
}