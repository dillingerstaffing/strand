import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "image", props: { src: "/a.png", alt: "Ada" } },
  { name: "initials md", props: { initials: "ab" } },
  { name: "initials sm", props: { initials: "Ada Lovelace", size: "sm" } },
  { name: "initials lg", props: { initials: "AL", size: "lg" } },
  { name: "initials xl", props: { initials: "AL", size: "xl" } },
  { name: "empty", props: {  } },
];
