import { resolve } from "node:path";
import { snapshotFixtures } from "../../test/snapshot.js";
import { snapshotStylesheet } from "../../test/stylesheet.js";
import { BigMonoTime } from "./BigMonoTime.js";
import { fixtures } from "./BigMonoTime.fixtures.js";

snapshotFixtures(BigMonoTime, fixtures);

snapshotStylesheet(resolve(__dirname, "./BigMonoTime.css"));
