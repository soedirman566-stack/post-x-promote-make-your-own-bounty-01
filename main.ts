// Entry program for make.fun's post-x-promote-make-your-own-bounty-01.
//
// The entry itself is a post on X; this program's whole job is to hand the
// grader the address of that post by copying POST.json from the bot
// directory into the output directory, byte for byte, so the house reads
// exactly the file this repository ships.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const botDir: string = resolve(process.env.MAKEFUN_BOT_DIR ?? ".");
const outputDir: string = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "out");

const source: string = join(botDir, "POST.json");
const target: string = join(outputDir, "POST.json");

// Read the shipped bytes once and check they parse as the small JSON object
// the grader expects, so a malformed POST.json fails here, in the open,
// rather than at grading time.
const bytes: Buffer = readFileSync(source);
const parsed: unknown = JSON.parse(bytes.toString("utf8"));
if (
  typeof parsed !== "object" ||
  parsed === null ||
  typeof (parsed as { url?: unknown }).url !== "string"
) {
  throw new Error("POST.json must be a JSON object with a string url");
}

mkdirSync(outputDir, { recursive: true });
writeFileSync(target, bytes);

// Read the copy back: the two runs of this entry, and every run, must leave
// the same bytes the repository ships.
if (!readFileSync(target).equals(bytes)) {
  throw new Error("copied POST.json differs from the repository's");
}
