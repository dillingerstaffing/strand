import { resolve } from "node:path";
import { snapshotFixtures } from "../../test/snapshot.js";
import { snapshotStylesheet } from "../../test/stylesheet.js";
import { Link } from "./Link.js";
import { fixtures } from "./Link.fixtures.js";

snapshotFixtures(Link, fixtures);

snapshotStylesheet(resolve(__dirname, "./Link.css"));
