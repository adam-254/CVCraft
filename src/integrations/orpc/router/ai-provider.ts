import { z } from "zod";
import { aiProviderService, createAIProviderSchema, updateAIProviderSchema } from "../services/ai-provider";
import { authedProcedure, router } from "../trpc";

export const aiProviderRouter = router({
	list: authedProcedure.query(async ({ ctx }) => {
		return aiProviderService.list(ctx.db, ctx.user.id);
	}),

	create: authedProcedure.input(createAIProviderSchema).mutation(async ({ ctx, input }) => {
		return aiProviderService.create(ctx.db, ctx.user.id, input);
	}),

	update: authedProcedure.input(updateAIProviderSchema).mutation(async ({ ctx, input }) => {
		return aiProviderService.update(ctx.db, ctx.user.id, input);
	}),

	delete: authedProcedure.input(z.object({ id: z.string().uuid() })).mutation(async ({ ctx, input }) => {
		return aiProviderService.delete(ctx.db, ctx.user.id, input.id);
	}),

	activate: authedProcedure.input(z.object({ id: z.string().uuid() })).mutation(async ({ ctx, input }) => {
		return aiProviderService.activate(ctx.db, ctx.user.id, input.id);
	}),

	getActive: authedProcedure.query(async ({ ctx }) => {
		return aiProviderService.getActive(ctx.db, ctx.user.id);
	}),
});
