import React, { ReactNode } from "react";

export type SidebarConfig = {
    profileURL : string
    SidebarItems : SidebarItem[]
}
export type SidebarItem = {
    href: string;
    icon: ReactNode | string; 
    label: string;
};
