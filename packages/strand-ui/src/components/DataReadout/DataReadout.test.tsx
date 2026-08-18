import { resolve } from "node:path";
import { snapshotFixtures } from "../../test/snapshot.js";
import { snapshotStylesheet } from "../../test/stylesheet.js";
import { DataReadout } from "./DataReadout.js";
import { fixtures } from "./DataReadout.fixtures.js";

snapshotFixtures(DataReadout, fixtures);

snapshotStylesheet(resolve(__dirname, "./DataReadout.css"));
