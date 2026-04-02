# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- DESIGN_LANGUAGE.md upgraded to v2.0 production specification (1,458 lines, 16 Parts, 10 named testable principles, 3 appendices)

### Fixed
- Focus rings (:focus-visible) added to Button, Link, Card, Breadcrumb, Nav, Table, Tabs
- Skeleton shimmer uses --strand-ease-in-out-sine token instead of raw ease-in-out
- Progress indeterminate uses --strand-ease-in-out-sine token instead of raw ease-in-out
- Skeleton text border-radius uses --strand-radius-sm token instead of raw 4px
- Ghost button hover adds translateY(-1px) lift per interaction state spec
- Tabs border-color transition normalized to --strand-duration-fast

## [0.1.1] - 2026-04-01

### Added
- Design language specification (DESIGN_LANGUAGE.md) covering 10 design domains
- CSS design tokens (tokens.css): colors, typography, spacing, motion, elevation, shape, layout
- CSS reset (reset.css): opinionated normalize with reduced-motion support
- CSS base styles (base.css): lab surface, grain texture, focus ring, containers
- TypeScript token constants (tokens.ts): typed JS exports mirroring CSS tokens
- Token validation test suite (57 tests): contrast ratios, scale ratios, value parity
