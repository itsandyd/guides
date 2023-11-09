// "use client"

import React from 'react';
import TwitchStream from "@/components/twitch/TwitchStreamer";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

type TwitchChannel = {
    id: string;
    channelName: string;
    userId: string;
};

type TwitchChannelsProps = {
  channels: TwitchChannel[];
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const TwitchChannels: React.FC<TwitchChannelsProps> = ({ channels }) => {

    const { data: channels, error } = useSWR('/api/twitch/channels', fetcher, { refreshInterval: 5000 });

    if (error) return <div>Failed to load</div>
    if (!channels) return <div>Loading...</div>


  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      {channels.map((channel: TwitchChannel, index: number) => (
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