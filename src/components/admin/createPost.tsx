"use client"

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";
import axios from "axios";
import { CreatePostFormSchema } from "@/lib/schema";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react"; // Import X icon for removing tags
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "../ui/Command";
import { Button } from "../ui/Button";

interface CreatePostProps {
    subreddits: { id: string; name: string }[];
    tags: { id: string; name: string }[];
    title?: string;
    content?: string;
    description?: string;
    thumbnail?: string;
}

type FormData = {
    title: string;
    content: string;
    description: string;
    thumbnail: string;
    subredditId: string;
    tags: string[];
};

export const CreatePost = ({ subreddits, tags, title, content, description, thumbnail }: CreatePostProps) => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(CreatePostFormSchema),
        defaultValues: {
            title: title || '',
            content: content || '',
            description: description || '',
            thumbnail: thumbnail || '',
            subredditId: '',
            tags: [],
        },
    });

    const [selectedTags, setSelectedTags] = useState<{ id: string; name: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    const onSubmit = async (data: FormData) => {
        setIsLoading(true);
        try {
            const postData = {
                ...data,
                tags: selectedTags.map(tag => tag.id)
            };
            await axios.post('/api/subreddit/post/create', postData);
            toast.success('Post created successfully');
        } catch (error) {
            toast.error('Failed to create post');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTagSelect = (tagId: string) => {
        const tag = tags.find(t => t.id === tagId);
        if (tag && !selectedTags.some(t => t.id === tagId)) {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleTagRemove = (tagId: string) => {
        setSelectedTags(selectedTags.filter(tag => tag.id !== tagId));
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Input {...register('title')} placeholder="Title" defaultValue={title} />
            <Textarea {...register('content')} placeholder="Content" defaultValue={content} />
            <Input {...register('description')} placeholder="Description" defaultValue={description} />
            <Input {...register('thumbnail')} placeholder="Thumbnail URL" defaultValue={thumbnail} />
            
            <Select onValueChange={(value) => setValue('subredditId', value)}>
                <SelectTrigger>
                    <SelectValue placeholder="Select subreddit" />
                </SelectTrigger>
                <SelectContent>
                    {subreddits.map(subreddit => (
                        <SelectItem key={subreddit.id} value={subreddit.id}>
                            {subreddit.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Command className="border rounded-md">
                <CommandInput 
                    placeholder="Search tags..." 
                    isLoading={isSearching}
                    onValueChange={() => setIsSearching(true)}
                    onBlur={() => setIsSearching(false)}
                />
                <CommandEmpty>No tags found.</CommandEmpty>
                <CommandGroup>
                    {tags.map(tag => (
                        <CommandItem
                            key={tag.id}
                            onSelect={() => handleTagSelect(tag.id)}
                        >
                            {tag.name}
                        </CommandItem>
                    ))}
                </CommandGroup>
            </Command>

            <div className="flex flex-wrap gap-2 mt-2">
                {selectedTags.map(tag => (
                    <Badge key={tag.id} variant="secondary">
                        {tag.name}
                        <X
                            className="ml-1 h-3 w-3 cursor-pointer"
                            onClick={() => handleTagRemove(tag.id)}
                        />
                    </Badge>
                ))}
            </div>

            <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Post'}
            </Button>
        </form>
    );
};

export default CreatePost;