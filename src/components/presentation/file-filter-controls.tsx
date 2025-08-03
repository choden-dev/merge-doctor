import { FilterIcon } from "lucide-react";
import type { FileData } from "react-diff-view";
import { Button } from "@/components/shadcn/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { Input } from "@/components/shadcn/input";
import { cn } from "@/lib/utils.ts";

export interface FileFilterControlsProps {
	searchQuery: string;
	onSearchChange: (query: string) => void;
	filterTypes: {
		add: (type: FileData["type"]) => void;
		remove: (type: FileData["type"]) => void;
		has: (type: FileData["type"]) => boolean;
	};
	availableTypes?: FileData["type"][];
	className?: string;
	searchPlaceholder?: string;
	filterLabel?: string;
}

const DEFAULT_FILTER_TYPES: FileData["type"][] = [
	"add",
	"copy",
	"rename",
	"delete",
	"modify",
];

export function FileFilterControls({
	searchQuery,
	onSearchChange,
	filterTypes: { add, remove, has },
	availableTypes = DEFAULT_FILTER_TYPES,
	className,
	searchPlaceholder = "Search for file",
	filterLabel = "Change Types",
}: FileFilterControlsProps) {
	return (
		<div className={cn("flex gap-2", className)}>
			<Input
				value={searchQuery}
				onChange={(e) => onSearchChange(e.currentTarget.value)}
				placeholder={searchPlaceholder}
				className="w-fit"
			/>
			<DropdownMenu>
				<DropdownMenuTrigger>
					<Button>
						<FilterIcon />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56">
					<DropdownMenuLabel>{filterLabel}</DropdownMenuLabel>
					<DropdownMenuSeparator />
					{availableTypes.map((type) => (
						<DropdownMenuCheckboxItem
							key={type}
							checked={has(type)}
							onCheckedChange={() => {
								if (has(type)) {
									remove(type);
								} else {
									add(type);
								}
							}}
						>
							{type}
						</DropdownMenuCheckboxItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
