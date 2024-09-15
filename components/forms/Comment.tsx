'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {  z } from "zod";
import { usePathname } from "next/navigation";
import { commentValidation } from '@/lib/validations'
import { addComment } from '@/lib/actions/thread.action'
import Image from "next/image";

interface Props {
  threadId: string,
  currentUserImg: string,
  currentUserId: string
}

const Comment = ({ threadId, currentUserId, currentUserImg }: Props) => {
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(commentValidation),
    defaultValues: {
      thread: "",
    }
  })

  const onSubmit = async (values: z.infer<typeof commentValidation>) => {
    await addComment({
      threadId,
      currentUserId,
      text: values.thread,
      path: pathname
    })

    form.reset();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="comment-form"
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex items-center gap-3 w-full">
              <FormLabel className="h-12 w-12 relative">
                <Image
                  src={currentUserImg}
                  alt="profile image"
                  fill
                  className="rounded-full object-cover"
                />
              </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Input
                  type="text"
                  placeholder="Enter Content..."
                  className="no-focus text-light-1 outline-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="comment_form-btn">Reply</Button>
      </form>
    </Form>
  )
}

export default Comment;
