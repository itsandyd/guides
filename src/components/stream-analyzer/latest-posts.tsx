'use client'

import getLatestPosts from '@/actions/latest-posts';
import React, { useEffect, useState } from 'react';
import { PostCard } from './post-card';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import { cn } from '@/lib/utils';

type Tag = {
  tagId: string;
};

// Adjust the Post type
type Post = {
  id: string;
  title: string;
  content: any; // Adjust according to your actual content type
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  subredditId: string;
  tags: Tag[]; // Use the Tag type here
};

// Adjust the LatestPost type
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
    <div className="space-y-12">
      {latestPosts.map(({ subredditName, latestPosts }) => (
        <div key={subredditName}>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-6">{subredditName}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {latestPosts.map((post) => (
              <Link href={`/guides/${subredditName}/post/${post.id}`} key={post.id}>
                <Card className="transition-all duration-200 hover:scale-105 hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold line-clamp-2">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="mt-2">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {/* Insert content preview or excerpt here */}
                    </p>
                  </CardContent>
                  <CardFooter className="mt-4">
                    <p className="text-xs text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </CardFooter>
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