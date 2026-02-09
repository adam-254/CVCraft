import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { BrainIcon, CheckCircleIcon, PlusIcon, TrashSimpleIcon, XCircleIcon } from "@phosphor-icons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { useConfirm } from "@/hooks/use-confirm";
import type { AIProvider } from "@/integrations/ai/store";
import { orpc } from "@/integrations/orpc/client";

export const Route = createFileRoute("/dashboard/settings/integrations")({
	component: RouteComponent,
});

const providerOptions: (ComboboxOption<AIProvider> & { defaultBaseURL: string })[] = [
	{
		value: "openai",
		label: "OpenAI",
		keywords: ["openai", "gpt", "chatgpt"],
		defaultBaseURL: "https://api.openai.com/v1",
	},
	{
		value: "anthropic",
		label: "Anthropic Claude",
		keywords: ["anthropic", "claude", "ai"],
		defaultBaseURL: "https://api.anthropic.com/v1",
	},
	{
		value: "gemini",
		label: "Google Gemini",
		keywords: ["gemini", "google", "bard"],
		defaultBaseURL: "https://generativelanguage.googleapis.com/v1beta",
	},
	{
		value: "ollama",
		label: "Ollama (Local)",
		keywords: ["ollama", "ai", "local"],
		defaultBaseURL: "http://localhost:11434",
	},
	{
		value: "vercel-ai-gateway",
		label: "Vercel AI Gateway",
		keywords: ["vercel", "gateway", "ai"],
		defaultBaseURL: "https://ai-gateway.vercel.sh/v1/ai",
	},
];

type AIProviderConfig = {
	id: string;
	provider: AIProvider;
	model: string;
	apiKey: string;
	baseUrl: string | null;
	isActive: boolean;
	createdAt: Date;
};

function AddProviderForm({ onSuccess }: { onSuccess: () => void }) {
	const { i18n } = useLingui();
	const [provider, setProvider] = useState<AIProvider>("openai");
	const [model, setModel] = useState("");
	const [apiKey, setApiKey] = useState("");
	const [baseUrl, setBaseUrl] = useState("");

	const selectedOption = providerOptions.find((opt) => opt.value === provider);

	const { mutate: addProvider, isPending } = useMutation({
		mutationFn: async () => {
			return (orpc.aiProvider.create as any).mutate({
				provider,
				model,
				apiKey,
				baseUrl: baseUrl || null,
			});
		},
		onSuccess: () => {
			toast.success(i18n._(msg`AI provider added successfully`));
			setModel("");
			setApiKey("");
			setBaseUrl("");
			onSuccess();
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!model || !apiKey) {
			toast.error(i18n._(msg`Please fill in all required fields`));
			return;
		}
		addProvider();
	};

	return (
		<motion.form
			initial={{ opacity: 0, height: 0 }}
			animate={{ opacity: 1, height: "auto" }}
			exit={{ opacity: 0, height: 0 }}
			transition={{ duration: 0.3 }}
			onSubmit={handleSubmit}
			className="overflow-hidden rounded-2xl border-2 border-border/50 border-dashed bg-gradient-to-br from-card via-card to-primary/5 p-8 shadow-lg"
		>
			<h3 className="mb-6 font-semibold text-lg">
				<Trans>Add New AI Provider</Trans>
			</h3>

			<div className="grid gap-6 sm:grid-cols-2">
				<div className="flex flex-col gap-y-2">
					<Label htmlFor="provider">
						<Trans>Provider</Trans>
					</Label>
					<Combobox
						id="provider"
						value={provider}
						options={providerOptions}
						onValueChange={(value) => value && setProvider(value)}
					/>
				</div>

				<div className="flex flex-col gap-y-2">
					<Label htmlFor="model">
						<Trans>Model</Trans> <span className="text-destructive">*</span>
					</Label>
					<Input
						id="model"
						type="text"
						value={model}
						onChange={(e) => setModel(e.target.value)}
						placeholder={i18n._(msg`e.g., gpt-4, claude-3-opus, gemini-pro`)}
						required
					/>
				</div>

				<div className="flex flex-col gap-y-2 sm:col-span-2">
					<Label htmlFor="api-key">
						<Trans>API Key</Trans> <span className="text-destructive">*</span>
					</Label>
					<Input
						id="api-key"
						type="password"
						value={apiKey}
						onChange={(e) => setApiKey(e.target.value)}
						placeholder={i18n._(msg`Enter your API key`)}
						required
					/>
				</div>

				<div className="flex flex-col gap-y-2 sm:col-span-2">
					<Label htmlFor="base-url">
						<Trans>Base URL (Optional)</Trans>
					</Label>
					<Input
						id="base-url"
						type="url"
						value={baseUrl}
						placeholder={selectedOption?.defaultBaseURL}
						onChange={(e) => setBaseUrl(e.target.value)}
					/>
				</div>
			</div>

			<div className="mt-6 flex gap-2">
				<Button
					type="submit"
					disabled={isPending}
					className="gap-2 bg-gradient-to-r from-primary to-primary/80 font-semibold shadow-lg transition-all hover:scale-105 hover:shadow-primary/20 hover:shadow-xl"
				>
					{isPending ? <Spinner /> : <PlusIcon weight="bold" />}
					<Trans>Add Provider</Trans>
				</Button>
			</div>
		</motion.form>
	);
}

function ProviderCard({
	provider,
	providerLabel,
	onDelete,
	onActivate,
}: {
	provider: AIProviderConfig;
	providerLabel: string;
	onDelete: (id: string) => void;
	onActivate: (id: string) => void;
}) {
	const { i18n } = useLingui();

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.3 }}
			className="group relative overflow-hidden rounded-2xl border-2 border-border/50 bg-gradient-to-br from-card via-card to-purple-500/5 p-6 shadow-xl transition-all hover:shadow-2xl"
		>
			{/* Decorative gradient overlay */}
			<div className="absolute top-0 right-0 size-40 rounded-full bg-gradient-to-br from-purple-500/10 to-transparent blur-3xl transition-all group-hover:scale-150" />

			<div className="relative flex items-start gap-4">
				<div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/10 shadow-md">
					<BrainIcon className="size-7 text-purple-600" weight="duotone" />
				</div>

				<div className="flex-1 space-y-3">
					<div className="flex items-start justify-between gap-4">
						<div>
							<h4 className="font-semibold text-lg">{providerLabel}</h4>
							<p className="text-muted-foreground text-sm">{provider.model}</p>
						</div>
						<div className="flex items-center gap-2">
							<Switch
								checked={provider.isActive}
								onCheckedChange={() => onActivate(provider.id)}
								aria-label={i18n._(msg`Toggle active status`)}
							/>
							<Button
								size="icon"
								variant="ghost"
								onClick={() => onDelete(provider.id)}
								className="transition-all hover:scale-110 hover:bg-destructive/10 hover:text-destructive"
							>
								<TrashSimpleIcon weight="bold" />
							</Button>
						</div>
					</div>

					<div className="flex items-center gap-3 text-xs">
						{provider.isActive ? (
							<>
								<div className="flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 font-medium text-success">
									<CheckCircleIcon size={14} weight="fill" />
									<span>
										<Trans>Active</Trans>
									</span>
								</div>
							</>
						) : (
							<>
								<div className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 font-medium text-muted-foreground">
									<XCircleIcon size={14} weight="fill" />
									<span>
										<Trans>Inactive</Trans>
									</span>
								</div>
							</>
						)}
						<span className="text-muted-foreground">•</span>
						<span className="text-muted-foreground">
							<Trans>Added {provider.createdAt.toLocaleDateString()}</Trans>
						</span>
					</div>
				</div>
			</div>
		</motion.div>
	);
}

function RouteComponent() {
	const { i18n } = useLingui();
	const confirm = useConfirm();
	const queryClient = useQueryClient();
	const [showAddForm, setShowAddForm] = useState(false);

	const { data: providers = [] } = useQuery<AIProviderConfig[]>({
		queryKey: ["ai-providers"],
		queryFn: async () => {
			return (orpc.aiProvider.list as any).query();
		},
	});

	const { mutate: deleteProvider } = useMutation({
		mutationFn: async (id: string) => {
			return (orpc.aiProvider.delete as any).mutate({ id });
		},
		onSuccess: () => {
			toast.success(i18n._(msg`Provider deleted successfully`));
			queryClient.invalidateQueries({ queryKey: ["ai-providers"] });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const { mutate: activateProvider } = useMutation({
		mutationFn: async (id: string) => {
			return (orpc.aiProvider.activate as any).mutate({ id });
		},
		onSuccess: () => {
			toast.success(i18n._(msg`Provider activated successfully`));
			queryClient.invalidateQueries({ queryKey: ["ai-providers"] });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const handleDelete = async (id: string) => {
		const confirmation = await confirm(i18n._(msg`Are you sure you want to delete this AI provider?`), {
			description: i18n._(msg`This action cannot be undone.`),
			confirmText: i18n._(msg`Delete`),
			cancelText: i18n._(msg`Cancel`),
		});

		if (!confirmation) return;
		deleteProvider(id);
	};

	return (
		<div className="relative mx-auto w-full max-w-4xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
			{/* Animated Background Orbs */}
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="absolute top-0 -left-32 size-64 animate-pulse rounded-full bg-gradient-to-br from-purple-500/20 to-transparent blur-3xl" />
				<div className="absolute top-32 -right-32 size-96 animate-pulse rounded-full bg-gradient-to-br from-blue-500/20 to-transparent blur-3xl delay-1000" />
				<div className="absolute top-64 left-1/2 size-80 animate-pulse rounded-full bg-gradient-to-br from-pink-500/15 to-transparent blur-3xl delay-500" />
			</div>

			{/* Header Section */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
				className="relative space-y-3 text-center"
			>
				<div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 via-purple-500/10 to-purple-500/5 shadow-lg">
					<BrainIcon className="size-8 text-purple-600" weight="duotone" />
				</div>
				<div>
					<h1 className="font-bold text-3xl tracking-tight">
						<Trans>AI Integrations</Trans>
					</h1>
					<p className="mt-2 text-muted-foreground">
						<Trans>Connect AI providers to enable intelligent features</Trans>
					</p>
				</div>
			</motion.div>

			<Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.1 }}
				className="relative mx-auto max-w-2xl space-y-6"
			>
				{/* Info Card */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2, duration: 0.4 }}
					className="rounded-xl border-2 border-border/30 bg-gradient-to-br from-muted/40 to-muted/10 p-5 shadow-md"
				>
					<div className="flex items-start gap-4">
						<div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/10 shadow-sm">
							<span className="text-2xl">🤖</span>
						</div>
						<div className="space-y-1.5">
							<p className="font-semibold text-foreground text-sm">
								<Trans>Secure AI Integration</Trans>
							</p>
							<p className="text-muted-foreground text-sm leading-relaxed">
								<Trans>
									Connect your AI provider accounts to enable AI-powered features like resume content generation, cover
									letter writing, and more. Your API keys are encrypted and stored securely.
								</Trans>
							</p>
						</div>
					</div>
				</motion.div>

				{/* Add Provider Button */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3, duration: 0.4 }}
					className="flex items-center justify-between"
				>
					<h3 className="font-semibold text-lg">
						<Trans>Your AI Providers</Trans>
					</h3>
					<Button
						variant="outline"
						onClick={() => setShowAddForm(!showAddForm)}
						className="gap-2 border-2 border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-transparent font-semibold transition-all hover:scale-105 hover:border-purple-500/50 hover:bg-purple-500/20 hover:shadow-purple-500/20 hover:shadow-lg"
					>
						<PlusIcon weight="bold" />
						<Trans>Add Provider</Trans>
					</Button>
				</motion.div>

				{/* Add Provider Form */}
				<AnimatePresence>
					{showAddForm && (
						<AddProviderForm
							onSuccess={() => {
								setShowAddForm(false);
								queryClient.invalidateQueries({ queryKey: ["ai-providers"] });
							}}
						/>
					)}
				</AnimatePresence>

				{/* Provider Cards */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4, duration: 0.4 }}
					className="space-y-4"
				>
					<AnimatePresence mode="popLayout">
						{providers.length === 0 && !showAddForm && (
							<motion.div
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.95 }}
								transition={{ duration: 0.3 }}
								className="rounded-2xl border-2 border-border/50 border-dashed bg-gradient-to-br from-muted/30 to-muted/10 p-12 text-center"
							>
								<BrainIcon className="mx-auto mb-4 text-muted-foreground" size={56} weight="duotone" />
								<h4 className="mb-2 font-semibold text-lg">
									<Trans>No AI providers configured</Trans>
								</h4>
								<p className="mb-6 text-muted-foreground text-sm">
									<Trans>Add your first AI provider to start using AI-powered features</Trans>
								</p>
								<Button
									onClick={() => setShowAddForm(true)}
									className="gap-2 bg-gradient-to-r from-purple-500 to-purple-600 font-semibold shadow-lg transition-all hover:scale-105 hover:shadow-purple-500/20 hover:shadow-xl"
								>
									<PlusIcon weight="bold" />
									<Trans>Add Your First Provider</Trans>
								</Button>
							</motion.div>
						)}

						{providers.map((provider) => {
							const providerOption = providerOptions.find((opt) => opt.value === provider.provider);
							const providerLabel = providerOption?.label || provider.provider;
							return (
								<ProviderCard
									key={provider.id}
									provider={provider}
									providerLabel={String(providerLabel)}
									onDelete={handleDelete}
									onActivate={activateProvider}
								/>
							);
						})}
					</AnimatePresence>
				</motion.div>
			</motion.div>
		</div>
	);
}
