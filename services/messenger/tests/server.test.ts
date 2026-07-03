import { describe, expect, it, vi } from "vitest";
import type Anthropic from "@anthropic-ai/sdk";
import { buildServer } from "../src/server.js";
import type { EmailClassification } from "../src/schema.js";

const classification: EmailClassification = {
  intent: "recruiter_outreach",
  urgency: "normal",
  requires_reply: true,
  summary: "A recruiter reaches out about a senior role.",
  contact: { name: "Sam", company: "Globex", role: "Senior Engineer" },
  mentioned_dates: [],
};

function clientReturning(result: unknown, reject = false): Anthropic {
  return {
    messages: {
      parse: reject
        ? vi.fn().mockRejectedValue(new Error("api down"))
        : vi.fn().mockResolvedValue(result),
    },
  } as unknown as Anthropic;
}

describe("POST /classify", () => {
  it("returns the classification for a valid payload", async () => {
    const app = buildServer({
      anthropicClient: clientReturning({
        parsed_output: classification,
        stop_reason: "end_turn",
        model: "claude-opus-4-8",
        usage: { input_tokens: 10, output_tokens: 5 },
      }),
    });

    const response = await app.inject({
      method: "POST",
      url: "/classify",
      payload: {
        message_id: "m1",
        from: "sam@globex.com",
        subject: "Opportunity",
        body: "Hi, I have a senior role you may like.",
      },
    });

    expect(response.statusCode).toBe(200);
    const json = response.json();
    expect(json.message_id).toBe("m1");
    expect(json.classification.intent).toBe("recruiter_outreach");
    await app.close();
  });

  it("rejects an invalid payload with 400", async () => {
    const app = buildServer({ anthropicClient: clientReturning({}) });
    const response = await app.inject({
      method: "POST",
      url: "/classify",
      payload: { from: "x" }, // missing message_id and body
    });
    expect(response.statusCode).toBe(400);
    expect(response.json().error).toBe("invalid_request");
    await app.close();
  });

  it("returns 502 when classification fails so n8n dead-letters the item", async () => {
    const app = buildServer({ anthropicClient: clientReturning(null, true) });
    const response = await app.inject({
      method: "POST",
      url: "/classify",
      payload: { message_id: "m2", from: "a@b.com", subject: "s", body: "hello" },
    });
    expect(response.statusCode).toBe(502);
    expect(response.json().error).toBe("classification_failed");
    await app.close();
  });
});

describe("GET /healthz", () => {
  it("reports ok", async () => {
    const app = buildServer();
    const response = await app.inject({ method: "GET", url: "/healthz" });
    expect(response.statusCode).toBe(200);
    expect(response.json().status).toBe("ok");
    await app.close();
  });
});
