import { z } from "zod";

/**
 * The structured metadata contract for every classified email.
 * Enforced at the AI boundary via structured outputs — the model cannot
 * return anything that does not validate against this schema.
 * Structured outputs do not support min/max-length constraints, so only
 * types, enums, and nullability are used here.
 */
export const EmailClassificationSchema = z.object({
  intent: z.enum([
    "candidate_application",
    "recruiter_outreach",
    "interview_scheduling",
    "follow_up",
    "offer_discussion",
    "rejection",
    "other_recruiting",
    "not_recruiting",
  ]),
  urgency: z.enum(["low", "normal", "high"]),
  requires_reply: z.boolean(),
  summary: z.string(),
  contact: z.object({
    name: z.string().nullable(),
    company: z.string().nullable(),
    role: z.string().nullable(),
  }),
  mentioned_dates: z.array(z.string()),
});

export type EmailClassification = z.infer<typeof EmailClassificationSchema>;

/** Payload accepted by POST /classify — what n8n sends per Gmail message. */
export const ClassifyRequestSchema = z.object({
  message_id: z.string().min(1),
  thread_id: z.string().optional(),
  from: z.string().min(1),
  to: z.string().optional(),
  subject: z.string().default(""),
  body: z.string().min(1),
  received_at: z.string().optional(),
});

export type ClassifyRequest = z.infer<typeof ClassifyRequestSchema>;
