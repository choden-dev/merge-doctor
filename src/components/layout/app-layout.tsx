import { Outlet } from "react-router";
import { AppSidebar } from "@/components/layout/navigation/sidebar.tsx";
import { AppTopBar } from "@/components/layout/navigation/topbar.tsx";
import { SidebarProvider } from "@/components/shadcn/sidebar.tsx";

export const AppLayout = () => {
	return (
		<SidebarProvider>
			<AppSidebar />
			<main className="w-full">
				<AppTopBar />
				<div className="flex flex-col py-4 px-10 w-full">
					<Outlet />
				</div>
			</main>
		</SidebarProvider>
	);
};
