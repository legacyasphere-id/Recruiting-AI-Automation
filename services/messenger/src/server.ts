import Fastify, { type FastifyInstance } from "fastify";
import type Anthropic from "@anthropic-ai/sdk";
import { ClassifyRequestSchema } from "./schema.js";
import { classifyEmail, ClassificationError, DEFAULT_MODEL } from "./classifier.js";

export interface BuildServerOptions {
  /** Injectable for tests; defaults to a real Anthropic client per call. */
  anthropicClient?: Anthropic;
  model?: string;
}

export function buildServer(options: BuildServerOptions = {}): FastifyInstance {
  const app = Fastify({ logger: true });

  app.get("/healthz", async () => ({ status: "ok", model: options.model ?? DEFAULT_MODEL }));

  app.post("/classify", async (request, reply) => {
    const parsed = ClassifyRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        error: "invalid_request",
        details: parsed.error.flatten().fieldErrors,
      });
    }

    try {
      const result = await classifyEmail(parsed.data, options.anthropicClient, options.model);
      app.log.info(
        {
          message_id: parsed.data.message_id,
          intent: result.classification.intent,
          usage: result.usage,
          model: result.model,
        },
        "email classified",
      );
      return reply.send({ message_id: parsed.data.message_id, ...result });
    } catch (error) {
      if (error instanceof ClassificationError) {
        app.log.error({ message_id: parsed.data.message_id, err: error }, "classification failed");
        // 502 so n8n routes the item to its error output (dead-letter path,
        // formalized in Phase VIII).
        return reply.status(502).send({ error: "classification_failed", message: error.message });
      }
      throw error;
    }
  });

  return app;
}
