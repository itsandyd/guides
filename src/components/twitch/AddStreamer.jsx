import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

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

  // Define a submit handler
  const onSubmit = (values) => {
    // Do something with the form values
    console.log(values);
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
        {/* Add margin-top */}
      </form>
    </Form>
  );
}
