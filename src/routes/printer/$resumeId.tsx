import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { LoadingScreen } from "@/components/layout/loading-screen";
import { ResumePreview } from "@/components/resume/preview";
import { useResumeStore } from "@/components/resume/store/resume";
import { getORPCClient } from "@/integrations/orpc/client";

export const Route = createFileRoute("/printer/$resumeId")({
	component: RouteComponent,
	loader: async ({ params }) => {
		const client = getORPCClient();
		const resume = await client.resume.getByIdForPrinter({ id: params.resumeId });

		// Check if we have a saved document
		if (resume.documentUrl) {
			try {
				const response = await fetch(resume.documentUrl);
				if (response.ok) {
					const htmlContent = await response.text();
					return { resume, htmlContent };
				}
			} catch (error) {
				console.error("Failed to load saved document:", error);
			}
		}

		return { resume, htmlContent: null };
	},
});

function RouteComponent() {
	const { resume, htmlContent } = Route.useLoaderData();

	const isReady = useResumeStore((state) => state.isReady);
	const initialize = useResumeStore((state) => state.initialize);

	useEffect(() => {
		if (!resume) {
			console.error("No resume data loaded");
			return;
		}
		console.log("Initializing resume:", resume.id, resume.name);
		initialize(resume);
		return () => initialize(null);
	}, [resume, initialize]);

	// If we have saved HTML content, render it directly
	if (htmlContent) {
		return (
			<div
				className="min-h-screen w-full bg-background"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: Rendering saved HTML document from storage
				dangerouslySetInnerHTML={{ __html: htmlContent }}
			/>
		);
	}

	// Otherwise, render from data
	if (!isReady) {
		console.log("Resume not ready, showing loading screen");
		return <LoadingScreen />;
	}

	console.log("Rendering resume preview");
	return (
		<div className="flex min-h-screen w-full justify-center bg-background py-8">
			<div className="flex flex-col items-center gap-8">
				<ResumePreview
					showPageNumbers
					className="flex flex-col items-center gap-8"
					pageClassName="shadow-xl rounded-md overflow-hidden print:shadow-none print:rounded-none"
				/>
			</div>
		</div>
	);
}
