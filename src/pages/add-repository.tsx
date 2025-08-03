import { AddRemoteRepositoryForm } from "@/components/forms/add-remote-repository.tsx";
import { SectionLayout } from "@/components/layout/section-layout.tsx";
import { Button } from "@/components/shadcn/button.tsx";
import { Input } from "@/components/shadcn/input.tsx";
import { Label } from "@/components/shadcn/label.tsx";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/shadcn/tabs.tsx";
import { FieldLabelContainer } from "@/components/styling/field-label-container.tsx";
import { FormContainer } from "@/components/styling/form-container.tsx";

export const AddRepositoryPage = () => {
	return (
		<SectionLayout title="Initialise new repository">
			<Tabs defaultValue="local">
				<TabsList>
					<TabsTrigger value="local">Local</TabsTrigger>
					<TabsTrigger value="remote">Remote (RDE or SSH)</TabsTrigger>
				</TabsList>
				<TabsContent value="local" className="max-w-96">
					<FormContainer>
						<FieldLabelContainer>
							<Label htmlFor="local-repository-path">Repository Path</Label>
							<Input id="local-repository-path" type="file" />
						</FieldLabelContainer>
						<Button>Open Repo</Button>
					</FormContainer>
				</TabsContent>
				<TabsContent value="remote" className="max-w-96">
					<FormContainer>
						<AddRemoteRepositoryForm />
					</FormContainer>
				</TabsContent>
			</Tabs>
		</SectionLayout>
	);
};
