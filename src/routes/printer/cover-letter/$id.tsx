import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { CoverLetterPreview } from "@/components/cover-letter/preview";
import { LoadingScreen } from "@/components/layout/loading-screen";
import { getORPCClient } from "@/integrations/orpc/client";
import { useCoverLetterStore } from "@/stores/cover-letter";

export const Route = createFileRoute("/printer/cover-letter/$id")({
	component: RouteComponent,
	loader: async ({ params }) => {
		const client = getORPCClient();
		const coverLetter = await client.coverLetter.getById({ id: params.id });

		return { coverLetter };
	},
});

function RouteComponent() {
	const { coverLetter } = Route.useLoaderData();

	const setCoverLetter = useCoverLetterStore((state) => state.setCoverLetter);

	useEffect(() => {
		if (!coverLetter) return;
		setCoverLetter(coverLetter);
		return () => setCoverLetter(null);
	}, [coverLetter, setCoverLetter]);

	if (!coverLetter) return <LoadingScreen />;

	return <CoverLetterPreview />;
}
