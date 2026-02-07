import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { ClockCounterClockwiseIcon, GearSixIcon, ReadCvLogoIcon, ShieldCheckIcon, UserCircleIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BrandIcon } from "@/components/ui/brand-icon";
import { Copyright } from "@/components/ui/copyright";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
	SidebarSeparator,
	useSidebarState,
} from "@/components/ui/sidebar";
import { UserDropdownMenu } from "@/components/user/dropdown-menu";
import { getInitials } from "@/utils/string";

type SidebarItem = {
	icon: React.ReactNode;
	label: MessageDescriptor;
	href: React.ComponentProps<typeof Link>["to"];
};

const appSidebarItems = [
	{
		icon: <ReadCvLogoIcon />,
		label: msg`Create Resume`,
		href: "/dashboard/resumes",
	},
	{
		icon: <ClockCounterClockwiseIcon />,
		label: msg`History`,
		href: "/dashboard/history",
	},
] as const satisfies SidebarItem[];

const settingsSidebarItems = [
	{
		icon: <UserCircleIcon />,
		label: msg`Profile`,
		href: "/dashboard/settings/profile",
	},
	{
		icon: <GearSixIcon />,
		label: msg`Preferences`,
		href: "/dashboard/settings/preferences",
	},
	{
		icon: <ShieldCheckIcon />,
		label: msg`Authentication`,
		href: "/dashboard/settings/authentication",
	},
] as const satisfies SidebarItem[];

type SidebarItemListProps = {
	items: readonly SidebarItem[];
};

function SidebarItemList({ items }: SidebarItemListProps) {
	const { i18n } = useLingui();

	return (
		<SidebarMenu>
			{items.map((item, index) => (
				<SidebarMenuItem key={item.href}>
					<SidebarMenuButton asChild title={i18n.t(item.label)}>
						<Link
							to={item.href}
							activeProps={{
								className:
									"bg-gradient-to-r from-primary/20 via-primary/15 to-primary/10 border-l-[3px] border-primary text-primary font-bold shadow-lg shadow-primary/10",
							}}
							className="group/item relative overflow-hidden rounded-xl transition-all hover:bg-gradient-to-r hover:from-primary/10 hover:via-primary/5 hover:to-transparent hover:shadow-md"
						>
							{/* Animated background on hover */}
							<div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary/5 to-transparent transition-transform duration-500 group-hover/item:translate-x-full" />

							{/* Icon container with enhanced effects */}
							<div className="relative flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-muted/60 via-muted/40 to-muted/20 shadow-sm transition-all group-hover/item:scale-110 group-hover/item:from-primary/30 group-hover/item:via-primary/20 group-hover/item:to-primary/10 group-hover/item:shadow-md group-hover/item:shadow-primary/20">
								{/* Icon glow effect */}
								<div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/0 to-primary/0 opacity-0 blur-sm transition-all group-hover/item:from-primary/30 group-hover/item:to-primary/10 group-hover/item:opacity-100" />
								<div className="relative">{item.icon}</div>
								{/* Notification dot (can be conditional) */}
								{index === 0 && (
									<div className="absolute -top-0.5 -right-0.5 size-2 rounded-full border border-background bg-gradient-to-br from-blue-400 to-blue-500 shadow-sm" />
								)}
							</div>

							<span className="relative shrink-0 font-medium transition-[margin,opacity] duration-200 ease-in-out group-data-[collapsible=icon]:-ms-8 group-data-[collapsible=icon]:opacity-0">
								{i18n.t(item.label)}
							</span>

							{/* Active indicator line */}
							<div className="absolute right-0 bottom-0 left-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-primary via-primary/50 to-transparent transition-transform group-hover/item:scale-x-100" />
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
			))}
		</SidebarMenu>
	);
}

export function DashboardSidebar() {
	const { state } = useSidebarState();

	return (
		<Sidebar
			variant="floating"
			collapsible="icon"
			className="relative overflow-hidden border-border/50 border-r bg-gradient-to-b from-background via-muted/5 to-background"
		>
			{/* Animated Background Effects */}
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				{/* Gradient Orbs */}
				<div className="absolute top-20 -left-20 size-40 animate-pulse rounded-full bg-gradient-to-br from-primary/10 to-transparent blur-3xl" />
				<div className="absolute top-60 -right-20 size-40 animate-pulse rounded-full bg-gradient-to-br from-blue-500/10 to-transparent blur-3xl delay-1000" />
				<div className="absolute bottom-40 -left-20 size-40 animate-pulse rounded-full bg-gradient-to-br from-purple-500/10 to-transparent blur-3xl delay-500" />

				{/* Mesh Gradient Overlay */}
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.05),rgba(255,255,255,0))]" />
			</div>

			<SidebarHeader className="relative border-border/50 border-b bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 backdrop-blur-sm">
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild className="group/logo h-auto justify-center transition-all hover:bg-primary/10">
							<Link to="/">
								<div className="relative flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 via-primary/15 to-primary/10 shadow-lg shadow-primary/20 transition-all group-hover/logo:scale-110 group-hover/logo:shadow-primary/30 group-hover/logo:shadow-xl">
									{/* Shine effect */}
									<div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 transition-opacity group-hover/logo:opacity-100" />
									<BrandIcon variant="icon" className="relative size-7" />
									{/* Glow ring */}
									<div className="absolute inset-0 rounded-2xl ring-2 ring-primary/0 transition-all group-hover/logo:ring-primary/30" />
								</div>
								<h1 className="sr-only">CVCraft</h1>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarSeparator className="bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

			<SidebarContent className="relative">
				<SidebarGroup>
					<SidebarGroupLabel className="flex items-center gap-2 px-2 font-bold text-muted-foreground/80 text-xs uppercase tracking-widest">
						<div className="size-1 rounded-full bg-primary/50" />
						<Trans>App</Trans>
						<div className="ml-auto h-px flex-1 bg-gradient-to-r from-border/50 to-transparent" />
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarItemList items={appSidebarItems} />
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup>
					<SidebarGroupLabel className="flex items-center gap-2 px-2 font-bold text-muted-foreground/80 text-xs uppercase tracking-widest">
						<div className="size-1 rounded-full bg-blue-500/50" />
						<Trans>Settings</Trans>
						<div className="ml-auto h-px flex-1 bg-gradient-to-r from-border/50 to-transparent" />
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarItemList items={settingsSidebarItems} />
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarSeparator className="bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

			<SidebarFooter className="relative gap-y-3 border-border/50 border-t bg-gradient-to-br from-muted/10 via-transparent to-purple-500/5 backdrop-blur-sm">
				<SidebarMenu>
					<SidebarMenuItem>
						<UserDropdownMenu>
							{({ session }) => (
								<SidebarMenuButton className="group/user relative h-auto gap-x-3 overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-background via-muted/10 to-background p-2 shadow-lg transition-all hover:border-primary/40 hover:shadow-primary/10 hover:shadow-xl group-data-[collapsible=icon]:p-1.5!">
									{/* Hover gradient overlay */}
									<div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/5 to-primary/0 opacity-0 transition-opacity group-hover/user:opacity-100" />

									<Avatar className="relative size-10 shrink-0 border-2 border-primary/30 shadow-md transition-all group-hover/user:border-primary/50 group-hover/user:shadow-lg group-hover/user:shadow-primary/20 group-data-[collapsible=icon]:size-8">
										<AvatarImage src={session.user.image ?? undefined} />
										<AvatarFallback className="bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 font-bold text-primary text-sm group-data-[collapsible=icon]:text-xs">
											{getInitials(session.user.name)}
										</AvatarFallback>
										{/* Online indicator */}
										<div className="absolute right-0 bottom-0 size-3 rounded-full border-2 border-background bg-gradient-to-br from-green-400 to-green-500 shadow-sm" />
									</Avatar>

									<div className="relative flex-1 transition-[margin,opacity] duration-200 ease-in-out group-data-[collapsible=icon]:-ms-8 group-data-[collapsible=icon]:opacity-0">
										<p className="truncate font-bold text-foreground">{session.user.name}</p>
										<p className="truncate text-muted-foreground text-xs">{session.user.email}</p>
									</div>
								</SidebarMenuButton>
							)}
						</UserDropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>

				<AnimatePresence>
					{state === "expanded" && (
						<motion.div
							key="copyright"
							initial={{ y: 50, height: 0, opacity: 0 }}
							animate={{ y: 0, height: "auto", opacity: 1 }}
							exit={{ y: 50, height: 0, opacity: 0 }}
							transition={{ type: "spring", stiffness: 300, damping: 30 }}
							className="relative overflow-hidden rounded-xl border border-border/40 bg-gradient-to-br from-muted/40 via-muted/20 to-transparent p-3 shadow-inner"
						>
							{/* Decorative corner accent */}
							<div className="absolute top-0 right-0 size-16 bg-gradient-to-br from-primary/10 to-transparent blur-xl" />
							<Copyright className="wrap-break-word relative shrink-0 whitespace-normal" />
						</motion.div>
					)}
				</AnimatePresence>
			</SidebarFooter>

			<SidebarRail />
		</Sidebar>
	);
}
