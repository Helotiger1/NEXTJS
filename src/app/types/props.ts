import { SidebarItem } from "./utils";

export type BaseLayoutProps = {
    profileURL : string
    children: React.ReactNode;
    sidebarItems: SidebarItem[];
}