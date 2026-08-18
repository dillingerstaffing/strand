import { snapshotStylesheet } from "../../test/stylesheet.js";
import { resolve } from "node:path";

snapshotStylesheet(resolve(__dirname, "./Banner.css"));
