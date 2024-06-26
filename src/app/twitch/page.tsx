import React, { useEffect, useState } from 'react';

import TwitchChannels from "@/components/twitch/TwitchChannels"; // Import TwitchChannels component
import { Button } from '@/components/ui/Button';
import { db } from '@/lib/db';
import Link from 'next/link';


const HomePage = async () => {
  const channels = await db.twitchChannel.findMany({
})

  return (
    <>
      <Link href="/twitch/add">
        <Button className="p-4 mb-4" variant="default">Add Stream</Button> {/* Add Button component */}
      </Link>
      <TwitchChannels channels={channels} /> {/* Use TwitchChannels component */}
    </>
  );
};

export default HomePage;