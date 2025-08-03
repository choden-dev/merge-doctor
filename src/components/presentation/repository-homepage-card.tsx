import {
	Card,
	CardAction,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/shadcn/card.tsx";

interface RepositoryHomepageCardProps {
	name: string;
	caption: string;
	handleSelect?: () => void;
	handleDelete?: () => void;
}
export const RepositoryHomepageCard = ({
	name,
	caption,
	handleSelect,
	handleDelete,
}: RepositoryHomepageCardProps) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="cursor-pointer" onClick={handleSelect}>
					{name}
				</CardTitle>
				<CardDescription>{caption}</CardDescription>
				<CardAction className="cursor-pointer" onClick={handleDelete}>
					Remove
				</CardAction>
			</CardHeader>
			<CardFooter>
				<CardAction className="cursor-pointer" onClick={handleSelect}>
					Open
				</CardAction>
			</CardFooter>
		</Card>
	);
};
