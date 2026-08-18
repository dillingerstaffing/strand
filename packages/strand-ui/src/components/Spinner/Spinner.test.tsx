import { resolve } from "node:path";
import { snapshotFixtures } from "../../test/snapshot.js";
import { snapshotStylesheet } from "../../test/stylesheet.js";
import { Spinner } from "./Spinner.js";
import { fixtures } from "./Spinner.fixtures.js";

snapshotFixtures(Spinner, fixtures);

snapshotStylesheet(resolve(__dirname, "./Spinner.css"));
