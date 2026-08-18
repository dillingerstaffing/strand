import { resolve } from "node:path";
import { snapshotFixtures } from "../../test/snapshot.js";
import { snapshotStylesheet } from "../../test/stylesheet.js";
import { CardSection } from "./CardSection.js";
import { fixtures } from "./CardSection.fixtures.js";

snapshotFixtures(CardSection, fixtures);

snapshotStylesheet(resolve(__dirname, "./CardSection.css"));
