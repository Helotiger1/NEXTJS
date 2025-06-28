import { SidebarItem } from "./utils";
export type BaseLayoutProps = {
    children: React.ReactNode;
    sidebarItems: SidebarItem[];
    footerContent?: React.ReactNode;
}