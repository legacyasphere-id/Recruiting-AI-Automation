import { describe, expect, it } from "vitest";
import { cleanEmailBody, parseAddress, truncateBody } from "../src/email-parser.js";

describe("cleanEmailBody", () => {
  it("keeps a plain body untouched", () => {
    const body = "Hi Yoga,\n\nAre you available for a call next Tuesday?\n\nBest,\nSarah";
    expect(cleanEmailBody(body)).toBe(body);
  });

  it("strips quoted reply history introduced by an 'On ... wrote:' header", () => {
    const body = [
      "Sounds good, let's do 2pm.",
      "",
      "On Tue, Jul 1, 2026 at 9:12 AM Sarah Lee <sarah@acme.com> wrote:",
      "> Are you available next Tuesday?",
      "> Best, Sarah",
    ].join("\n");
    expect(cleanEmailBody(body)).toBe("Sounds good, let's do 2pm.");
  });

  it("strips inline quoted lines starting with >", () => {
    const body = "> old message line\nThanks, confirming receipt.\n> another old line";
    expect(cleanEmailBody(body)).toBe("Thanks, confirming receipt.");
  });

  it("strips a signature after the -- delimiter", () => {
    const body = "See you then!\n-- \nSarah Lee\nTalent Partner, Acme";
    expect(cleanEmailBody(body)).toBe("See you then!");
  });

  it("strips 'Sent from my iPhone' style signatures", () => {
    const body = "Yes that works.\n\nSent from my iPhone";
    expect(cleanEmailBody(body)).toBe("Yes that works.");
  });

  it("handles forwarded-message markers", () => {
    const body = "FYI, see below.\n---------- Forwarded message ----------\nFrom: someone@x.com";
    expect(cleanEmailBody(body)).toBe("FYI, see below.");
  });

  it("falls back to the raw body when cleaning removes everything", () => {
    const body = "> the whole email is one quote\n> nothing new here";
    expect(cleanEmailBody(body)).toBe(body.trim());
  });

  it("normalizes CRLF and collapses excessive blank lines", () => {
    const body = "Line one\r\n\r\n\r\n\r\nLine two";
    expect(cleanEmailBody(body)).toBe("Line one\n\nLine two");
  });
});

describe("parseAddress", () => {
  it("extracts name and email from 'Name <email>' format", () => {
    expect(parseAddress("Sarah Lee <sarah@acme.com>")).toEqual({
      name: "Sarah Lee",
      email: "sarah@acme.com",
    });
  });

  it("handles quoted display names", () => {
    expect(parseAddress('"Lee, Sarah" <sarah@acme.com>')).toEqual({
      name: "Lee, Sarah",
      email: "sarah@acme.com",
    });
  });

  it("returns null name for a bare address", () => {
    expect(parseAddress("sarah@acme.com")).toEqual({ name: null, email: "sarah@acme.com" });
  });
});

describe("truncateBody", () => {
  it("leaves short bodies alone", () => {
    expect(truncateBody("short")).toBe("short");
  });

  it("truncates long bodies with a marker", () => {
    const long = "a".repeat(25_000);
    const result = truncateBody(long);
    expect(result.length).toBeLessThan(21_000);
    expect(result).toContain("[truncated — original was 25000 characters]");
  });
});
