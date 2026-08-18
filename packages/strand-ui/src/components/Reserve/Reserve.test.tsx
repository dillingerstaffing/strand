import { resolve } from "node:path";
import { snapshotFixtures } from "../../test/snapshot.js";
import { snapshotStylesheet } from "../../test/stylesheet.js";
import { Reserve } from "./Reserve.js";
import { fixtures } from "./Reserve.fixtures.js";

snapshotFixtures(Reserve, fixtures);

snapshotStylesheet(resolve(__dirname, "./Reserve.css"));
