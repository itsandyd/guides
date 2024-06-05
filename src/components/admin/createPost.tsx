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


interface CreatePostProps {
    title: string;
    content: string;
    description: string;
    author: string;
    thumbnail: string;
}

export const CreatePost: React.FC<CreatePostProps> = ({ title, content, description, author, thumbnail }) => {
    const form = useForm({
        resolver: zodResolver(CreatePostFormSchema),
        defaultValues: {
            title,
            content,
        },
    });

    const onSubmit = async (data: { title: string; content: string }) => {
        try {
            const response = await axios.post('/api/blog/post/create', {
                ...data,
                description,
                author,
                thumbnail
            });
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
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
                Create Post
            </Button>
        </form>
    );
};

export default CreatePost;