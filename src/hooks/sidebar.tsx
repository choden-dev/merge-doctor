import { useLocation, useParams } from "react-router";
import { ROUTES_WITH_SIDEBAR, VALID_ROUTES } from "@/constants/routes.ts";
import {
	FlaskConicalIcon,
	InfoIcon,
	ListIcon,
	type LucideProps,
	SparkleIcon,
} from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

export const useSidebarEnabled = () => {
	const { pathname } = useLocation();

	return ROUTES_WITH_SIDEBAR.some((route) => pathname.includes(route));
};

interface SidebarItem {
	title: string;
	url: string;
	icon: ForwardRefExoticComponent<
		Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
	>;
}
export const useSidebarItems = (): SidebarItem[] => {
	const isEnabled = useSidebarEnabled();
	const { pathname } = useLocation();
	const { id } = useParams();
	const isRepoPage = pathname.includes(VALID_ROUTES.REMOTE_REPOSITORY_ROUTE);

	if (!isEnabled) return [];

	if (isRepoPage)
		return [
			{
				title: "Merge Preview",
				url: VALID_ROUTES.REMOTE_REPOSITORY_ROUTE + `/${id}`,
				icon: ListIcon,
			},
			{
				title: "Type Check",
				url: `${VALID_ROUTES.REMOTE_REPOSITORY_ROUTE}/${id}/type-check`,
				icon: InfoIcon,
			},
			{
				title: "Formatting",
				url: `${VALID_ROUTES.REMOTE_REPOSITORY_ROUTE}/${id}/format`,
				icon: SparkleIcon,
			},
			{
				title: "Test",
				url: `${VALID_ROUTES.REMOTE_REPOSITORY_ROUTE}/${id}/tests`,
				icon: FlaskConicalIcon,
			},
		];

	return [];
};
