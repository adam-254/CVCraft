import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { LoadingScreen } from "@/components/layout/loading-screen";
import { orpc } from "@/integrations/orpc/client";

export const Route = createFileRoute("/cover-letter/$id")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		if (!context.session) throw redirect({ to: "/auth/login", replace: true });
		return { session: context.session };
	},
	loader: async ({ params, context }) => {
		const coverLetter = await context.queryClient.ensureQueryData(
			orpc.coverLetter.getById.queryOptions({ input: { id: params.id } }),
		);

		return { title: coverLetter.title };
	},
	head: ({ loaderData }) => ({
		meta: loaderData ? [{ title: `${loaderData.title} - CVCraft` }] : undefined,
	}),
});

function RouteComponent() {
	const { id } = Route.useParams();
	const { data: coverLetter } = useSuspenseQuery(orpc.coverLetter.getById.queryOptions({ input: { id } }));

	if (!coverLetter) return <LoadingScreen />;

	return <Outlet />;
}
