import { resolve } from "node:path";
import { snapshotFixtures } from "../../test/snapshot.js";
import { snapshotStylesheet } from "../../test/stylesheet.js";
import { KvEditorial } from "./KvEditorial.js";
import { fixtures } from "./KvEditorial.fixtures.js";

snapshotFixtures(KvEditorial, fixtures);

snapshotStylesheet(resolve(__dirname, "./KvEditorial.css"));
