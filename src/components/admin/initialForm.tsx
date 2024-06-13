"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { ListVideo, Loader, Settings2, Wand2 } from "lucide-react"
import { useForm } from "react-hook-form"
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
        // "gpt-3.5-turbo",
        // "gemma-7b-it",
        "gpt-4o",
        // "llama3-70b-8192",
        // "mixtral-8x7b-32768",
    ]),
})

export const InitialForm = () => {
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            model: "gpt-4o",
        },
    })

    return (
        <Form {...form}>
            <form
                className="flex w-full flex-col items-start gap-2 md:flex-row"
                onSubmit={form.handleSubmit(async (data) => {
                    toast.info("Processing your request...");
                    await handleInitialFormSubmit(data).then(
                        (value: string | null) => {
                            if (value) {
                                toast.info("Redirecting...");
                                router.push(`/admin/create/${value}`);
                            } else {
                                toast.error("An Error Occurred while Generating the Summary.");
                                router.refresh();
                            }
                        }
                    ).catch(error => {
                        console.error("Submission Error:", error);
                        toast.error("Failed to process your request. Please try again.");
                    });
                })}
            >
                <div className="flex w-full gap-2 md:max-w-2xl">
                    <FormField
                        disabled={form.formState.isSubmitting}
                        control={form.control}
                        name="link"
                        render={({ field }) => (
                            <FormItem className="w-full text-black">
                                <FormControl>
                                    <Input
                                        placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* <FormField
                        disabled={form.formState.isSubmitting}
                        control={form.control}
                        name="model"
                        render={({ field }) => (
                            <FormItem>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            disabled={
                                                form.formState.isSubmitting
                                            }
                                            className="group"
                                            variant="secondary"
                                            size={"icon"}
                                        >
                                            <Settings2 className="size-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-full">
                                        <DropdownMenuLabel>
                                            Choose your AI Model
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuRadioGroup
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <DropdownMenuRadioItem value="gpt-3.5-turbo">
                                                gpt-3.5-turbo
                                            </DropdownMenuRadioItem>

                                            <DropdownMenuRadioItem value="gpt-4o">
                                                gpt-4o
                                            </DropdownMenuRadioItem>

                                            <DropdownMenuRadioItem value="llama3-70b-8192">
                                                llama3-70b
                                                <Badge
                                                    className="ml-2 text-xs"
                                                    variant={"secondary"}
                                                >
                                                    Experimental
                                                </Badge>
                                            </DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="mixtral-8x7b-32768">
                                                mixtral-8x7b
                                                <Badge
                                                    className="ml-2 text-xs"
                                                    variant={"secondary"}
                                                >
                                                    Experimental
                                                </Badge>
                                            </DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="gemma-7b-it">
                                                gemma-7b-it
                                                <Badge
                                                    className="ml-2 text-xs"
                                                    variant={"secondary"}
                                                >
                                                    Experimental
                                                </Badge>
                                            </DropdownMenuRadioItem>
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </FormItem>
                        )}
                    /> */}
                </div>

                <Button
                    disabled={form.formState.isSubmitting}
                    className="group w-full md:max-w-fit"
                    type="submit"
                >
                    {form.formState.isSubmitting ? (
                        <>
                            <Loader className="size-4 animate-spin duration-1000" />
                        </>
                    ) : (
                        <>
                            Craft
                            <Wand2 className="ml-2 size-4 transition-all duration-200 group-hover:ml-4" />
                        </>
                    )}
                </Button>
            </form>
        </Form>
    )
}
