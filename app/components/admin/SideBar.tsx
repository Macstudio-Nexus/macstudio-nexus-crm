"use client";

import React, { useState, useEffect } from "react";
import Provider from "@/components/provider";
import { useSession } from "next-auth/react";
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
  ChevronsLeft,
  ChevronsRight,
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
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();
  const { data: session } = useSession();

  interface Option {
    title: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    href: string;
  }

  const options: Option[] = [
    { title: "Dashboard", icon: House, href: "/dashboard/admin" },
    { title: "Users", icon: UsersRound, href: "/dashboard/admin/users" },
    {
      title: "Projects",
      icon: FolderKanban,
      href: "/dashboard/admin/projects",
    },
    { title: "Sites", icon: Monitor, href: "/dashboard/admin/sites" },
    { title: "Contacts", icon: Contact, href: "/dashboard/admin/contacts" },
    { title: "Media", icon: Images, href: "/dashboard/admin/media" },
  ];

  const handleClick = (): void => {
    setIsOpen((prev: boolean) => !prev);
  };

  return (
    <>
      <div
        className={`sticky top-0 min-h-screen ${isOpen ? "w-full px-3 " : "w-fit px-2 md:px-3 lg:px-5"} flex flex-col shrink-0 border-r transition-all duration-300 ease-in-out
      border-gray-800 bg-gray-900 shadow-sm text-secondary font-plex`}
      >
        <div
          className={`flex items-center py-6 md:py-10 ${isOpen ? "justify-start px-4" : "justify-center px-0"} border-b border-gray-700`}
        >
          <div
            className={`bg-white flex justify-center items-center rounded-xl  p-1 ${isOpen ? "size-20 mr-4" : "size-10"} `}
          >
            <Logo />
          </div>
          {isOpen && (
            <>
              <div className=" flex flex-col ">
                <span className="text-text text-xl lg:text-2xl font-bold">
                  {session?.user?.name}
                </span>
                <span className="lg:text-lg">Admin</span>
              </div>
            </>
          )}
        </div>
        <div className=" px-0 py-10 flex flex-col gap-4 border-b border-gray-700">
          {options.map((option, index) => (
            <div
              key={index}
              className={`flex ${isOpen ? "justify-start px-6" : "justify-center px-2"} items-center sidebar-link   ${
                pathname === option.href ? "bg-gray-800 text-blue-400" : ""
              }`}
            >
              <Link
                href={option.href}
                className="flex justify-center items-center gap-4"
              >
                <option.icon className="size-5 lg:size-7" />
                {isOpen && option.title}
              </Link>
            </div>
          ))}
        </div>
        {isOpen && (
          <div className="text-xl py-10 flex flex-col gap-8">
            <span className="lg:text-2xl pl-4">ACCOUNT</span>
            <div className="flex flex-col gap-4">
              <div className={`flex ${isOpen ? "justify-start px-6" : "justify-center px-2"} items-center gap-4 py-2 sidebar-link `}>
                <Settings className="mr-3 size-5 lg:size-7" />
                {isOpen && (
                  <Link href="/dashboard/admin/settings">Settings</Link>
                )}
              </div>
              <div className={`flex ${isOpen ? "justify-start px-6" : "justify-center px-2"} items-center gap-4 py-2 sidebar-link `}>
                <CircleQuestionMark className="mr-3 size-5 lg:size-7" />
                {isOpen && (
                  <Link href="/dashboard/admin/help">Help & Support</Link>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="mt-auto border-t border-gray-700">
          <button
            onClick={handleClick}
            className={`flex items-center cursor-pointer w-full hover:bg-gray-700 focus:border-1 border-0 ${isOpen ? " gap-6 pr-15 pl-2 justify-start" : "gap-0 px-0 justify-center"} text-xl py-4 `}
          >
            {isOpen ? (
              <>
                <ChevronsLeft className="size-10" />
                <span
                  className=""
                >
                  Hide
                </span>
              </>
            ) : (
              <ChevronsRight className="size-10" />
            )}
          </button>
        </div>
      </div>
    </>
  );
}
