import { resolve } from "node:path";
import { snapshotFixtures } from "../../test/snapshot.js";
import { snapshotStylesheet } from "../../test/stylesheet.js";
import { Breadcrumb } from "./Breadcrumb.js";
import { fixtures } from "./Breadcrumb.fixtures.js";

snapshotFixtures(Breadcrumb, fixtures);

snapshotStylesheet(resolve(__dirname, "./Breadcrumb.css"));
