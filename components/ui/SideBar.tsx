"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Option } from "@/types";

import Logo from "@/components/ui/Logo";

import {
  CircleDollarSign,
  UsersRound,
  FolderKanban,
  Contact,
  Images,
  House,
  Settings,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import withRoleProtection from "@/components/auth/withRoleProtection";

function SideBar() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();
  const { data: session } = useSession();

  const options: Option[] = [
    { title: "Dashboard", icon: House, href: "/dashboard/admin" },
    { title: "Users", icon: UsersRound, href: "/dashboard/admin/users" },
    { title: "Contacts", icon: Contact, href: "/dashboard/admin/contacts" },
    {
      title: "Projects",
      icon: FolderKanban,
      href: "/dashboard/admin/projects",
    },
    {
      title: "Finance",
      icon: CircleDollarSign,
      href: "/dashboard/admin/finance",
    },
    { title: "Media", icon: Images, href: "/dashboard/admin/media" },
  ];

  const handleClick = (): void => {
    setIsOpen((prev: boolean) => !prev);
  };

  return (
    <>
      <div
        className={`sticky top-0 h-screen ${
          isOpen ? "w-fit px-1 md:px-3" : "w-fit px-2 md:px-3 lg:px-5"
        } flex flex-col shrink-0 border-r transition-all duration-300 ease-in-out
      border-border bg-component-bg shadow-sm text-text-dark font-plex`}
      >
        <div
          className={`flex flex-col md:flex-row gap-4 md:gap-0 items-center py-4 md:py-10 ${
            isOpen ? "justify-start px-0" : "justify-center px-0"
          } border-b border-border`}
        >
          <div
            className={`bg-white flex justify-center items-center rounded-xl px-1 ${
              isOpen ? "size-8 md:size-10 mr-4" : "size-5 md:size-8"
            } `}
          >
            <Logo />
          </div>
          {isOpen && (
            <>
              <div className=" flex flex-col ">
                <span className="text-text-light text-sm md:text-lg font-bold">
                  {session?.user?.name}
                </span>
                <span className="text-[10px] md:text-base">Admin</span>
              </div>
            </>
          )}
        </div>
        <div className="flex-1 overflow-y-auto flex flex-col bg-component-bg">
          <div className="px-0 py-4 md:py-10 flex flex-col gap-2 border-b border-border w-fit">
            {options.map((option, index) => (
              <div
                key={index}
                className={`flex ${
                  isOpen ? "justify-start px-2 md:pr-12" : "justify-center px-2"
                } items-center sidebar-link   ${
                  pathname === option.href ? "bg-border text-text-blue" : ""
                }`}
              >
                <Link
                  href={option.href}
                  className="flex justify-center items-center gap-2 text-[14px] md:text-lg"
                >
                  <option.icon className="size-4 md:size-5" />
                  {isOpen && option.title}
                </Link>
              </div>
            ))}
          </div>
          {isOpen && (
            <div className="text-xl py-6 flex flex-col gap-4">
              <span className="text-xs lg:text-xl pl-4">ACCOUNT</span>
              <div className="">
                <div
                  className={`flex ${
                    isOpen ? "justify-start px-2" : "justify-center px-2"
                  } items-center gap-2 py-2 sidebar-link `}
                >
                  <Settings className=" size-4 md:size-5" />
                  {isOpen && (
                    <Link href="/dashboard/admin/settings" className="text-[14px] md:text-lg">
                      Settings
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="mt-auto border-t border-border">
          <button
            onClick={handleClick}
            className={`flex items-center cursor-pointer w-full hover:bg-border focus:border-1 border-0 ${
              isOpen
                ? " gap-6 md:pr-15 pl-2 justify-start"
                : "gap-0 px-0 justify-center"
            } text-xl py-4 `}
          >
            {isOpen ? (
              <>
                <ChevronsLeft className="size-4 md:size-6" />
                <span className="text-sm md:text-lg">Hide</span>
              </>
            ) : (
              <ChevronsRight className="size-6" />
            )}
          </button>
        </div>
      </div>
    </>
  );
}

export default withRoleProtection(SideBar, { allowedRoles: [1] });
