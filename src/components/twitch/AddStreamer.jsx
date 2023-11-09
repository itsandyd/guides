import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

// Define the form schema
const formSchema = z.object({
  channelName: z.string().min(2, {
    message: "Channel name must be at least 2 characters.",
  }),
});

export function ChannelForm() {
  // Define your form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      channelName: "",
    },
  });

  const router = useRouter();
  // Define a submit handler
  const onSubmit = async (values) => {
    try {
      const response = await axios.post("/api/twitch/add", values);

      if (response.status === 200) {
        console.log("Streamer added successfully");
        // router.push("/twitch");
        router.refresh; // Redirect to /twitch
      } else {
        console.error("Error adding streamer");
      }
    } catch (error) {
      // Handle error
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="channelName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Channel Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your channel name"
                  {...field}
                  className="mb-4"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="mt-2">
          Submit
        </Button>{" "}
      </form>
    </Form>
  );
  // };
}
