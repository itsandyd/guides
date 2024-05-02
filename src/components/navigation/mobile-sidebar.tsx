"use client";

import Link from "next/link";
import Image from "next/image";
import { Montserrat } from 'next/font/google'
import { BookIcon, Code, ComputerIcon, ImageIcon, LayoutDashboard, MessageSquare, Music, Settings, UserIcon, VideoIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const poppins = Montserrat ({ weight: '600', subsets: ['latin'] });

const routes = [
    {
      label: 'Sounds',
      icon: Music, // Example icon, replace with actual icons as needed
      href: 'https://sounds.pauseplayrepeat.com',
    },
    {
      label: 'AI',
      icon: ComputerIcon, // Example icon
      href: '/ai/dashboard',
    },
  ];

export const LandingMobileSidebar = ({
}) => {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full">
      <div className="px-3 py-2 flex-1">
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href} 
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-black hover:bg-white/10 rounded-lg transition",
                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400",
              )}
            >
              <div className="flex items-center flex-1">
                {/* <route.icon className={cn("h-5 w-5 mr-3", route.color)} /> */}
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};