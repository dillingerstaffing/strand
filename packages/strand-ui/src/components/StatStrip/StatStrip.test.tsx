import { resolve } from "node:path";
import { snapshotFixtures } from "../../test/snapshot.js";
import { snapshotStylesheet } from "../../test/stylesheet.js";
import { StatStrip } from "./StatStrip.js";
import { fixtures } from "./StatStrip.fixtures.js";

snapshotFixtures(StatStrip, fixtures);

snapshotStylesheet(resolve(__dirname, "./StatStrip.css"));
