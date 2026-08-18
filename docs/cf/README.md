# Invariants

One file per invariant: a constraint on how the code must behave, stated in prose because no assertion can carry it. Code points at an article with a one-line comment, `// cf: <slug>` in TypeScript or `/* cf: <slug> */` in CSS, instead of restating the reasoning. `pnpm cf-check` fails on a pointer with no article and on an article no code points at.

Format:

```
# <Title>

<The invariant, in one paragraph. What must stay true, and the one fact that makes it so.>

Where: <files or components it protects>
```
