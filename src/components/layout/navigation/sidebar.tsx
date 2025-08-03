import { Link, useLocation } from "react-router";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/shadcn/sidebar.tsx";
import { useSidebarEnabled, useSidebarItems } from "@/hooks/sidebar.tsx";

// Menu items.
export const AppSidebar = () => {
	const isEnabled = useSidebarEnabled();
	const items = useSidebarItems();
	const { pathname } = useLocation();
	console.log(pathname);
	if (!isEnabled || !items.length) return null;

	return (
		<Sidebar>
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
