"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { ListVideo, Loader, Settings2 } from "lucide-react"
import { SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"


import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"


import { Button } from "../ui/Button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Input } from "../ui/Input"
import { Badge } from "../ui/badge"
import { handleInitialFormSubmit } from "@/actions/actions"

export const formSchema = z.object({
    link: z.string().describe("The YouTube Video you would like to summarize."),
    model: z.enum([
        "gpt-3.5-turbo",
        "gemma-7b-it",
        "gpt-4o",
        "llama3-70b-8192",
        "mixtral-8x7b-32768",
    ]),
})

export const InitialForm = () => {
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            link: "",
            model: "gpt-4o",
        },
    })

    const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (data) => {
        const result = await handleInitialFormSubmit(data)
        if (result) {
            toast.success("Video summarized successfully!")
            router.push("/guidecraft")
        } else {
            toast.error("Failed to summarize video.")
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-[#1a1a1a] p-6 rounded-lg shadow-md">
                <FormField
                    control={form.control}
                    name="link"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="YouTube Video Link" {...field} className="bg-gray-800 text-white" />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                        <FormItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button className="w-full bg-indigo-500 text-white">{field.value}</Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-gray-800 text-white">
                                    <DropdownMenuLabel>Model</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuRadioGroup value={field.value} onValueChange={field.onChange}>
                                        <DropdownMenuRadioItem value="gpt-3.5-turbo">gpt-3.5-turbo</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="gemma-7b-it">gemma-7b-it</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="gpt-4o">gpt-4o</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="llama3-70b-8192">llama3-70b-8192</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="mixtral-8x7b-32768">mixtral-8x7b-32768</DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </FormItem>
                    )}
                />
                <Button
                    disabled={form.formState.isSubmitting}
                    className="group w-full md:max-w-fit bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                    type="submit"
                >
                    {form.formState.isSubmitting ? (
                        <Loader className="size-4 animate-spin duration-1000" />
                    ) : (
                        <>
                            Summarize
                            <ListVideo className="ml-2 size-4 transition-all duration-200 group-hover:ml-4" />
                        </>
                    )}
                </Button>
            </form>
        </Form>
    )
}
