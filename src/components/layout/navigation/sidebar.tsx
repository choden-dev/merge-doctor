import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/shadcn/sidebar.tsx";
import { useSidebarEnabled, useSidebarItems } from "@/hooks/sidebar.tsx";
import { Link, useLocation } from "react-router";

// Menu items.
export const AppSidebar = () => {
	const isEnabled = useSidebarEnabled();
	const items = useSidebarItems();
	const { pathname } = useLocation();
	console.log(pathname);
	if (!isEnabled || !items.length) return null;

	return (
		<Sidebar>
			<SidebarHeader></SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Application</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => {
								const isCurrentRoute = item.url === pathname;
								return (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton
											asChild
											variant={isCurrentRoute ? "outline" : "default"}
										>
											{
												// Don't allow spam clicking, keeps user on same route
											}
											<Link to={isCurrentRoute ? pathname : item.url}>
												<item.icon />
												<span>{item.title}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
};
