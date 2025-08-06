import { useMemo, useState } from "react";
import type { FileData } from "react-diff-view";
import {
	createFileTree,
	FileActionIcon,
	FileTreeItem,
	type TreeNode,
} from "@/components/presentation/diff/file-tree.tsx";
import { shortenDirectoryPath } from "@/components/presentation/utils.ts";
import { Button } from "@/components/shadcn/button.tsx";
import { ScrollArea, ScrollBar } from "@/components/shadcn/scroll-area.tsx";
import { cn } from "@/lib/utils.ts";

export interface FileListProps {
	files: FileData[];
	onClick?: (fileData: FileData) => void;
	isLongPath?: boolean;
	selectedFiles?: string[];
	groupByPath?: boolean;
	initialExpandedDirs?: string[];
	className?: string;
}
export const FileList = ({
	files,
	onClick,
	isLongPath = false,
	selectedFiles = [],
	groupByPath = false,
	initialExpandedDirs = [],
	className,
}: FileListProps) => {
	const [expandedDirs, setExpandedDirs] = useState<Set<string>>(
		new Set(initialExpandedDirs),
	);
	const fileTree = useMemo(() => createFileTree(files), [files]);
	const handleToggleExpand = (path: string) => {
		setExpandedDirs((prev) => {
			const next = new Set(prev);
			if (next.has(path)) {
				next.delete(path);
			} else {
				next.add(path);
			}
			return next;
		});
	};
	const handleExpandAll = () => {
		const allPaths = new Set<string>();
		const collectPaths = (node: TreeNode) => {
			if (node.path !== undefined) allPaths.add(node.path);
			Object.values(node.children).forEach(collectPaths);
		};
		collectPaths(fileTree);
		setExpandedDirs(allPaths);
	};
	const handleCollapseAll = () => {
		setExpandedDirs(new Set());
	};
	if (!groupByPath) {
		return (
			<ScrollArea className={cn("h-full w-full rounded-md border", className)}>
				<div className="p-2 space-y-1">
					{files.map((file) => (
						<Button
							key={file.newPath}
							variant="ghost"
							className={cn(
								"w-full justify-start gap-2 h-8 font-normal hover:bg-muted/50",
								selectedFiles?.includes(file.newPath) && "bg-foreground",
							)}
							onClick={() => onClick?.(file)}
						>
							<FileActionIcon type={file.type} />
							<span className="truncate">
								{!isLongPath
									? shortenDirectoryPath(file.newPath)
									: file.newPath}
							</span>
						</Button>
					))}
				</div>
			</ScrollArea>
		);
	}
	return (
		<ScrollArea className={cn("h-full w-full rounded-md border", className)}>
			<div className="p-2 space-y-1">
				<div className="flex gap-2 absolute top-2">
					<Button variant="outline" size="sm" onClick={handleExpandAll}>
						Expand All
					</Button>
					<Button variant="outline" size="sm" onClick={handleCollapseAll}>
						Collapse All
					</Button>
				</div>
				<FileTreeItem
					node={fileTree}
					onClick={onClick}
					selectedFiles={selectedFiles}
					isLongPath={false}
					expanded={expandedDirs}
					onToggleExpand={handleToggleExpand}
				/>
			</div>
			<ScrollBar orientation="horizontal" />
			<ScrollBar orientation="vertical" />
		</ScrollArea>
	);
};
