import { resolve } from "node:path";
import { snapshotFixtures } from "../../test/snapshot.js";
import { snapshotStylesheet } from "../../test/stylesheet.js";
import { Divider } from "./Divider.js";
import { fixtures } from "./Divider.fixtures.js";

snapshotFixtures(Divider, fixtures);

snapshotStylesheet(resolve(__dirname, "./Divider.css"));
