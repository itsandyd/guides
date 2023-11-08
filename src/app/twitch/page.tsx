import React from 'react';
import TwitchStream from "@/components/twitch/TwitchStreamer";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

import Link from 'next/link'; // Import Link component
import { Button } from '@/components/ui/Button';

const HomePage = () => {
  const channels = ["1recon11", "neatgangdotcom", "ccsyks"]; // Add your channel names here

  return (
    <>
      <Link href="/twitch/add">
        <Button className="p-4 mb-4" variant="default">Add Stream</Button> {/* Add Button component */}
      </Link>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {channels.map((channel, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{channel}</CardTitle>
            </CardHeader>
            <CardContent>
              <TwitchStream channel={channel} />
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default HomePage;