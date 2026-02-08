import { aiRouter } from "./ai";
import { authRouter } from "./auth";
import { coverLetterRouter } from "./cover-letter";
import { flagsRouter } from "./flags";
import { printerRouter } from "./printer";
import { resumeRouter } from "./resume";
import { statisticsRouter } from "./statistics";
import { storageRouter } from "./storage";

export default {
	ai: aiRouter,
	auth: authRouter,
	coverLetter: coverLetterRouter,
	flags: flagsRouter,
	resume: resumeRouter,
	storage: storageRouter,
	printer: printerRouter,
	statistics: statisticsRouter,
};
