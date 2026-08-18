import { resolve } from "node:path";
import { snapshotFixtures } from "../../test/snapshot.js";
import { snapshotStylesheet } from "../../test/stylesheet.js";
import { Container } from "./Container.js";
import { fixtures } from "./Container.fixtures.js";

snapshotFixtures(Container, fixtures);

snapshotStylesheet(resolve(__dirname, "./Container.css"));
