"use client"

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import axios from "axios";
import { CreatePostFormSchema } from "@/lib/schema";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Select, SelectItem } from "../ui/select";

interface CreatePostProps {
    title: string;
    content: string;
    description: string;
    thumbnail: string;
    subreddits: { id: string; name: string }[];
}

export const CreatePost: React.FC<CreatePostProps> = ({ title, content, description, thumbnail, subreddits }) => {
    const form = useForm({
        resolver: zodResolver(CreatePostFormSchema),
        defaultValues: {
            title,
            content,
            description,
            thumbnail,
            subredditId: subreddits.length > 0 ? subreddits[0].id : "",
        },
    });

    const onSubmit = async (data: { title: string; content: string; description: string; thumbnail: string; subredditId: string }) => {
        try {
            const response = await axios.post('/api/subreddit/post/create', data);
            console.log('Post created:', response.data);
            toast.success("Post created successfully!");
        } catch (error) {
            console.error('Error creating post:', error);
            toast.error("Failed to create post.");
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
            <Input
                {...form.register("title")}
                placeholder="Enter title"
            />
            <Textarea
                {...form.register("content")}
                placeholder="Enter content"
                className="h-full flex"
            />
            <Input
                {...form.register("description")}
                placeholder="Enter description"
            />
            <Input
                {...form.register("thumbnail")}
                placeholder="Enter thumbnail URL"
            />
     <Select
                {...form.register("subredditId")}
                // placeholder="Select subreddit"
            >
                {subreddits.map((subreddit) => (
                    <SelectItem key={subreddit.id} value={subreddit.id}>
                        {subreddit.name}
                    </SelectItem>
                ))}
            </Select>
            <Button type="submit" disabled={form.formState.isSubmitting}>
                Create Post
            </Button>
        </form>
    );
};

export default CreatePost;