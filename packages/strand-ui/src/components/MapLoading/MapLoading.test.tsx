import { resolve } from "node:path";
import { snapshotFixtures } from "../../test/snapshot.js";
import { snapshotStylesheet } from "../../test/stylesheet.js";
import { MapLoading } from "./MapLoading.js";
import { fixtures } from "./MapLoading.fixtures.js";

snapshotFixtures(MapLoading, fixtures);

snapshotStylesheet(resolve(__dirname, "./MapLoading.css"));
