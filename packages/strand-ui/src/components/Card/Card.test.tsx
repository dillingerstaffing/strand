import { resolve } from "node:path";
import { snapshotFixtures } from "../../test/snapshot.js";
import { snapshotStylesheet } from "../../test/stylesheet.js";
import { Card } from "./Card.js";
import { fixtures } from "./Card.fixtures.js";

snapshotFixtures(Card, fixtures);

snapshotStylesheet(resolve(__dirname, "./Card.css"));
