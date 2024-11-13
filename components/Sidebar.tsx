"use client";

import { avatarUrl, navItems } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {
  avatar: string;
  fullName: string;
  email: string;
};

const Sidebar = ({ avatar, fullName, email }: Props) => {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <Link href={"/"} className="flex gap-4 items-center">
        <Image
          src={"/assets/images/vector-logo.png"}
          alt="logo"
          width={50}
          height={50}
        />
        <h2 className="text-2xl font-semibold text-brand-100 hidden lg:block">
          FileKeeper
        </h2>
      </Link>

      <nav className="sidebar-nav">
        <ul className="flex flex-1 flex-col gap-6">
          {navItems.map((item) => {
            const active = pathname === item.url;

            return (
              <Link key={item.name} href={item.url} className="lg:w-full">
                <li className={cn("sidebar-nav-item", active && "shad-active")}>
                  <Image
                    src={item.icon}
                    alt="icon"
                    width={24}
                    height={24}
                    className={cn("nav-icon", active && "nav-icon-active")}
                  />
                  <p className="hidden lg:block">{item.name}</p>
                </li>
              </Link>
            );
          })}
        </ul>
      </nav>

      <Image
        src={"/assets/images/files-2.png"}
        alt="logo"
        width={506}
        height={418}
        className="w-full"
      />

      <div className="sidebar-user-info">
        <Image
          src={avatar}
          alt="avatar"
          width={44}
          height={44}
          className="sidebar-user-avatar"
        />
        <div className="hidden lg:block">
          <p className="subtitle-2 capitalize">{fullName}</p>
          <p className="caption">{email}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
