import { resolve } from "node:path";
import { snapshotFixtures } from "../../test/snapshot.js";
import { snapshotStylesheet } from "../../test/stylesheet.js";
import { Progress } from "./Progress.js";
import { fixtures } from "./Progress.fixtures.js";

snapshotFixtures(Progress, fixtures);

snapshotStylesheet(resolve(__dirname, "./Progress.css"));
