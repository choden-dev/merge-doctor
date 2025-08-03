import { ChevronDownIcon } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { Button } from "@/components/shadcn/button.tsx";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
} from "@/components/shadcn/navigation-menu.tsx";
import { SidebarTrigger } from "@/components/shadcn/sidebar.tsx";
import { VALID_ROUTES } from "@/constants/routes.ts";
import { useSidebarEnabled } from "@/hooks/sidebar.tsx";

export const AppTopBar = () => {
	const navigate = useNavigate();
	const isSidebarEnabled = useSidebarEnabled();
	const { id } = useParams();

	return (
		<NavigationMenu className="py-4 gap-4 border-b border-b-sidebar-border">
			<SidebarTrigger disabled={!isSidebarEnabled} />
			<NavigationMenuList className="gap-3">
				<NavigationMenuItem>
					<h1 className="text-nowrap font-bold text-xl">
						<Link to="/">Merge Doctor</Link>
					</h1>
				</NavigationMenuItem>
				<Button variant="outline" size="sm" disabled>
					{id ?? "No repository selected"}
					<ChevronDownIcon />
				</Button>
				<Button onClick={() => navigate(VALID_ROUTES.ADD_REPO_ROUTE)} size="sm">
					Add Repo
				</Button>
			</NavigationMenuList>
		</NavigationMenu>
	);
};
