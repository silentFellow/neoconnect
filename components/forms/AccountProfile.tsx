'use client'

import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userValidation } from "@/lib/validations";
import {  z } from "zod";
import Image from "next/image";

import { useUploadThing } from "@/lib/uploadthing";
import { isBase64Image } from "@/lib/utils";
import { updateUser } from "@/lib/actions/user.action";

interface Props {
  user: {
    id: string;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  }
  btnTitle: string;
}

const AccountProfile = ({ user, btnTitle }: Props) => {
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("media");
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(userValidation),
    defaultValues: {
      profile_photo: user?.image || "",
      name: user?.name || "",
      username: user?.username || "",
      bio: user?.bio || ""
    }
  })

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
    e.preventDefault();

    const fileReader = new FileReader();

    if(e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));

      if(!file.type.includes("image")) return;

      fileReader.onload = async (event) => {
        const imageUrl = event.target?.result?.toString() || '';
        fieldChange(imageUrl)
      }

      fileReader.readAsDataURL(file);
    }
  }

  const onSubmit = async (values: z.infer<typeof userValidation>) => {
    const blob = values.profile_photo;

    const hasChanged = isBase64Image(blob);

    if(hasChanged) {
      const imageRes = await startUpload(files)
      console.log(imageRes)
      if(imageRes && imageRes[0].fileUrl) {
        values.profile_photo = imageRes[0].fileUrl
      }
    }

    await updateUser({
      userId: user.id,
      username: values.username,
      name: values.name,
      bio: values.bio,
      image: values.profile_photo,
      path: pathname
    });

    if(pathname === "/profile/edit") router.back();
    else router.push("/")
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-start gap-10"
      >
        <FormField
          control={form.control}
          name="profile_photo"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="account-form_image-label relative">
                {field.value ? (
                  <Image
                    src={field.value}
                    alt="profile photo"
                    priority
                    className="rounded-full object-cover"
                    fill
                    // height={96}
                    // width={96}
                  />
                ) : (
                  <Image
                    src="/assets/profile.svg"
                    alt="profile photo"
                    height={24}
                    width={24}
                    className="object-contain"
                  />
                )}
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input
                  type="file"
                  accept="image/*"
                  placeholder="upload profile picture"
                  className='account-form_image-input'
                  onChange={(e) => handleImageChange(e, field.onChange)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">Username</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter your username..."
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">Name</FormLabel>
              <FormControl className="flex-1 text-gray-200 text-base-semibold">
                <Input
                  type="text"
                  placeholder="Enter your name..."
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">Bio</FormLabel>
              <FormControl className="flex-1 text-gray-200 text-base-semibold">
                <Textarea
                  rows={9}
                  placeholder="Enter your bio..."
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        <Button type="submit" className="bg-primary-500">{btnTitle}</Button>
      </form>
    </Form>
  )
}

export default AccountProfile;
