import { resolve } from "node:path";
import { snapshotFixtures } from "../../test/snapshot.js";
import { snapshotStylesheet } from "../../test/stylesheet.js";
import { AppShell } from "./AppShell.js";
import { fixtures } from "./AppShell.fixtures.js";

snapshotFixtures(AppShell, fixtures);

snapshotStylesheet(resolve(__dirname, "./AppShell.css"));
