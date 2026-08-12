#!/usr/bin/env node
// Layout check: the browser tier.
//
// Every other test in this repository runs in jsdom, which does not lay out.
// Measured directly: a region with a declared 42px floor reports offsetHeight
// 0, an element with a literal `min-block-size: 42px` also reports 0, computed
// style returns `var(--strand-reserve-h, auto)` unresolved, and matchMedia is
// not a function. So no test here could distinguish `visibility: hidden` from
// `display: none` by height, which is precisely how the Reserve primitive
// shipped at 0.32.0 with a region that never collapsed. The library learned
// about its own layout bug from a consumer. See docs/testing-tiers.md.
//
// This check renders the CLASS LAYER against the BUILT stylesheet in real
// Chromium and measures the resulting boxes. It tests the classes rather than
// the Preact components on purpose: the class layer is the primitive and every
// framework wrapper is a thin wrapper over exactly those classes (a claim
// `pnpm test:parity` enforces separately), so one browser boot covers all eight
// consumer types.
//
// It is not visual regression. There are no baselines and no pixel diffs. Each
// case states a numeric contract and a failure prints the measured number
// beside the expected one.
//
// Usage: pnpm test:layout

import { glob, readFile, stat } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, "..");
const CSS_PATH = resolve(REPO_ROOT, "packages/strand-ui/dist/css/strand-ui.css");
// The tokens the component CSS is written against. Without them every
// `var(--strand-*)` in a measured rule resolves to nothing, so the fixture
// renders the library's declarations against undefined values and measures a
// fallback. It went unnoticed because most cases assert a relationship
// (equal heights, equal widths) that survives the substitution, or a literal
// px value that never needed a token. It surfaced the first time a case
// depended on a token for a POSITION: `.strand-sticky` sets
// `inset-block-start: var(--strand-space-6)`, which resolved to nothing, and
// `position: sticky` with no offset behaves like `position: relative`. The
// primitive was correct and the harness was measuring it without its tokens.
const TOKENS_PATH = resolve(REPO_ROOT, "packages/tokens/css/tokens.css");

// Subpixel noise is layout reality, not a defect. A whole pixel is a real
// shift, so the tolerance sits below one and above rounding.
const TOLERANCE_PX = 0.5;

// ── The cases ──
//
// A primitive earns a case only when its reason for existing is a statement
// about space. Most primitives make no such promise and belong in the static
// or jsdom tiers, which are far cheaper.

const RESERVE_MARKUP = (state, extra = "") => `
	<div id="region" class="strand-reserve" data-strand-reserve="${state}" ${extra}>
		<div class="strand-reserve__placeholder" aria-hidden="true">
			<div style="block-size: 42px">placeholder</div>
		</div>
		<div class="strand-reserve__content"></div>
	</div>`;

export const LAYOUT_CASES = [
	{
		name: "empty state collapses to nothing",
		primitive: "Reserve",
		// The gap #63 regression. Before 0.33.0 the empty state hid the
		// placeholder with visibility, which preserves layout, so a region whose
		// content resolved to nothing held the placeholder's height forever.
		// No layout-shift score can see this, because nothing moves.
		viewport: { width: 390, height: 844 },
		html: RESERVE_MARKUP("empty"),
		measure: { region: "#region" },
		expect: [{ of: "region", blockSize: 0 }],
	},
	{
		name: "pending state holds the box the content will need",
		primitive: "Reserve",
		viewport: { width: 390, height: 844 },
		html: RESERVE_MARKUP("pending"),
		measure: { region: "#region" },
		expect: [{ of: "region", blockSizeAtLeast: 42 }],
	},
	{
		name: "the placeholder to content swap cannot move the page",
		primitive: "Reserve",
		// The whole reason the primitive exists. Both layers share one grid
		// cell, so pending and ready must measure identically.
		viewport: { width: 390, height: 844 },
		html: `
			${RESERVE_MARKUP("pending").replace(/id="region"/, 'id="pending"')}
			<div id="ready" class="strand-reserve" data-strand-reserve="ready">
				<div class="strand-reserve__placeholder" aria-hidden="true">
					<div style="block-size: 42px">placeholder</div>
				</div>
				<div class="strand-reserve__content">
					<div style="block-size: 42px">real content</div>
				</div>
			</div>`,
		measure: { pending: "#pending", ready: "#ready" },
		expect: [{ of: "pending", equals: "ready" }],
	},
	{
		name: "a declared floor is honoured when the placeholder is shorter",
		primitive: "Reserve",
		viewport: { width: 390, height: 844 },
		html: `
			<div id="region" class="strand-reserve" data-strand-reserve="pending"
			     style="--strand-reserve-h: 180px">
				<div class="strand-reserve__placeholder" aria-hidden="true">
					<div style="block-size: 20px">short</div>
				</div>
				<div class="strand-reserve__content"></div>
			</div>`,
		measure: { region: "#region" },
		expect: [{ of: "region", blockSizeAtLeast: 180 }],
	},
	{
		name: "no floor declared invents no reservation",
		primitive: "Reserve",
		// Unset must mean "no floor". Defaulting to a number would invent a
		// reservation nobody asked for, and would hide a mis-sized placeholder.
		viewport: { width: 390, height: 844 },
		html: `
			<div id="region" class="strand-reserve" data-strand-reserve="pending">
				<div class="strand-reserve__placeholder" aria-hidden="true">
					<div style="block-size: 20px">short</div>
				</div>
				<div class="strand-reserve__content"></div>
			</div>`,
		measure: { region: "#region" },
		expect: [{ of: "region", blockSizeAtMost: 20 }],
	},
	{
		name: "the base floor still applies below the md breakpoint",
		primitive: "Reserve",
		viewport: { width: 390, height: 844 },
		html: RESERVE_MARKUP(
			"pending",
			'style="--strand-reserve-h: 120px; --strand-reserve-h-md: 200px"',
		),
		measure: { region: "#region" },
		expect: [{ of: "region", blockSizeAtMost: 120 }],
	},
	{
		name: "the md floor takes over at 768 and above",
		primitive: "Reserve",
		// The per-breakpoint fallback chain. jsdom cannot evaluate this at all:
		// matchMedia is absent and innerWidth is a fixed 1024 meaning nothing.
		viewport: { width: 768, height: 800 },
		html: RESERVE_MARKUP(
			"pending",
			'style="--strand-reserve-h: 120px; --strand-reserve-h-md: 200px"',
		),
		measure: { region: "#region" },
		expect: [{ of: "region", blockSizeAtLeast: 200 }],
	},
	{
		name: "the md floor keeps holding at lg when no lg floor is given",
		primitive: "Reserve",
		// Each step falls back to the one below, so setting only the base or
		// only md must hold at every width above it.
		viewport: { width: 1024, height: 800 },
		html: RESERVE_MARKUP(
			"pending",
			'style="--strand-reserve-h: 120px; --strand-reserve-h-md: 200px"',
		),
		measure: { region: "#region" },
		expect: [{ of: "region", blockSizeAtLeast: 200 }],
	},
	{
		name: "no state attribute degrades to a plain wrapper showing content",
		primitive: "Reserve",
		// A server-rendered consumer that never flips the attribute must get the
		// content, not a blank region and not a doubled height.
		viewport: { width: 1024, height: 800 },
		html: `
			<div id="region" class="strand-reserve">
				<div class="strand-reserve__placeholder" aria-hidden="true">
					<div style="block-size: 42px">placeholder</div>
				</div>
				<div class="strand-reserve__content">
					<div style="block-size: 30px">real content</div>
				</div>
			</div>`,
		measure: { region: "#region" },
		expect: [{ of: "region", blockSizeAtMost: 30 }],
	},
	{
		name: "settle does not change the box it fades",
		primitive: "Settle",
		// The boundary between the two motion-adjacent primitives, asserted as
		// a number rather than left to a paragraph in 6.9. Reserve owns the
		// BOX; Settle owns the MOMENT. Right now nothing but the absence of
		// sizing declarations stops a future edit from adding a height here to
		// "fix" a jumpy consumer, and neither jsdom nor the motion tier would
		// notice: jsdom does not lay out, and document.getAnimations() reports
		// what animated, not what it measured.
		//
		// Same shape as the Reserve pending-vs-ready case above. Identical
		// content, one carrying the class and one not, asserted to occupy the
		// same box. If Settle ever declares padding, a min-height, a display
		// change or a transform that affects layout, this is what fails.
		viewport: { width: 390, height: 844 },
		html: `
			<div style="inline-size: 300px">
				<span id="bare">7 people</span>
			</div>
			<div style="inline-size: 300px">
				<span id="settled" class="strand-settle">7 people</span>
			</div>`,
		measure: { bare: "#bare", settled: "#settled" },
		expect: [{ of: "settled", equals: "bare" }],
	},

	// ── ActionDock ──
	//
	// Every claim this primitive makes is POSITIONAL, which is why the
	// position family exists at all. A size assertion here would be a proxy:
	// a dock of the right height sitting in the wrong place passes it.
	//
	// The thumb zone is the bottom third of the viewport, so at 844px it
	// starts at 2/3 * 844 = 562.67.
	{
		name: "the primary action lands in the thumb zone",
		primitive: "ActionDock",
		// Measures the BUTTON, not the dock. A tall dock could satisfy a
		// dock-level assertion while the control it carries sat above the
		// band, and the contract is about where the thing you press ends up.
		viewport: { width: 390, height: 844 },
		html: `
			<div style="block-size: 3000px"></div>
			<div id="dock" class="strand-actiondock" data-strand-actiondock="visible">
				<button id="action" class="strand-btn strand-btn--primary" type="button">RSVP</button>
			</div>`,
		measure: { action: "#action" },
		// BOTH bounds, and the second one is not decoration. A negative
		// control with position:absolute put the control at blockStart 3000,
		// which satisfies "at least 562.67" while being nowhere near the
		// screen. "Below the thumb zone's start" and "in the thumb zone" are
		// different claims and only the pair expresses the second.
		expect: [
			{ of: "action", blockStartAtLeast: 562.67 },
			{ of: "action", blockEndAtMost: 844 },
		],
	},
	{
		name: "the dock holds its position while the document scrolls",
		primitive: "ActionDock",
		// The property that justifies a viewport-anchored region over simply
		// moving the control down the document. A document-position fix
		// answers the reach question at exactly one scroll offset; this
		// answers it at every offset. An absolute-positioned impostor lands
		// at blockStart -1220 here and fails.
		viewport: { width: 390, height: 844 },
		scroll: { y: 2000 },
		html: `
			<div style="block-size: 3000px"></div>
			<div id="dock" class="strand-actiondock" data-strand-actiondock="visible">
				<button id="action" class="strand-btn strand-btn--primary" type="button">RSVP</button>
			</div>`,
		measure: { action: "#action" },
		expect: [
			{ of: "action", blockStartAtLeast: 562.67 },
			{ of: "action", blockEndAtMost: 844 },
		],
	},
	{
		name: "a hidden dock is entirely outside the viewport",
		primitive: "ActionDock",
		// Why translateY(100%) rather than opacity: a faded dock still covers
		// the content beneath it. This is what lets a consumer keep the dock
		// mounted while the real control is on screen without occluding it.
		viewport: { width: 390, height: 844 },
		html: `
			<div id="dock" class="strand-actiondock" data-strand-actiondock="hidden">
				<button class="strand-btn strand-btn--primary" type="button">RSVP</button>
			</div>`,
		measure: { dock: "#dock" },
		expect: [{ of: "dock", blockStartAtLeast: 844 }],
	},
	{
		name: "the dock ends at the viewport's bottom edge",
		primitive: "ActionDock",
		// The safe-area inset growing padding-block-end is the single most
		// likely way this primitive breaks, and it would push the control
		// off the bottom rather than merely resize the box. Headless
		// Chromium resolves the inset to 0, so this pins the non-inset
		// geometry; the inset case needs a device context the layout tier
		// does not have yet and is deliberately NOT approximated here.
		viewport: { width: 390, height: 844 },
		html: `
			<div id="dock" class="strand-actiondock" data-strand-actiondock="visible">
				<button class="strand-btn strand-btn--primary" type="button">RSVP</button>
			</div>`,
		measure: { dock: "#dock" },
		expect: [{ of: "dock", blockEndAtMost: 844 }],
	},
	{
		name: "the tab bar sits in the thumb zone",
		primitive: "TabBar",
		// 19.1.1's whole argument, measured rather than asserted. The
		// condition exists because a hamburger pins every destination in
		// 14.8's hard band; if the replacement did not actually land in the
		// easy band the amendment would be buying nothing. Both bounds, per
		// the ActionDock lesson: "below the zone's start" and "in the zone"
		// are different claims and only a pair expresses the second.
		viewport: { width: 390, height: 844 },
		html: `
			<div style="block-size: 3000px"></div>
			<nav id="bar" class="strand-tabbar" aria-label="Primary">
				<a id="first" class="strand-tabbar__item" href="/a" aria-current="page">
					<span class="strand-tabbar__label">Discover</span>
				</a>
				<a class="strand-tabbar__item" href="/b"><span class="strand-tabbar__label">Calendar</span></a>
				<a class="strand-tabbar__item" href="/c"><span class="strand-tabbar__label">People</span></a>
			</nav>`,
		measure: { first: "#first" },
		expect: [
			{ of: "first", blockStartAtLeast: 562.67 },
			{ of: "first", blockEndAtMost: 844 },
		],
	},
	{
		name: "the tab bar holds its position while the document scrolls",
		primitive: "TabBar",
		// Fixed rather than sticky. A sticky bar stops at its scroll
		// container's end, which is exactly where a reader arrives after a
		// long list -- the moment they are most likely to navigate away.
		viewport: { width: 390, height: 844 },
		scroll: { y: 2000 },
		html: `
			<div style="block-size: 3000px"></div>
			<nav id="bar" class="strand-tabbar" aria-label="Primary">
				<a id="first" class="strand-tabbar__item" href="/a"><span class="strand-tabbar__label">Discover</span></a>
				<a class="strand-tabbar__item" href="/b"><span class="strand-tabbar__label">Calendar</span></a>
			</nav>`,
		measure: { first: "#first" },
		expect: [
			{ of: "first", blockStartAtLeast: 562.67 },
			{ of: "first", blockEndAtMost: 844 },
		],
	},
	{
		name: "every tab bar destination clears the 44px touch floor",
		primitive: "TabBar",
		// 14.7, measured on the ITEM rather than assumed from the bar's
		// height: the bar can be tall while its items are not, if padding
		// eats the difference. Five destinations at 320px is the tightest
		// case 19.1.1's count rule permits, so it is the one worth pinning.
		viewport: { width: 320, height: 844 },
		html: `
			<nav class="strand-tabbar" aria-label="Primary">
				<a id="item" class="strand-tabbar__item" href="/a"><span class="strand-tabbar__label">Discover</span></a>
				<a class="strand-tabbar__item" href="/b"><span class="strand-tabbar__label">Calendar</span></a>
				<a class="strand-tabbar__item" href="/c"><span class="strand-tabbar__label">People</span></a>
				<a class="strand-tabbar__item" href="/d"><span class="strand-tabbar__label">Saved</span></a>
				<a class="strand-tabbar__item" href="/e"><span class="strand-tabbar__label">You</span></a>
			</nav>`,
		measure: { item: "#item" },
		expect: [
			{ of: "item", blockSizeAtLeast: 44 },
			{ of: "item", inlineSizeAtLeast: 44 },
		],
	},
	{
		name: "the tab bar ends at the viewport's bottom edge",
		primitive: "TabBar",
		// The safe-area inset growing padding-block-end is the likeliest way
		// this breaks, and it would push the items off the bottom rather than
		// merely resize the box. Headless Chromium resolves the inset to 0,
		// so this pins the non-inset geometry; the notched case needs a
		// device context the tier does not have and is NOT approximated.
		viewport: { width: 390, height: 844 },
		html: `
			<nav id="bar" class="strand-tabbar" aria-label="Primary">
				<a class="strand-tabbar__item" href="/a"><span class="strand-tabbar__label">Discover</span></a>
			</nav>`,
		measure: { bar: "#bar" },
		expect: [{ of: "bar", blockEndAtMost: 844 }],
	},
	{
		name: "the search trigger is the same box as the search field",
		primitive: "SearchTrigger",
		// The reason the trigger composes the field's classes instead of
		// restating them. If these two ever differ, a header swapping one for
		// the other shifts, and the whole point of sharing the class layer is
		// that they cannot. Measured, because "they share a class" is a claim
		// about source and this is a claim about pixels.
		viewport: { width: 1440, height: 900 },
		html: `
			<form id="field" class="strand-search-field" role="search">
				<input class="strand-search-field__input" type="search" aria-label="Search">
			</form>
			<button id="trigger" type="button" class="strand-search-field strand-search-trigger" aria-haspopup="dialog">
				<span class="strand-search-trigger__label">Search</span>
			</button>`,
		measure: { field: "#field", trigger: "#trigger" },
		expect: [
			{ of: "field", blockSize: 36 },
			{ of: "trigger", blockSize: 36 },
			{ of: "field", inlineSize: 300 },
			{ of: "trigger", inlineSize: 300 },
		],
	},
	{
		name: "a well past its capacity does not grow its row",
		primitive: "CalendarGrid",
		// 10.6's mechanical test, and the only tier that can run it. The
		// obligation is that a cell's height comes from the STRUCTURE, so a
		// day with eight events and a day with none are the same size and
		// the reader can still compare by position. If the content region
		// could expand, one busy day would push every cell beside it down
		// and the plate would stop being a plate.
		viewport: { width: 390, height: 844 },
		html: `
			<div class="strand-calendar-grid" role="grid" aria-label="Test">
				<div class="strand-calendar-grid__week" role="row">
					<div id="empty" class="strand-calendar-grid__day" role="gridcell">
						<span class="strand-calendar-grid__date">1</span>
					</div>
					<div id="full" class="strand-calendar-grid__day" role="gridcell">
						<span class="strand-calendar-grid__date">2</span>
						<div class="strand-calendar-grid__content">
							<div>one</div><div>two</div><div>three</div>
							<div>four</div><div>five</div><div>six</div>
							<div>seven</div><div>eight</div>
						</div>
						<span class="strand-calendar-grid__remainder">+6 more</span>
					</div>
				</div>
			</div>`,
		measure: { empty: "#empty", full: "#full" },
		expect: [{ of: "full", equals: "empty" }],
	},
	{
		name: "every well in a week is the same width",
		primitive: "CalendarGrid",
		// Both axes are semantic (Part XI-B), so the reader identifies a day
		// by its position in the row. A column that widened to fit one long
		// unbroken word would break that, which is why the template is
		// minmax(0, 1fr) rather than 1fr.
		viewport: { width: 390, height: 844 },
		html: `
			<div class="strand-calendar-grid" role="grid" aria-label="Test">
				<div class="strand-calendar-grid__week" role="row">
					<div id="a" class="strand-calendar-grid__day" role="gridcell">
						<span class="strand-calendar-grid__date">1</span>
					</div>
					<div id="b" class="strand-calendar-grid__day" role="gridcell">
						<span class="strand-calendar-grid__date">2</span>
						<div class="strand-calendar-grid__content">
							<div>Supercalifragilisticexpialidocious</div>
						</div>
					</div>
					<div class="strand-calendar-grid__day" role="gridcell"></div>
					<div class="strand-calendar-grid__day" role="gridcell"></div>
					<div class="strand-calendar-grid__day" role="gridcell"></div>
					<div class="strand-calendar-grid__day" role="gridcell"></div>
					<div class="strand-calendar-grid__day" role="gridcell"></div>
				</div>
			</div>`,
		measure: { a: "#a", b: "#b" },
		expect: [{ of: "b", equalsInlineSize: "a" }],
	},
	{
		name: "the sidebar rail is 264px beside a flexible main track",
		primitive: "Grid",
		// The decision the library made three times privately and never
		// published: .strand-ref-shell at 256px, .strand-ref-example at
		// 200px, .strand-ref-taxonomy__list at 160px. The number is the
		// whole primitive, so it is measured rather than asserted in prose.
		viewport: { width: 1280, height: 900 },
		html: `
			<div class="strand-grid strand-grid--sidebar" style="inline-size: 1000px">
				<div id="rail">rail</div>
				<div id="main">main</div>
			</div>`,
		measure: { rail: "#rail", main: "#main" },
		expect: [
			{ of: "rail", inlineSize: 264 },
			// The main track absorbs the remainder rather than being a
			// second fixed thing: 1000 minus the rail and the default gap.
			{ of: "main", inlineSizeAtLeast: 700 },
		],
	},
	{
		name: "a long unbroken string in main does not push the rail off screen",
		primitive: "Grid",
		// Why minmax(0, 1fr) and not a bare 1fr. A bare 1fr floors at the
		// track's min-content width, so one long token widens the whole
		// grid and the rail loses its 264. The base rule's min-width: 0 on
		// CHILDREN does not cover this: that handles the item, this handles
		// the TRACK, and they are different things.
		viewport: { width: 1280, height: 900 },
		html: `
			<div class="strand-grid strand-grid--sidebar" style="inline-size: 1000px">
				<div id="rail">rail</div>
				<div id="main">Supercalifragilisticexpialidociousandthensomemoreletters_______________________</div>
			</div>`,
		measure: { rail: "#rail" },
		expect: [{ of: "rail", inlineSize: 264 }],
	},
	{
		name: "the rail stops being a rail below the md breakpoint",
		primitive: "Grid",
		// A 264px column beside anything at 390px leaves the main track
		// unusable, so the grid becomes one column and the regions stack in
		// source order. Measured at 390 rather than inferred from the
		// media query, which jsdom cannot evaluate at all.
		viewport: { width: 390, height: 844 },
		html: `
			<div class="strand-grid strand-grid--sidebar">
				<div id="rail">rail</div>
				<div id="main">main</div>
			</div>`,
		measure: { rail: "#rail", main: "#main" },
		expect: [{ of: "main", equalsInlineSize: "rail" }],
	},
	{
		name: "a sticky rail holds its offset while the document scrolls",
		primitive: "Sticky",
		// The whole contract. Measured under scroll rather than asserted,
		// because at offset 0 a sticky element and a static one are
		// indistinguishable -- which is exactly how a broken sticky ships.
		viewport: { width: 1280, height: 900 },
		scroll: { y: 1200 },
		html: `
			<div style="display:grid;grid-template-columns:264px minmax(0,1fr);gap:24px">
				<div><div id="rail" class="strand-sticky">rail</div></div>
				<div style="block-size: 4000px">main</div>
			</div>`,
		measure: { rail: "#rail" },
		// space-6 is 24px. A rail that failed to stick would be at -1200.
		expect: [
			{ of: "rail", blockStartAtLeast: 20 },
			{ of: "rail", blockStartAtMost: 28 },
		],
	},
	{
		name: "a sticky rail still holds inside the sidebar grid",
		primitive: "Sticky",
		// The composition its three consumers actually use, and the one
		// that silently breaks: `.strand-grid` clips its children for
		// boundary integrity (10.4), and `overflow: hidden` makes an
		// ancestor the nearest scrollport, so a sticky descendant sticks to
		// a box that never scrolls. `overflow: clip` clips identically and
		// creates no scrollport, which is why the base rule uses it.
		viewport: { width: 1280, height: 900 },
		scroll: { y: 1200 },
		html: `
			<div class="strand-grid strand-grid--sidebar">
				<div><div id="rail" class="strand-sticky">rail</div></div>
				<div style="block-size: 4000px">main</div>
			</div>`,
		measure: { rail: "#rail" },
		expect: [
			{ of: "rail", blockStartAtLeast: 20 },
			{ of: "rail", blockStartAtMost: 28 },
		],
	},
	{
		name: "a scroll row keeps its children at full width instead of wrapping",
		primitive: "ScrollRow",
		// The failure this exists to prevent, at the width it happens: eight
		// chips in a 390px row either wrap to three lines and push the
		// content off screen, or squeeze until their labels are unreadable.
		// Neither is a filter strip.
		viewport: { width: 390, height: 844 },
		html: `
			<div class="strand-scroll-row" style="gap:8px">
				<span id="first" class="strand-tag">All channels</span>
				<span class="strand-tag">Outdoors</span>
				<span class="strand-tag">Making</span>
				<span class="strand-tag">Games</span>
				<span class="strand-tag">Music</span>
				<span class="strand-tag">Food</span>
				<span class="strand-tag">Books</span>
				<span id="last" class="strand-tag">Cycling</span>
			</div>`,
		measure: { first: "#first", last: "#last" },
		// One line: every child shares the first child's block-start. A
		// wrapped row would put the last chip a row lower.
		expect: [{ of: "last", equalsBlockStart: "first" }],
	},
	{
		name: "the split panel is 600px beside a flexible main track",
		primitive: "Grid",
		// Measured against the preset that would otherwise have been used:
		// --cols-2 at 1440 gives 720/720, where the design is 840/600. That
		// is a panel 20% wider and a main track 14% narrower than designed,
		// which reads as a layout choice rather than a defect.
		viewport: { width: 1440, height: 900 },
		html: `
			<div class="strand-grid strand-grid--split" style="inline-size: 1440px; gap: 0">
				<div id="main">main</div>
				<div id="panel">panel</div>
			</div>`,
		measure: { main: "#main", panel: "#panel" },
		expect: [
			{ of: "panel", inlineSize: 600 },
			{ of: "main", inlineSize: 840 },
		],
	},
	{
		name: "the split panel width is driven by its custom property",
		primitive: "Grid",
		// One shape, two consumers, two numbers: 600 for a map and 380 for a
		// commitment rail. A second preset for the second number would be
		// two names for one idea.
		viewport: { width: 1440, height: 900 },
		html: `
			<div class="strand-grid strand-grid--split"
			     style="inline-size: 1440px; gap: 0; --strand-split-panel: 380px">
				<div id="main">main</div>
				<div id="panel">panel</div>
			</div>`,
		measure: { main: "#main", panel: "#panel" },
		expect: [
			{ of: "panel", inlineSize: 380 },
			{ of: "main", inlineSize: 1060 },
		],
	},
	{
		name: "the split panel stops being a panel below the md breakpoint",
		primitive: "Grid",
		viewport: { width: 390, height: 844 },
		html: `
			<div class="strand-grid strand-grid--split">
				<div id="main">main</div>
				<div id="panel">panel</div>
			</div>`,
		measure: { main: "#main", panel: "#panel" },
		expect: [{ of: "panel", equalsInlineSize: "main" }],
	},
	{
		name: "the app shell is bounded by the frame width, not a content measure",
		primitive: "AppShell",
		// The naming risk, as a number: a consumer must not get 1024 when
		// they wanted a frame. 1440 is the frame token; the widest content
		// tier is 1024 and is a reading measure for prose.
		viewport: { width: 1600, height: 900 },
		html: `<div id="shell" class="strand-app-shell"><div>app</div></div>`,
		measure: { shell: "#shell" },
		expect: [{ of: "shell", inlineSize: 1440 }],
	},
	{
		name: "the app shell clips a child wider than itself",
		primitive: "AppShell",
		// The point of the primitive. A nav flush to the top edge overhangs
		// the frame only AT THE CORNERS, which is invisible to a width
		// assertion on the nav and visible to a reader. Asserting the
		// FRAME's width with an oversized child inside is what proves the
		// clip is in force: unclipped, the child would widen it.
		viewport: { width: 1600, height: 900 },
		html: `
			<div id="shell" class="strand-app-shell">
				<div id="nav" style="inline-size: 2000px; block-size: 64px">nav</div>
			</div>`,
		measure: { shell: "#shell" },
		expect: [{ of: "shell", inlineSize: 1440 }],
	},
	{
		name: "a sticky child inside the app shell still sticks",
		primitive: "AppShell",
		// The reason the frame uses `overflow: clip` and not the `hidden`
		// the mockup specifies. `hidden` makes an element a scroll
		// container, and this is the OUTERMOST container in the product, so
		// it would have broken every sticky element beneath it at once.
		viewport: { width: 1280, height: 900 },
		scroll: { y: 1200 },
		html: `
			<div class="strand-app-shell">
				<div style="display:grid;grid-template-columns:264px minmax(0,1fr);gap:24px">
					<div><div id="rail" class="strand-sticky">rail</div></div>
					<div style="block-size: 4000px">main</div>
				</div>
			</div>`,
		measure: { rail: "#rail" },
		expect: [
			{ of: "rail", blockStartAtLeast: 20 },
			{ of: "rail", blockStartAtMost: 28 },
		],
	},
];

// ── Pure decision layer ──

// Size kinds answer "how big". Position kinds answer "where", which is a
// separate question the tier could not ask at first: the measure step computed
// the full rect and kept only height and width, so every claim about placement
// had to be smuggled in as a claim about size. That is a proxy assertion, and
// it locks the implementation while going green for the wrong reason.
const ASSERTION_KINDS = [
	"blockSize",
	"blockSizeAtLeast",
	"blockSizeAtMost",
	"equals",
	"blockStartAtLeast",
	"blockStartAtMost",
	"blockEndAtMost",
	"equalsBlockStart",
	// Inline-axis kinds, added for the same reason the position kinds were.
	// The rect was already measuring inlineSize and nothing could assert on
	// it, so any claim about width had to be smuggled in as a claim about
	// height or left untested. 14.7 is a 44x44 rule and only one of those
	// numbers was checkable; a target 44px tall and 12px wide passed.
	"inlineSize",
	"inlineSizeAtLeast",
	"inlineSizeAtMost",
	"equalsInlineSize",
];

// Kinds that compare one subject against another measured subject rather than
// against a literal, so validation knows to check the target exists too.
const CROSS_SUBJECT_KINDS = ["equals", "equalsBlockStart", "equalsInlineSize"];

/**
 * Static validation of the case set. A case whose assertion names a selector
 * the case never measures would otherwise fail at run time as a missing
 * measurement, which reads like a layout bug rather than a typo. A case with no
 * assertions would pass vacuously, which is worse.
 */
export function validateCases(cases) {
	const errors = [];
	for (const c of cases) {
		const label = `${c.primitive}/${c.name}`;
		if (!Array.isArray(c.expect) || c.expect.length === 0) {
			errors.push(`${label}: has no assertion, so it would pass vacuously`);
			continue;
		}
		const declared = Object.keys(c.measure ?? {});
		for (const a of c.expect) {
			if (!declared.includes(a.of)) {
				errors.push(
					`${label}: asserts on "${a.of}", which is not one of the measured selectors (${declared.join(", ")})`,
				);
			}
			const kind = ASSERTION_KINDS.find((k) => k in a);
			if (!kind) {
				errors.push(
					`${label}: assertion on "${a.of}" names no known kind (expected one of ${ASSERTION_KINDS.join(", ")})`,
				);
				continue;
			}
			if (CROSS_SUBJECT_KINDS.includes(kind) && !declared.includes(a[kind])) {
				errors.push(
					`${label}: compares against "${a[kind]}", which is not measured`,
				);
			}
		}
	}
	return errors;
}

/**
 * Groups cases so the page is resized once per viewport rather than once per
 * case. Ascending width, which also makes the output read in breakpoint order.
 */
export function groupCasesByViewport(cases) {
	const byKey = new Map();
	for (const c of cases) {
		const { width, height } = c.viewport;
		const key = `${width}x${height}`;
		if (!byKey.has(key)) byKey.set(key, { width, height, cases: [] });
		byKey.get(key).cases.push(c);
	}
	return [...byKey.values()].sort(
		(a, b) => a.width - b.width || a.height - b.height,
	);
}

/**
 * Evaluates one case against its measurements. Pure: takes numbers, returns a
 * verdict. A missing measurement is always a failure and never a pass, because
 * the dangerous shape is `expected 0` compared against an absent element.
 */
export function evaluateCase(caseDef, measurements) {
	const failures = [];
	// Clearance on every threshold assertion. A case passing `>= 180` at 180.5
	// and one passing at 400 are not the same fact, and a bare pass/fail makes a
	// value drifting back toward the line invisible until the day it crosses.
	const clearances = [];
	const label = () => `${caseDef.primitive}/${caseDef.name}`;

	// Threshold kinds: [field on the measurement, comparison, prose].
	const THRESHOLDS = {
		blockSizeAtLeast: ["blockSize", "atLeast", "block-size at least"],
		blockSizeAtMost: ["blockSize", "atMost", "block-size at most"],
		blockStartAtLeast: ["blockStart", "atLeast", "block-start at least"],
		blockStartAtMost: ["blockStart", "atMost", "block-start at most"],
		blockEndAtMost: ["blockEnd", "atMost", "block-end at most"],
		inlineSizeAtLeast: ["inlineSize", "atLeast", "inline-size at least"],
		inlineSizeAtMost: ["inlineSize", "atMost", "inline-size at most"],
	};

	for (const a of caseDef.expect) {
		const subject = measurements[a.of];
		if (!subject) {
			failures.push(
				`${label()}: "${a.of}" was not found in the rendered page, so nothing was measured`,
			);
			continue;
		}

		const thresholdKind = Object.keys(THRESHOLDS).find((k) => k in a);

		if ("blockSize" in a) {
			const measured = subject.blockSize;
			if (Math.abs(measured - a.blockSize) > TOLERANCE_PX) {
				failures.push(
					`${label()}: "${a.of}" expected block-size ${a.blockSize}, measured ${measured}`,
				);
			}
		} else if ("inlineSize" in a) {
			const measured = subject.inlineSize;
			if (Math.abs(measured - a.inlineSize) > TOLERANCE_PX) {
				failures.push(
					`${label()}: "${a.of}" expected inline-size ${a.inlineSize}, measured ${measured}`,
				);
			}
		} else if (thresholdKind) {
			const [field, direction, prose] = THRESHOLDS[thresholdKind];
			const measured = subject[field];
			const limit = a[thresholdKind];
			if (typeof measured !== "number") {
				failures.push(
					`${label()}: "${a.of}" has no ${field} measurement, so ${thresholdKind} cannot be evaluated`,
				);
				continue;
			}
			const failed =
				direction === "atLeast"
					? measured < limit - TOLERANCE_PX
					: measured > limit + TOLERANCE_PX;
			if (failed) {
				failures.push(
					`${label()}: "${a.of}" expected ${prose} ${limit}, measured ${measured}`,
				);
			} else {
				clearances.push({
					of: a.of,
					kind: thresholdKind,
					limit,
					measured,
					margin:
						direction === "atLeast" ? measured - limit : limit - measured,
				});
			}
		} else if (
			"equals" in a ||
			"equalsBlockStart" in a ||
			"equalsInlineSize" in a
		) {
			const otherKey =
				a.equalsBlockStart ?? a.equalsInlineSize ?? a.equals;
			const field =
				"equalsBlockStart" in a
					? "blockStart"
					: "equalsInlineSize" in a
						? "inlineSize"
						: "blockSize";
			const other = measurements[otherKey];
			if (!other) {
				failures.push(
					`${label()}: "${otherKey}" was not found in the rendered page, so nothing was compared`,
				);
				continue;
			}
			// Prose per field. This branch is only reached on a MISMATCH,
			// which is why a stale reference here survived a green suite: no
			// case in the set fails, so nothing executed this line until a
			// negative control did.
			const PROSE = {
				blockStart: "must sit at the same block-start",
				inlineSize: "must be the same width",
				blockSize: "must occupy the same box",
			};
			if (Math.abs(subject[field] - other[field]) > TOLERANCE_PX) {
				failures.push(
					`${label()}: "${a.of}" and "${otherKey}" ${PROSE[field]}, measured ${subject[field]} and ${other[field]}`,
				);
			}
		}
	}

	return {
		name: caseDef.name,
		primitive: caseDef.primitive,
		ok: failures.length === 0,
		failures,
		clearances,
		assertionCount: caseDef.expect.length,
	};
}

/**
 * The tier measures the BUILT stylesheet, so a stale build measures a library
 * nobody is running. Caught on this tier's first run: dist/ is gitignored and
 * the local copy predated the 0.33.0 fix by a week.
 *
 * The direction that matters is not the one that was caught. A stale build
 * still containing a fix, while the source has regressed, reports green, and a
 * silent pass is the exact failure this tier exists to prevent.
 */
export function checkBuildFreshness(builtMtimeMs, newestSource) {
	if (!newestSource) return null;
	if (newestSource.mtimeMs <= builtMtimeMs) return null;
	return (
		`layout-check: the built stylesheet is older than ${newestSource.path}, ` +
		"so this would measure a library that is not the one in the source tree.\n" +
		"  pnpm build"
	);
}

export function summarize(results) {
	const passed = results.filter((r) => r.ok).length;
	const failed = results.length - passed;
	return {
		total: results.length,
		passed,
		failed,
		assertions: results.reduce((n, r) => n + (r.assertionCount ?? 0), 0),
		// An empty run is not a pass. A check that measured nothing has verified
		// nothing, and reporting green for it is how a tier rots unnoticed.
		ok: results.length > 0 && failed === 0,
	};
}

/** The page shell. The built stylesheet is inlined so there is no network. */
export function buildFixture(css, bodyHtml) {
	return `<!doctype html><html><head><meta charset="utf-8">
<style>${css}</style>
<style>
	/* Zero the shell so a measurement reflects the primitive and nothing else. */
	*, *::before, *::after { box-sizing: border-box; }
	html, body { margin: 0; padding: 0; }
	/* Animations would make a measurement depend on when it was taken. */
	*, *::before, *::after {
		transition: none !important;
		animation: none !important;
	}
</style>
</head><body>${bodyHtml}</body></html>`;
}

// ── Impure: the filesystem and the browser ──

/** Newest hand-authored stylesheet across the packages the bundle is built from. */
async function newestSourceStylesheet() {
	let newest = null;
	for await (const entry of glob("packages/*/src/**/*.css", { cwd: REPO_ROOT })) {
		const abs = resolve(REPO_ROOT, entry);
		const s = await stat(abs);
		if (!newest || s.mtimeMs > newest.mtimeMs) {
			newest = { path: relative(REPO_ROOT, abs), mtimeMs: s.mtimeMs };
		}
	}
	return newest;
}

// ── Impure: the browser ──

async function loadChromium() {
	try {
		const { chromium } = await import("playwright");
		return chromium;
	} catch {
		console.error(
			"layout-check: playwright is not installed.\n" +
				"  pnpm install\n" +
				"  pnpm exec playwright install chromium",
		);
		process.exit(1);
	}
}

async function main() {
	const caseErrors = validateCases(LAYOUT_CASES);
	if (caseErrors.length > 0) {
		console.error("layout-check: the case set is malformed.\n");
		for (const e of caseErrors) console.error(`  ${e}`);
		process.exit(1);
	}

	let css;
	let builtStat;
	try {
		css = `${await readFile(TOKENS_PATH, "utf8")}\n${await readFile(CSS_PATH, "utf8")}`;
		builtStat = await stat(CSS_PATH);
	} catch {
		console.error(
			`layout-check: built stylesheet not found at ${CSS_PATH}\n  pnpm build`,
		);
		process.exit(1);
	}

	const staleness = checkBuildFreshness(
		builtStat.mtimeMs,
		await newestSourceStylesheet(),
	);
	if (staleness) {
		console.error(staleness);
		process.exit(1);
	}

	const chromium = await loadChromium();
	let browser;
	try {
		browser = await chromium.launch();
	} catch (err) {
		// Never skip. A layout tier that quietly no-ops when the browser is
		// missing is worse than no tier, because the green tick then asserts
		// that geometry was verified when nothing was rendered.
		console.error(
			`layout-check: could not launch Chromium (${err.message.split("\n")[0]}).\n` +
				"  pnpm exec playwright install chromium",
		);
		process.exit(1);
	}

	const started = Date.now();
	const results = [];
	const page = await browser.newPage();

	for (const group of groupCasesByViewport(LAYOUT_CASES)) {
		await page.setViewportSize({ width: group.width, height: group.height });
		for (const c of group.cases) {
			await page.setContent(buildFixture(css, c.html));

			// An optional scroll, for regions whose contract is that they do NOT
			// move with the document. Verified rather than assumed: if the page
			// cannot scroll (a short fixture, say), every measurement is taken at
			// the same offset and a "same position at both offsets" assertion
			// passes perfectly while testing nothing. That is the strongest
			// possible result for a test that did no work, so a scroll that does
			// not land is a failed case rather than a quiet one.
			if (c.scroll && typeof c.scroll.y === "number") {
				const reached = await page.evaluate((y) => {
					window.scrollTo(0, y);
					return window.scrollY;
				}, c.scroll.y);
				if (Math.abs(reached - c.scroll.y) > 1) {
					results.push({
						name: c.name,
						primitive: c.primitive,
						ok: false,
						clearances: [],
						assertionCount: c.expect.length,
						failures: [
							`${c.primitive}/${c.name}: asked to scroll to y=${c.scroll.y} but the page reached y=${reached}, so the case would have compared two identical measurements and passed without testing anything`,
						],
					});
					continue;
				}
			}

			const measurements = await page.evaluate((selectors) => {
				const out = {};
				for (const [key, selector] of Object.entries(selectors)) {
					const el = document.querySelector(selector);
					if (!el) continue;
					const rect = el.getBoundingClientRect();
					// Viewport-relative on purpose: getBoundingClientRect already
					// is, and a fixed element's viewport rect IS its contract.
					out[key] = {
						blockSize: rect.height,
						inlineSize: rect.width,
						blockStart: rect.top,
						blockEnd: rect.bottom,
					};
				}
				return out;
			}, c.measure);
			results.push(evaluateCase(c, measurements));
		}
	}

	await browser.close();

	const summary = summarize(results);
	const elapsed = ((Date.now() - started) / 1000).toFixed(1);

	if (!summary.ok) {
		console.error("\nLayout check FAILED.\n");
		for (const r of results.filter((x) => !x.ok)) {
			for (const f of r.failures) console.error(`  ${f}`);
		}
		console.error(
			`\n${summary.failed} of ${summary.total} cases failed (${summary.assertions} assertions, ${elapsed}s).`,
		);
		process.exit(1);
	}

	console.log(
		`Layout clean. ${summary.total} cases, ${summary.assertions} assertions, real Chromium, ${elapsed}s.`,
	);
}

// Only run when invoked directly, so the unit tests can import the pure half.
if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
	await main();
}
