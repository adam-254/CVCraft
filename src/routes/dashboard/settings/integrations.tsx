import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { BrainIcon, CheckCircleIcon, InfoIcon, PlusIcon, TrashSimpleIcon, XCircleIcon } from "@phosphor-icons/react";
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
import { DashboardHeader } from "../-components/header";

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
			// First test the connection
			await orpc.ai.testConnection.mutate({
				provider,
				model,
				apiKey,
				baseURL: baseUrl || selectedOption?.defaultBaseURL || "",
			});

			// If successful, create the provider
			return orpc.aiProvider.create.mutate({
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
		<form onSubmit={handleSubmit} className="space-y-4 rounded-lg border bg-card p-6">
			<h3 className="font-semibold text-lg">
				<Trans>Add New AI Provider</Trans>
			</h3>

			<div className="grid gap-4 sm:grid-cols-2">
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

			<div className="flex gap-2">
				<Button type="submit" disabled={isPending}>
					{isPending ? <Spinner /> : <PlusIcon />}
					<Trans>Add Provider</Trans>
				</Button>
			</div>
		</form>
	);
}

function ProviderCard({
	provider,
	onDelete,
	onActivate,
}: {
	provider: AIProviderConfig;
	onDelete: (id: string) => void;
	onActivate: (id: string) => void;
}) {
	const { i18n } = useLingui();
	const providerOption = providerOptions.find((opt) => opt.value === provider.provider);

	return (
		<motion.div
			initial={{ opacity: 0, y: -16 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -16 }}
			className="flex items-start gap-4 rounded-lg border bg-card p-4"
		>
			<div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
				<BrainIcon className="text-primary" size={24} />
			</div>

			<div className="flex-1 space-y-2">
				<div className="flex items-start justify-between">
					<div>
						<h4 className="font-semibold">{providerOption?.label || provider.provider}</h4>
						<p className="text-muted-foreground text-sm">{provider.model}</p>
					</div>
					<div className="flex items-center gap-2">
						<Switch
							checked={provider.isActive}
							onCheckedChange={() => onActivate(provider.id)}
							aria-label={i18n._(msg`Toggle active status`)}
						/>
						<Button size="icon" variant="ghost" onClick={() => onDelete(provider.id)}>
							<TrashSimpleIcon />
						</Button>
					</div>
				</div>

				<div className="flex items-center gap-2 text-xs">
					{provider.isActive ? (
						<>
							<CheckCircleIcon className="text-success" size={16} />
							<span className="text-success">
								<Trans>Active</Trans>
							</span>
						</>
					) : (
						<>
							<XCircleIcon className="text-muted-foreground" size={16} />
							<span className="text-muted-foreground">
								<Trans>Inactive</Trans>
							</span>
						</>
					)}
					<span className="text-muted-foreground">•</span>
					<span className="text-muted-foreground">
						<Trans>Added {provider.createdAt.toLocaleDateString()}</Trans>
					</span>
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
			return orpc.aiProvider.list.query();
		},
	});

	const { mutate: deleteProvider } = useMutation({
		mutationFn: async (id: string) => {
			return orpc.aiProvider.delete.mutate({ id });
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
			return orpc.aiProvider.activate.mutate({ id });
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
		<div className="space-y-4">
			<DashboardHeader icon={BrainIcon} title={i18n._(msg`AI Integrations`)} />

			<Separator />

			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
				className="grid max-w-3xl gap-6"
			>
				<div className="flex items-start gap-4 rounded-sm border bg-popover p-6">
					<div className="rounded-sm bg-primary/10 p-2.5">
						<InfoIcon className="text-primary" size={24} />
					</div>

					<div className="flex-1 space-y-2">
						<h3 className="font-semibold">
							<Trans>Secure AI Integration</Trans>
						</h3>

						<p className="text-muted-foreground leading-relaxed">
							<Trans>
								Connect your AI provider accounts to enable AI-powered features like resume content generation, cover
								letter writing, and more. Your API keys are encrypted and stored securely.
							</Trans>
						</p>
					</div>
				</div>

				<Separator />

				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h3 className="font-semibold text-lg">
							<Trans>Your AI Providers</Trans>
						</h3>
						<Button variant="outline" onClick={() => setShowAddForm(!showAddForm)}>
							<PlusIcon />
							<Trans>Add Provider</Trans>
						</Button>
					</div>

					<AnimatePresence>
						{showAddForm && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								exit={{ opacity: 0, height: 0 }}
							>
								<AddProviderForm
									onSuccess={() => {
										setShowAddForm(false);
										queryClient.invalidateQueries({ queryKey: ["ai-providers"] });
									}}
								/>
							</motion.div>
						)}
					</AnimatePresence>

					<div className="space-y-3">
						<AnimatePresence>
							{providers.length === 0 && !showAddForm && (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									className="rounded-lg border border-dashed bg-muted/30 p-8 text-center"
								>
									<BrainIcon className="mx-auto mb-3 text-muted-foreground" size={48} />
									<h4 className="mb-2 font-semibold">
										<Trans>No AI providers configured</Trans>
									</h4>
									<p className="mb-4 text-muted-foreground text-sm">
										<Trans>Add your first AI provider to start using AI-powered features</Trans>
									</p>
									<Button onClick={() => setShowAddForm(true)}>
										<PlusIcon />
										<Trans>Add Your First Provider</Trans>
									</Button>
								</motion.div>
							)}

							{providers.map((provider) => (
								<ProviderCard
									key={provider.id}
									provider={provider}
									onDelete={handleDelete}
									onActivate={activateProvider}
								/>
							))}
						</AnimatePresence>
					</div>
				</div>
			</motion.div>
		</div>
	);
}
