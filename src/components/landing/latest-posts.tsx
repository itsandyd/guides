'use client'

import getLatestPosts from '@/actions/latest-posts';
import React, { useEffect, useState } from 'react';
import { PostCard } from './post-card';
import Link from 'next/link';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { cn } from '@/lib/utils';

type Post = {
  id: string;
  title: string;
  content: any;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  subredditId: string;
  tagId: string | null;
};

type LatestPost = {
  subredditName: string;
  latestPosts: Post[];
};

const LatestPosts = () => {
  const [latestPosts, setLatestPosts] = useState<LatestPost[]>([]);

  useEffect(() => {
    async function fetchLatestPosts() {
      const posts = await getLatestPosts();
      setLatestPosts(posts);
    }

    fetchLatestPosts();
  }, []);

  return (
    <div>
      {latestPosts.map(({ subredditName, latestPosts }) => (
        <div key={subredditName} className="flex flex-col space-y-1.5 p-6">
          <h2 className="text-2xl font-semibold leading-none tracking-tight mb-4">Latest Posts in {subredditName}</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
            {latestPosts.map((post) => (
              <Link href={`/guides/${subredditName}/post/${post.id}`} key={post.id}>
                <Card>
                  <CardHeader>
                    <CardTitle>{post.title}</CardTitle>
                  </CardHeader>
                  {/* <CardContent>
                    Insert content here
                  </CardContent>
                  <CardFooter>
                    Insert footer here
                  </CardFooter> */}
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default LatestPosts;