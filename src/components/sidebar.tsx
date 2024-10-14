'use client';

import React from 'react'
import { HomeIcon, LibraryIcon, Package2 } from 'lucide-react'
import { useSelectedLayoutSegments } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import Link from 'next/link';
import Layout from './layout';
import SingularityPlaygroundLogo from "../assets/singularity_playground_logo.png";
import Image from 'next/image';


const Sidebar = ({ children }: { children: React.ReactNode }) => {
    const segments = useSelectedLayoutSegments();
    const navLinks = [
        {
            icon: HomeIcon,
            href: '/',
            active: segments.length === 0 || segments.includes('c'),
            label: 'Home',
            tooltip: 'Home'
        },
        {   
            icon: LibraryIcon,
            href: '/library',
            active: segments.includes('library'),
            label: 'Library',
            tooltip: 'Library'
        },
    ];

  return (
    <div>
           <aside className="fixed inset-y-0 left-0 z-10 hidden w-16 flex-col bg-custom-bg-1 sm:flex">
           <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                  <Link
                      href="#"
                      className="group flex h-14 w-14 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary text-lg font-semibold text-primary-foreground md:h-10 md:w-10 md:text-base"
                  >
                      <Image src={SingularityPlaygroundLogo} alt="logo of singularity playground"/>
                      <span className="sr-only">Acme Inc</span>
                  </Link>
                  </nav>
              <nav>
                  <TooltipProvider>
                      {navLinks.map(({ icon: Icon, href, label, tooltip, active }, index) => (
                          <div className="mt-4 flex flex-col items-center" key={index}>
                              <Tooltip>
                                  <TooltipTrigger asChild>
                                      <Link
                                          href={href}
                                          className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-10 md:w-10 ${active ? "bg-icon-bg text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent hover:bg-opacity-20"
                                              }`}
                                      >
                                          <Icon className={`h-6 w-6 ${active ? "text-primary" : ""}`} />
                                          <span className="sr-only">{label}</span>
                                      </Link>
                                  </TooltipTrigger>
                                  <TooltipContent side="right">{tooltip}</TooltipContent>
                              </Tooltip>
                          </div>
                      ))}
                  </TooltipProvider>
              </nav>
          </aside>
          <Layout>{children}</Layout>
    </div>
  );
};

export default Sidebar
