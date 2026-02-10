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

		return { resume };
	},
});

function RouteComponent() {
	const { resume } = Route.useLoaderData();

	const isReady = useResumeStore((state) => state.isReady);
	const initialize = useResumeStore((state) => state.initialize);

	useEffect(() => {
		if (!resume) return;
		initialize(resume);
		return () => initialize(null);
	}, [resume, initialize]);

	if (!isReady) return <LoadingScreen />;

	return <ResumePreview pageClassName="print:w-full!" />;
}
