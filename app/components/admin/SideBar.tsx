"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import Logo from "@/components/Logo";

import {
  Monitor,
  UsersRound,
  FolderKanban,
  Contact,
  Images,
  House,
  Settings,
  CircleQuestionMark,
} from "lucide-react";

const options = [
  { title: "Dashboard", icon: House, href: "/dashboard/admin" },
  { title: "Users", icon: UsersRound, href: "/dashboard/admin/users" },
  { title: "Projects", icon: FolderKanban, href: "/dashboard/admin/projects" },
  { title: "Sites", icon: Monitor, href: "/dashboard/admin/sites" },
  { title: "Contacts", icon: Contact, href: "/dashboard/admin/contacts" },
  { title: "Media", icon: Images, href: "/dashboard/admin/media" },
];

export default function SideBar() {
  const pathname = usePathname();

  return (
    <>
      <div
        className={`sticky top-0 h-fit w-7/8 shrink-0 border-r transition-all duration-300 ease-in-out
      border-gray-800 bg-gray-900 p-2 shadow-sm text-secondary font-plex`}
      >
        <div className="flex justify-start items-center py-6 pl-8 border-b border-gray-700">
          <div className="bg-white rounded-xl mr-4 p-1">
            <Logo />
          </div>
          <div className=" flex flex-col ">
            <span className="text-text text-xl font-bold">Craig</span>
            <span className="">Admin</span>
          </div>
        </div>
        <div className="text-xl pl-2 py-10 flex flex-col gap-4 border-b border-gray-700">
          {options.map((option, index) => (
            <div
              key={index}
              className={`flex items-center sidebar-link ${
                pathname === option.href ? "bg-gray-800 text-blue-400" : ""
              }`}
            >
              <option.icon className="mr-3 h-5 w-5" />
              <Link href={option.href}>{option.title}</Link>
            </div>
          ))}
        </div>
        <div className="text-xl py-10 flex flex-col gap-8 pl-2">
          <span className="">ACCOUNT</span>
          <div className="flex flex-col gap-4 ">
            <div className="flex justify-start items-center gap-4 py-2 sidebar-link">
              <Settings className="mr-3 h-5 w-5"/>
              <Link href="/dashboard/admin/settings">Settings</Link>
            </div>
            <div className="flex justify-start items-center gap-4 py-2 sidebar-link">
              <CircleQuestionMark className="mr-3 h-5 w-5"/>
              <Link href="/dashboard/admin/help">Help & Support</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
