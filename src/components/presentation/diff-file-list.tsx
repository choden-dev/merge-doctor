import {
	ChevronDown,
	ChevronRight,
	Copy,
	FileSymlink,
	Folder,
	Pencil,
	Plus,
	Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { FileData } from "react-diff-view";
import { shortenDirectoryPath } from "@/components/presentation/utils.ts";
import { Button } from "@/components/shadcn/button.tsx";
import { ScrollArea } from "@/components/shadcn/scroll-area.tsx";
import { cn } from "@/lib/utils.ts";

interface TreeNode {
	name: string;
	path: string;
	children: Record<string, TreeNode>;
	files: FileData[];
	isDirectory: true;
}
export interface FileListProps {
	files: FileData[];
	onClick?: (fileData: FileData) => void;
	isLongPath?: boolean;
	selectedFiles?: string[];
	groupByPath?: boolean;
	initialExpandedDirs?: string[];
	className?: string;
}
export const FileActionIcon = ({
	type,
	className,
	size = 16,
}: {
	type: FileData["type"];
	className?: string;
	size?: number;
}) => {
	const baseClass = cn(className, {
		"text-green-500": type === "add",
		"text-red-500": type === "delete",
		"text-yellow-500": type === "modify",
		"text-blue-500": type === "rename",
		"text-purple-500": type === "copy",
	});
	switch (type) {
		case "add":
			return <Plus className={baseClass} size={size} />;
		case "delete":
			return <Trash2 className={baseClass} size={size} />;
		case "modify":
			return <Pencil className={baseClass} size={size} />;
		case "rename":
			return <FileSymlink className={baseClass} size={size} />;
		case "copy":
			return <Copy className={baseClass} size={size} />;
	}
};

const createFileTree = (files: FileData[]): TreeNode => {
	const root: TreeNode = {
		name: "",
		path: "",
		children: {},
		files: [],
		isDirectory: true,
	};
	files.forEach((file) => {
		const pathParts = file.newPath.split("/");
		let currentNode = root;
		pathParts.slice(0, -1).forEach((part) => {
			if (!currentNode.children[part]) {
				currentNode.children[part] = {
					name: part,
					path: currentNode.path ? `${currentNode.path}/${part}` : part,
					children: {},
					files: [],
					isDirectory: true,
				};
			}
			currentNode = currentNode.children[part];
		});
		currentNode.files.push(file);
	});
	return root;
};
const FileTreeItem = ({
	node,
	level = 0,
	onClick,
	selectedFiles,
	isLongPath,
	expanded,
	onToggleExpand,
}: {
	node: TreeNode;
	level?: number;
	onClick?: (fileData: FileData) => void;
	selectedFiles?: string[];
	isLongPath?: boolean;
	expanded: Set<string>;
	onToggleExpand: (path: string) => void;
}) => {
	const isExpanded = expanded.has(node.path);
	const hasChildren =
		Object.keys(node.children).length > 0 || node.files.length > 0;
	console.log(node);
	return (
		<div className="w-full">
			{node.name !== undefined && (
				<Button
					variant="ghost"
					className={cn(
						"w-full justify-start gap-2 h-8 font-normal hover:bg-muted/50",
						isExpanded && "bg-muted/50",
					)}
					style={{ paddingLeft: `${level * 12 + 12}px` }}
					onClick={() => onToggleExpand(node.path)}
				>
					{hasChildren && (
						<span className="text-muted-foreground">
							{isExpanded ? (
								<ChevronDown className="h-4 w-4" />
							) : (
								<ChevronRight className="h-4 w-4" />
							)}
						</span>
					)}
					<Folder className="h-4 w-4 text-muted-foreground" />
					<span className="truncate">{node.name}</span>
				</Button>
			)}
			{isExpanded && (
				<div className="w-full">
					{Object.values(node.children).map((childNode) => (
						<FileTreeItem
							key={childNode.path}
							node={childNode}
							level={level + 1}
							onClick={onClick}
							selectedFiles={selectedFiles}
							isLongPath={isLongPath}
							expanded={expanded}
							onToggleExpand={onToggleExpand}
						/>
					))}
					{node.files.map((file) => (
						<Button
							key={file.newPath}
							variant="ghost"
							className={cn(
								"w-full justify-start gap-2 h-8 font-normal hover:bg-muted/50",
								selectedFiles?.includes(file.newPath) && "bg-muted",
							)}
							style={{ paddingLeft: `${(level + 1) * 12 + 12}px` }}
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
			)}
		</div>
	);
};
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
				<div className="flex gap-2 mb-2">
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
		</ScrollArea>
	);
};
