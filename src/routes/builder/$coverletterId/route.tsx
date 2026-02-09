import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import type React from "react";
import { useEffect } from "react";
import { type Layout, usePanelRef } from "react-resizable-panels";
import { useDebounceCallback } from "usehooks-ts";
import z from "zod";
import { LoadingScreen } from "@/components/layout/loading-screen";
import { ResizableGroup, ResizablePanel, ResizableSeparator } from "@/components/ui/resizable";
import { useIsMobile } from "@/hooks/use-mobile";
import { orpc } from "@/integrations/orpc/client";
import { BuilderHeader } from "./-components/header";
import { BuilderSidebarLeft } from "./-sidebar/left";
import { BuilderSidebarRight } from "./-sidebar/right";
import { useCoverLetterBuilderStore } from "./-store/cover-letter";
import { useBuilderSidebar, useBuilderSidebarStore } from "./-store/sidebar";

const builderLayoutSchema = z.object({
	left: z.number().min(0).max(100).default(30),
	artboard: z.number().min(0).max(100).default(40),
	right: z.number().min(0).max(100).default(30),
});

const getBuilderLayoutServerFn = createServerFn({ method: "GET" }).handler(async () => {
	const cookie = getCookie("cover-letter-builder-layout");
	const layout = builderLayoutSchema.safeParse(JSON.parse(cookie ?? "{}"));
	return layout.success ? layout.data : builderLayoutSchema.parse({});
});

const setBuilderLayoutServerFn = createServerFn({ method: "POST" })
	.validator(z.object({ data: builderLayoutSchema }))
	.handler(async ({ data }) => {
		setCookie("cover-letter-builder-layout", JSON.stringify(data), {
			maxAge: 60 * 60 * 24 * 365, // 1 year
		});
	});

export const Route = createFileRoute("/builder/$coverletterId")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		if (!context.session) throw redirect({ to: "/auth/login", replace: true });
		return { session: context.session };
	},
	loader: async ({ params, context }) => {
		const [layout, coverLetter] = await Promise.all([
			getBuilderLayoutServerFn(),
			context.queryClient.ensureQueryData(
				orpc.coverLetter.getById.queryOptions({ input: { id: params.coverletterId } }),
			),
		]);

		return { layout, name: coverLetter.title };
	},
	head: ({ loaderData }) => ({
		meta: loaderData ? [{ title: `${loaderData.name} - CVCraft` }] : undefined,
	}),
});

function RouteComponent() {
	const { layout: initialLayout } = Route.useLoaderData();

	const { coverletterId } = Route.useParams();
	const { data: coverLetter } = useSuspenseQuery(
		orpc.coverLetter.getById.queryOptions({ input: { id: coverletterId } }),
	);

	const isReady = useCoverLetterBuilderStore((state) => state.isReady);
	const initialize = useCoverLetterBuilderStore((state) => state.initialize);

	useEffect(() => {
		initialize(coverLetter);
		return () => initialize(null);
	}, [coverLetter, initialize]);

	if (!isReady) return <LoadingScreen />;

	return <BuilderLayout initialLayout={initialLayout} />;
}

type BuilderLayoutProps = React.ComponentProps<"div"> & {
	initialLayout: Layout;
};

function BuilderLayout({ initialLayout, ...props }: BuilderLayoutProps) {
	const isMobile = useIsMobile();

	const leftSidebarRef = usePanelRef();
	const rightSidebarRef = usePanelRef();

	const setLeftSidebar = useBuilderSidebarStore((state) => state.setLeftSidebar);
	const setRightSidebar = useBuilderSidebarStore((state) => state.setRightSidebar);

	const { maxSidebarSize, collapsedSidebarSize } = useBuilderSidebar((state) => ({
		maxSidebarSize: state.maxSidebarSize,
		collapsedSidebarSize: state.collapsedSidebarSize,
	}));

	const onLayoutChange = useDebounceCallback((layout: Layout) => {
		setBuilderLayoutServerFn({ data: layout });
	}, 200);

	useEffect(() => {
		if (!leftSidebarRef || !rightSidebarRef) return;

		setLeftSidebar(leftSidebarRef);
		setRightSidebar(rightSidebarRef);
	}, [leftSidebarRef, rightSidebarRef, setLeftSidebar, setRightSidebar]);

	const leftSidebarSize = isMobile ? 0 : initialLayout.left;
	const rightSidebarSize = isMobile ? 0 : initialLayout.right;
	const artboardSize = isMobile ? 100 : initialLayout.artboard;

	return (
		<div className="flex h-svh flex-col" {...props}>
			<BuilderHeader />

			<ResizableGroup orientation="horizontal" className="mt-14 flex-1" onLayoutChange={onLayoutChange}>
				<ResizablePanel
					collapsible
					id="left"
					ref={leftSidebarRef}
					order={1}
					defaultSize={leftSidebarSize}
					minSize={collapsedSidebarSize}
					maxSize={maxSidebarSize}
					collapsedSize={collapsedSidebarSize}
					className="bg-background"
				>
					<BuilderSidebarLeft />
				</ResizablePanel>

				<ResizableSeparator />

				<ResizablePanel id="artboard" order={2} defaultSize={artboardSize} minSize={20}>
					<Outlet />
				</ResizablePanel>

				<ResizableSeparator />

				<ResizablePanel
					collapsible
					id="right"
					ref={rightSidebarRef}
					order={3}
					defaultSize={rightSidebarSize}
					minSize={collapsedSidebarSize}
					maxSize={maxSidebarSize}
					collapsedSize={collapsedSidebarSize}
					className="bg-background"
				>
					<BuilderSidebarRight />
				</ResizablePanel>
			</ResizableGroup>
		</div>
	);
}
