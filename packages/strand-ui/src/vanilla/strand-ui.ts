/*! Strand UI Vanilla Runtime | MIT License | dillingerstaffing.com */
//
// Pair this script with <link href="strand-ui.css"> on every HTML page
// that uses Strand components without a framework (Preact/Vue/Svelte).
// The runtime enhances static HTML with interactive behaviors that
// framework components handle internally.
//
// Currently registered:
//   - CodeBlock: copy-to-clipboard button on .strand-code-block__pre
//   - Nav: hamburger toggle on .strand-nav__hamburger
//   - Nav: glass nav :has() fallback (body.strand-glass-nav-active)
//   - Banner: :has() fallback (body.strand-banner-active)
//   - Tabs: click-to-switch + keyboard nav on [role="tablist"]
//
// CSP: no inline code, no eval, no external imports.

(() => {
	// ════════════════════════════════════════════════════════════════════
	// CodeBlock: copy-to-clipboard
	// ════════════════════════════════════════════════════════════════════

	const SELECTOR_PRE = ".strand-code-block__pre";
	const WRAPPER_CLASS = "strand-code-block";
	const BUTTON_CLASS = "strand-code-block__copy";
	const COPIED_CLASS = "strand-code-block__copy--copied";
	const WRAPPER_ATTR = "data-strand-copy";
	const LABEL_DEFAULT = "Copy code to clipboard";
	const LABEL_COPIED = "Copied";
	const SUCCESS_DURATION_MS = 1500;

	function buildIcon(variant: string, pathD: string): SVGSVGElement {
		const svgNS = "http://www.w3.org/2000/svg";
		const svg = document.createElementNS(svgNS, "svg");
		svg.setAttribute(
			"class",
			`strand-code-block__copy-icon strand-code-block__copy-icon--${variant}`,
		);
		svg.setAttribute("viewBox", "0 0 16 16");
		svg.setAttribute("fill", "none");
		svg.setAttribute("stroke", "currentColor");
		svg.setAttribute("stroke-width", "1.75");
		svg.setAttribute("stroke-linecap", "round");
		svg.setAttribute("stroke-linejoin", "round");
		svg.setAttribute("aria-hidden", "true");
		svg.setAttribute("focusable", "false");
		const path = document.createElementNS(svgNS, "path");
		path.setAttribute("d", pathD);
		svg.appendChild(path);
		return svg;
	}

	function buildClipboardIcon(): SVGSVGElement {
		return buildIcon(
			"clipboard",
			"M5 2.5h4.5L12 5v8.5a.5.5 0 0 1-.5.5H5a.5.5 0 0 1-.5-.5V3a.5.5 0 0 1 .5-.5z M9 2.5V5h3",
		);
	}

	function buildCheckIcon(): SVGSVGElement {
		return buildIcon("check", "M3.5 8.5l3 3 6-6.5");
	}

	function buildCopyButton(): HTMLButtonElement {
		const btn = document.createElement("button");
		btn.type = "button";
		btn.className = BUTTON_CLASS;
		btn.setAttribute("aria-label", LABEL_DEFAULT);
		btn.appendChild(buildClipboardIcon());
		btn.appendChild(buildCheckIcon());
		return btn;
	}

	async function copyText(text: string): Promise<boolean> {
		if (navigator.clipboard && window.isSecureContext) {
			try {
				await navigator.clipboard.writeText(text);
				return true;
			} catch {
				// Fall through to legacy path.
			}
		}
		try {
			const ta = document.createElement("textarea");
			ta.value = text;
			ta.setAttribute("readonly", "");
			ta.style.position = "absolute";
			ta.style.left = "-9999px";
			document.body.appendChild(ta);
			ta.select();
			const ok = document.execCommand("copy");
			document.body.removeChild(ta);
			return ok;
		} catch {
			return false;
		}
	}

	function attachCopyButton(pre: Element): void {
		if (!pre || pre.nodeType !== 1) return;

		let wrapper = pre.parentElement;
		if (!wrapper || !wrapper.classList.contains(WRAPPER_CLASS)) {
			const newWrapper = document.createElement("div");
			newWrapper.className = WRAPPER_CLASS;
			pre.parentNode?.insertBefore(newWrapper, pre);
			newWrapper.appendChild(pre);
			wrapper = newWrapper;
		}

		if (wrapper.querySelector(`.${BUTTON_CLASS}`)) return;

		const btn = buildCopyButton();
		let resetTimer = 0;

		btn.addEventListener("click", async () => {
			const code = pre.textContent || "";
			const ok = await copyText(code);
			if (!ok) return;

			btn.classList.add(COPIED_CLASS);
			btn.setAttribute("aria-label", LABEL_COPIED);

			if (resetTimer) {
				clearTimeout(resetTimer);
			}
			resetTimer = window.setTimeout(() => {
				btn.classList.remove(COPIED_CLASS);
				btn.setAttribute("aria-label", LABEL_DEFAULT);
				resetTimer = 0;
			}, SUCCESS_DURATION_MS);
		});

		wrapper.appendChild(btn);
		wrapper.setAttribute(WRAPPER_ATTR, "");
	}

	// ════════════════════════════════════════════════════════════════════
	// Nav: mobile menu toggle
	// ════════════════════════════════════════════════════════════════════

	const NAV_WIRED_ATTR = "data-strand-nav-wired";
	const NAV_OPEN_CLASS = "strand-nav__mobile-menu--open";

	function attachNav(navEl: Element): void {
		if (!navEl || navEl.nodeType !== 1) return;
		const btn = navEl.querySelector(".strand-nav__hamburger") as HTMLElement | null;
		const menu = navEl.querySelector(".strand-nav__mobile-menu") as HTMLElement | null;
		if (!btn || !menu) return;
		if (btn.getAttribute(NAV_WIRED_ATTR) === "true") return;
		btn.setAttribute(NAV_WIRED_ATTR, "true");

		function closeMenu(): void {
			menu!.classList.remove(NAV_OPEN_CLASS);
			btn!.setAttribute("aria-expanded", "false");
		}

		btn.addEventListener("click", () => {
			const open = menu!.classList.toggle(NAV_OPEN_CLASS);
			btn!.setAttribute("aria-expanded", String(open));
		});

		for (const a of menu.querySelectorAll("a")) {
			a.addEventListener("click", closeMenu);
		}

		document.addEventListener("keydown", (e: KeyboardEvent) => {
			if (e.key === "Escape" && menu!.classList.contains(NAV_OPEN_CLASS)) {
				closeMenu();
				btn!.focus();
			}
		});
	}

	// ════════════════════════════════════════════════════════════════════
	// Nav + Banner: :has() cross-browser fallback
	// ════════════════════════════════════════════════════════════════════

	const HAS_SUPPORT = typeof CSS !== "undefined"
		&& typeof CSS.supports === "function"
		&& CSS.supports("selector(:has(*))");

	function attachHasFallback(): void {
		if (HAS_SUPPORT) return;

		if (document.querySelector(".strand-nav--glass")) {
			document.body.classList.add("strand-glass-nav-active");
		}
		if (document.querySelector(".strand-banner")) {
			document.body.classList.add("strand-banner-active");
		}
	}

	// ════════════════════════════════════════════════════════════════════
	// Tabs: vanilla click-to-switch + keyboard navigation
	// ════════════════════════════════════════════════════════════════════

	const TABS_WIRED_ATTR = "data-strand-tabs-wired";

	function attachTabs(tabsEl: Element): void {
		const tablist = tabsEl.querySelector("[role='tablist']") as HTMLElement | null;
		if (!tablist) return;
		if (tablist.getAttribute(TABS_WIRED_ATTR) === "true") return;
		tablist.setAttribute(TABS_WIRED_ATTR, "true");

		const tabs = Array.from(tablist.querySelectorAll("[role='tab']")) as HTMLElement[];
		if (tabs.length === 0) return;

		function activateTab(tab: HTMLElement): void {
			const panelId = tab.getAttribute("aria-controls");

			for (const t of tabs) {
				const isActive = t === tab;
				t.setAttribute("aria-selected", String(isActive));
				t.classList.toggle("strand-tabs__tab--active", isActive);
				t.tabIndex = isActive ? 0 : -1;

				const pId = t.getAttribute("aria-controls");
				if (pId) {
					const panel = tabsEl.querySelector(`#${pId}`) as HTMLElement | null;
					if (panel) panel.hidden = !isActive;
				}
			}

			if (panelId) {
				const activePanel = tabsEl.querySelector(`#${panelId}`) as HTMLElement | null;
				if (activePanel) activePanel.hidden = false;
			}
		}

		for (const tab of tabs) {
			tab.addEventListener("click", () => activateTab(tab));
		}

		tablist.addEventListener("keydown", (e: KeyboardEvent) => {
			const current = tabs.findIndex((t) => t.getAttribute("aria-selected") === "true");
			let next: number | null = null;

			switch (e.key) {
				case "ArrowRight":
					next = (current + 1) % tabs.length;
					break;
				case "ArrowLeft":
					next = (current - 1 + tabs.length) % tabs.length;
					break;
				case "Home":
					next = 0;
					break;
				case "End":
					next = tabs.length - 1;
					break;
				default:
					return;
			}

			e.preventDefault();
			activateTab(tabs[next]);
			tabs[next].focus();
		});
	}

	// ════════════════════════════════════════════════════════════════════
	// Public entry point
	// ════════════════════════════════════════════════════════════════════

	function attachAll(root?: Element | Document | null): void {
		const scope = root || document;

		// CodeBlock copy buttons
		const pres = scope.querySelectorAll(SELECTOR_PRE);
		for (const pre of pres) {
			attachCopyButton(pre);
		}

		// Nav mobile menus
		const navs = scope.querySelectorAll("nav.strand-nav");
		for (const nav of navs) {
			attachNav(nav);
		}

		// :has() fallback (only runs once, on document scope)
		if (!root || root === document) {
			attachHasFallback();
		}

		// Tabs vanilla enhancement
		const tabContainers = scope.querySelectorAll(".strand-tabs");
		for (const tc of tabContainers) {
			attachTabs(tc);
		}
	}

	// Auto-init on DOMContentLoaded or immediately if already parsed.
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", () => attachAll());
	} else {
		attachAll();
	}

	// Expose for dynamic re-scans and backward compatibility.
	(window as any).strandUI = { attach: attachAll };
	(window as any).strandCopyButtons = { attach: attachAll };
})();
