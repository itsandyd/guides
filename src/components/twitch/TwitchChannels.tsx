// "use server"

import React from 'react';
import TwitchStream from "@/components/twitch/TwitchStreamer";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

type TwitchChannel = {
    id: string;
    channelName: string;
    userId: string;
  };

  const TwitchChannels = ({ channels }: { channels: TwitchChannel[] }) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      {channels.map((channel, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{channel.channelName}</CardTitle>
          </CardHeader>
          <CardContent>
            <TwitchStream channel={channel.channelName} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TwitchChannels;