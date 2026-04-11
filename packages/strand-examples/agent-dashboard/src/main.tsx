import "@dillingerstaffing/strand/css/tokens.css";
import "@dillingerstaffing/strand/css/reset.css";
import "@dillingerstaffing/strand/css/base.css";
import "@dillingerstaffing/strand-ui/css/strand-ui.css";

import { render } from "preact";
import { App } from "./App";

const root = document.getElementById("app");
if (root) render(<App />, root);
