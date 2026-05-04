"use client"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar"


import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { 
    ChevronDown, 
    User2, 
    Home, 
    CloudSun, 
    LayoutGrid, 
    Newspaper,
    Settings,
    LogOut,
    UserCheck2,
    UserLock,
    LayoutDashboard
    
} from "lucide-react"

import Link from "next/link"
import { signOut } from "@/components/actions/Logout"
 

// Define navigation items for the sidebar
const mainNavItems = [
    { title: "Home", url: "/", icon: Home },
    { title: "Weather", url: "/Weather", icon: CloudSun },
    {title: "Profile", url: "/Profile", icon: UserLock},
    { title:  "Authors", url: "/LogAuthors",  icon: UserCheck2}
    
]

const categories = [
    "World", "Politics", "Technology", "Sports", "Entertainment"
]

export function AppSidebar({ isAdmin, isAuthor }: { isAdmin?: boolean, isAuthor?: boolean }) {
    const { setOpen, setOpenMobile, isMobile } = useSidebar();

    const closeSidebar = () => {
        if (isMobile) {
            setOpenMobile(false);
        } else {
            setOpen(false);
        }
    };


    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="border-b border-border/50 pb-4">
                <div className="flex items-center justify-between px-2 mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-black">
                            N
                        </div>
                        <span className="font-black text-red-600 tracking-tight group-data-[collapsible=icon]:hidden">
                            NewsHub<span className="text-foreground">.</span>
                        </span>
                    </div>
                    <SidebarTrigger className="text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" />
                </div>
                <SidebarMenu>
                    <SidebarMenuItem>
                        {/* Workspace / App Selector Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className="font-bold bg-muted/50">
                                    Main Workspace
                                    <ChevronDown className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[--radix-popper-anchor-width]" align="start">
                                <DropdownMenuItem>
                                    <span>News Dashboard</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <span>Admin Panel</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>


            <SidebarContent>
                {/* Main Navigation Group */}
                <SidebarGroup>
                    <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {mainNavItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild tooltip={item.title} onClick={closeSidebar}>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>

                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Admin Navigation Group */}
                {isAdmin && (
                    <SidebarGroup>
                        <SidebarGroupLabel>Administration</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild tooltip="Admin Dashboard" onClick={closeSidebar}>
                                        <Link href="/admin/dashboard">
                                            <Settings className="w-4 h-4 text-red-500" />
                                            <span className="font-bold text-red-500">Admin Dashboard</span>
                                        </Link>
                                    </SidebarMenuButton>

                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                )}

                {/* Author Navigation Group */}
                {isAuthor && (

                    <SidebarGroup>
                        <SidebarGroupLabel>Author Portal</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild tooltip="Author Dashboard" onClick={closeSidebar}>
                                        <Link href="/author/dashboard">
                                            <LayoutDashboard className="w-4 h-4 text-blue-500" />
                                            <span className="font-bold text-blue-500">Author Dashboard</span>
                                        </Link>
                                    </SidebarMenuButton>

                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild tooltip="Create New Post" onClick={closeSidebar}>
                                        <Link href="/createpost">
                                            <Newspaper className="w-4 h-4 text-blue-400" />
                                            <span>Create New Post</span>
                                        </Link>
                                    </SidebarMenuButton>

                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                )}


                {/* News Categories Group */}
                <SidebarGroup>
                    <SidebarGroupLabel>Categories</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {categories.map((category) => (
                                <SidebarMenuItem key={category}>
                                    <SidebarMenuButton asChild tooltip={category} onClick={closeSidebar}>
                                        <Link href={`/category/${category.toLowerCase()}`}>
                                            <Newspaper className="h-4 w-4" />
                                            <span>{category}</span>
                                        </Link>
                                    </SidebarMenuButton>

                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <User2 /> 
                                    <span>Guest User</span>
                                    <ChevronDown className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                                <DropdownMenuItem>
                                    <User2 className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                    className="text-red-500 cursor-pointer" 
                                    onSelect={async () => {
                                        await signOut();
                                    }}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Sign Out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
