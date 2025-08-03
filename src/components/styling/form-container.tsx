import type { WithChildren } from "@/components/styling/styling-util-types.tsx";

interface FormContainerProps extends WithChildren {}
export const FormContainer = ({ children }: FormContainerProps) => {
	return <div className="flex flex-col gap-2 grow-0">{children}</div>;
};
