import type React from "react";

interface SectionLayoutProps {
	title?: string;
	children?: Readonly<React.ReactNode>;
}
export const SectionLayout = ({ title, children }: SectionLayoutProps) => {
	return (
		<section className="flex flex-col w-full">
			<h2 className="font-bold text-3xl">{title}</h2>
			<article className="flex flex-col mt-2">{children}</article>
		</section>
	);
};
