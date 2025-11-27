import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { stripeRouter } from "./stripeRouter";
import { artefactsRouter } from "./artefactsRouter";
import { blogRouter } from "./blogRouter";
import { newsletterRouter } from './newsletterRouter';
import { trackingRouter } from './trackingRouter';
import { leadScoringRouter } from './leadScoringRouter';
import { leadNotesRouter } from './leadNotesRouter';
import { leadTasksRouter } from './leadTasksRouter';
import { leadSegmentsRouter } from './leadSegmentsRouter';
import { abTestingRouter } from './abTestingRouter';
import { emailTemplatesRouter } from './emailTemplatesRouter';
import { emailWorkflowsRouter } from './emailWorkflowsRouter';
import { analyticsRouter } from './analyticsRouter';
import { formationRouter } from './formationRouter';
import { quotesRouter } from './quotesRouter';
import { coachingRouter } from './coachingRouter';
import { nftGratitudeRouter } from './nftGratitudeRouter';
import { correcteurRouter } from './correcteurRouter';
import { nftRoyaltyRouter } from './nftRoyaltyRouter';

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Stripe payment router
  stripe: stripeRouter,

  // Artefacts management router
  artefacts: artefactsRouter,

  // Blog and case studies router
  blog: blogRouter,

  // Newsletter router
  newsletter: newsletterRouter,

  // Email tracking router
  tracking: trackingRouter,

  // Lead scoring router
  leadScoring: leadScoringRouter,

  // Lead notes router
  leadNotes: leadNotesRouter,

  // Lead tasks router
  leadTasks: leadTasksRouter,

  // Lead segments router
  leadSegments: leadSegmentsRouter,

  // A/B testing router
  abTesting: abTestingRouter,

  // Email templates router
  emailTemplates: emailTemplatesRouter,

  // Email workflows router
  emailWorkflows: emailWorkflowsRouter,

  // Analytics router
  analytics: analyticsRouter,

  // Formation interactive router
  formation: formationRouter,

  // Quotes (devis) router
  quotes: quotesRouter,

  // Coaching Zoom router
  coaching: coachingRouter,

  // NFT de Gratitude Économique router
  nftGratitude: nftGratitudeRouter,

  // Correcteur Universel de Contenu router
  correcteur: correcteurRouter,

  // NFT Royalty Tracking router
  nftRoyalty: nftRoyaltyRouter,

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
