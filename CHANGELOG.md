# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Design language specification (DESIGN_LANGUAGE.md) covering all 10 domains
- CSS design tokens (tokens.css): colors, typography, spacing, motion, elevation, shape, layout
- CSS reset (reset.css): opinionated normalize with reduced-motion support
- CSS base styles (base.css): lab surface, grain texture, focus ring, containers
- TypeScript token constants (tokens.ts): typed JS exports mirroring CSS tokens
- Token validation test suite (57 tests): contrast ratios, scale ratios, value parity
