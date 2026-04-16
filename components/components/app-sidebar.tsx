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
    UserCheck2
} from "lucide-react"
import Link from "next/link"
import { signOut } from "@/components/components/actions/Logout"
import { Button } from "../ui/button"

// Define navigation items for the sidebar
const mainNavItems = [
    { title: "Home", url: "/", icon: Home },
    { title: "Weather", url: "/Weather", icon: CloudSun },
    { title: "Authentication", url: "/auth/login", icon: User2 },
    { title:  "Authors", url: "/auth/LogAuthors",  icon: UserCheck2}
    
]

const categories = [
    "World", "Politics", "Technology", "Sports", "Entertainment"
]

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        {/* Workspace / App Selector Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className="font-bold">
                                    NewsHub App
                                    <ChevronDown className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                                <DropdownMenuItem>
                                    <span>Main Dashboard</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <span>Settings</span>
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
                                    <SidebarMenuButton asChild tooltip={item.title}>
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

                {/* News Categories Group */}
                <SidebarGroup>
                    <SidebarGroupLabel>Categories</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {categories.map((category) => (
                                <SidebarMenuItem key={category}>
                                    <SidebarMenuButton asChild tooltip={category}>
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

            <SidebarFooter>
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
                                <DropdownMenuItem className="text-red-500" asChild>
                                    <form action={signOut}>
                                        <Button variant={"link"} type="submit" className="w-full justify-start text-red-500 px-0">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Sign Out</span>
                                        </Button>
                                    </form>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
