"use client"

import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { useState } from 'react';

export default function TwitchPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [search, setSearch] = useState('');

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <div>Please sign in to view this page.</div>;
  }

  return (
    <div className="flex items-center space-x-4">
      <Image 
        className="h-10 w-10 rounded-full" 
        src={user.imageUrl || '/placeholder.svg'} 
        alt="User image" 
        width={100} 
        height={100}
      />
      <div>
        <div className="font-bold">{user.fullName}</div>
        <div className="text-sm text-gray-500">{user.primaryEmailAddress?.emailAddress}</div>
        <input 
          type="text" 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          className="mt-2 p-2 border rounded"
        />
        {/* <SearchUser userId={user.id} search={search} /> */}
      </div>
    </div>
  );
}