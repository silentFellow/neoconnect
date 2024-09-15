'use client';

import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignOutButton, useUser } from '@clerk/nextjs';

const Leftsidebar = () => {
  const user = useUser();
  const pathName = usePathname();

  return (
    <section className="leftsidebar custom-scrollbar">
      <div className="flex w-full flex-col gap-6 px-6">
        {sidebarLinks.map((link) => {
          const isActive = (pathName.includes(link.route) && link.route.length > 1) || pathName === link.route;
          const route = link.route === "/profile" ? `/profile/${user?.user?.id}` : link.route

          return (
            <Link
              href={route}
              key={link.label}
              className={`leftsidebar_link ${isActive && "bg-primary-500 "}`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                height={24}
                width={24}
              />
              <p className="text-light-1 max-lg:hidden">{link.label}</p>
            </Link>
          )
        })}
      </div>

      <div className="mt-10 px-6">
        <SignedIn>
          <SignOutButton redirectUrl="/sign-in">
            <div className="flex cursor-pointer gap-4 p-4">
              <Image
                src="/assets/logout.svg"
                alt="logout"
                height={24}
                width={24}
              />

              <p className="text-light-2 max-lg:hidden">Logout</p>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </section>
  )
}

export default Leftsidebar;
