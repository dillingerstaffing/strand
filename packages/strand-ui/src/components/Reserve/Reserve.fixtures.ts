import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "pending", props: { placeholder: "..." }, children: "content" },
  { name: "ready with heights", props: { ready: true, height: "42px", heightMd: "60px", heightLg: "80px", placeholder: "..." }, children: "content" },
  { name: "empty", props: { ready: true, empty: true, placeholder: "..." }, children: "content" },
];
