import { resolve } from "node:path";
import { snapshotStylesheet } from "../../test/stylesheet.js";

snapshotStylesheet(resolve(__dirname, "./ChannelGrid.css"));
