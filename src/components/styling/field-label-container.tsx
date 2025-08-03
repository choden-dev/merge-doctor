import type { WithChildren } from "@/components/styling/styling-util-types.tsx";

interface FieldLabelContainerProps extends WithChildren {}
export const FieldLabelContainer = ({ children }: FieldLabelContainerProps) => {
	return <div className="flex flex-col gap-1">{children}</div>;
};
