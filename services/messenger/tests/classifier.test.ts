import { describe, expect, it, vi } from "vitest";
import type Anthropic from "@anthropic-ai/sdk";
import { classifyEmail, ClassificationError } from "../src/classifier.js";
import type { ClassifyRequest, EmailClassification } from "../src/schema.js";

const sampleClassification: EmailClassification = {
  intent: "interview_scheduling",
  urgency: "high",
  requires_reply: true,
  summary: "Sarah from Acme proposes an interview next Tuesday at 2pm.",
  contact: { name: "Sarah Lee", company: "Acme", role: "Backend Engineer" },
  mentioned_dates: ["next Tuesday, 2pm"],
};

const sampleRequest: ClassifyRequest = {
  message_id: "msg-123",
  from: "Sarah Lee <sarah@acme.com>",
  subject: "Interview scheduling — Backend Engineer",
  body: "Hi Yoga, are you free next Tuesday at 2pm for an interview?\n-- \nSarah",
};

function fakeClient(parseResult: unknown): Anthropic {
  return {
    messages: { parse: vi.fn().mockResolvedValue(parseResult) },
  } as unknown as Anthropic;
}

describe("classifyEmail", () => {
  it("returns validated classification with usage and prompt version", async () => {
    const client = fakeClient({
      parsed_output: sampleClassification,
      stop_reason: "end_turn",
      model: "claude-haiku-4-5",
      usage: { input_tokens: 900, output_tokens: 120 },
    });

    const result = await classifyEmail(sampleRequest, client);

    expect(result.classification).toEqual(sampleClassification);
    expect(result.model).toBe("claude-haiku-4-5");
    expect(result.prompt_version).toBe("v1");
    expect(result.usage).toEqual({ input_tokens: 900, output_tokens: 120 });
  });

  it("cleans the body and wraps the email in tags before sending", async () => {
    const client = fakeClient({
      parsed_output: sampleClassification,
      stop_reason: "end_turn",
      model: "claude-haiku-4-5",
      usage: { input_tokens: 1, output_tokens: 1 },
    });

    await classifyEmail(sampleRequest, client);

    const call = (client.messages.parse as ReturnType<typeof vi.fn>).mock.calls[0][0];
    const userContent: string = call.messages[0].content;
    expect(userContent).toContain("<email>");
    expect(userContent).toContain("From: Sarah Lee <sarah@acme.com>");
    expect(userContent).not.toContain("-- \nSarah"); // signature stripped
    expect(call.output_config?.format).toBeDefined();
  });

  it("omits adaptive thinking on the default Haiku model (unsupported there)", async () => {
    const client = fakeClient({
      parsed_output: sampleClassification,
      stop_reason: "end_turn",
      model: "claude-haiku-4-5",
      usage: { input_tokens: 1, output_tokens: 1 },
    });

    await classifyEmail(sampleRequest, client);

    const call = (client.messages.parse as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(call.thinking).toBeUndefined();
    expect(call.model).toBe("claude-haiku-4-5");
  });

  it("requests adaptive thinking when pointed at a larger model", async () => {
    const client = fakeClient({
      parsed_output: sampleClassification,
      stop_reason: "end_turn",
      model: "claude-opus-4-8",
      usage: { input_tokens: 1, output_tokens: 1 },
    });

    await classifyEmail(sampleRequest, client, "claude-opus-4-8");

    const call = (client.messages.parse as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(call.thinking).toEqual({ type: "adaptive" });
    expect(call.model).toBe("claude-opus-4-8");
  });

  it("throws ClassificationError on model refusal", async () => {
    const client = fakeClient({
      parsed_output: null,
      stop_reason: "refusal",
      model: "claude-opus-4-8",
      usage: { input_tokens: 1, output_tokens: 0 },
    });

    await expect(classifyEmail(sampleRequest, client)).rejects.toThrow(ClassificationError);
  });

  it("throws ClassificationError when parsed output is missing", async () => {
    const client = fakeClient({
      parsed_output: null,
      stop_reason: "max_tokens",
      model: "claude-opus-4-8",
      usage: { input_tokens: 1, output_tokens: 4096 },
    });

    await expect(classifyEmail(sampleRequest, client)).rejects.toThrow(
      /failed schema validation/,
    );
  });

  it("wraps API errors in ClassificationError", async () => {
    const client = {
      messages: { parse: vi.fn().mockRejectedValue(new Error("boom")) },
    } as unknown as Anthropic;

    await expect(classifyEmail(sampleRequest, client)).rejects.toThrow(
      /classification request failed/,
    );
  });
});
