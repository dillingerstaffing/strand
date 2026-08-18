import { resolve } from "node:path";
import { snapshotFixtures } from "../../test/snapshot.js";
import { snapshotStylesheet } from "../../test/stylesheet.js";
import { Skeleton } from "./Skeleton.js";
import { fixtures } from "./Skeleton.fixtures.js";

snapshotFixtures(Skeleton, fixtures);

snapshotStylesheet(resolve(__dirname, "./Skeleton.css"));
