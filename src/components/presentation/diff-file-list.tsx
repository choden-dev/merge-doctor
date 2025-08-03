import { TooltipProvider } from "@radix-ui/react-tooltip";
import type { FileData } from "react-diff-view";
import { shortenDirectoryPath } from "@/components/presentation/utils.ts";
import { Button } from "@/components/shadcn/button.tsx";
import { DataStatePropInterceptor } from "@/components/shadcn/data-state-interpreter.tsx";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/shadcn/tooltip.tsx";

interface FileListItemProps extends FileData {
	onClick?: () => void;
	tooltip?: string;
	selected?: boolean;
}
export const FileListItem = ({
	newPath,
	onClick,
	type,
	tooltip,
	selected = false,
}: FileListItemProps) => {
	return (
		<TooltipProvider key={newPath}>
			<Tooltip>
				<TooltipTrigger>
					<DataStatePropInterceptor>
						<Button
							variant={selected ? "default" : "outline"}
							className="justify-start text-xs w-full"
							onClick={onClick}
						>
							{newPath} - {type}
						</Button>
					</DataStatePropInterceptor>
				</TooltipTrigger>
				<TooltipContent>{tooltip}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export interface FileListProps {
	files: FileData[];
	onClick?: (fileData: FileData) => void;
	isLongPath?: boolean;
	selectedFiles?: string[];
}
export const FileList = ({
	files,
	onClick,
	isLongPath = false,
	selectedFiles = [],
}: FileListProps) => {
	return (
		<>
			{files.map((file) => (
				<FileListItem
					key={file.newPath}
					{...file}
					newPath={
						!isLongPath ? shortenDirectoryPath(file.newPath) : file.newPath
					}
					// TODO: make this consistent with all other id checks
					selected={selectedFiles?.includes(file.newPath)}
					tooltip={file.newPath}
					onClick={() => {
						onClick?.(file);
					}}
				/>
			))}
		</>
	);
};
