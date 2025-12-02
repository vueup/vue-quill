<!--
================================================================================
SYNC IMPACT REPORT
================================================================================
Version change: 1.0.0 → 2.0.0 (Major refactor for modern stack)
Modified principles:
  - II. TypeScript-First → TypeScript 5.x Standards
  - III. Vue 3 Composition API → Vue 3.5+ Modern Syntax
Added sections:
  - Vite 6 as primary build system (replacing Rollup)
  - Vitest for testing (replacing Jest)
  - Modern Vue macros (defineModel, defineOptions, defineSlots)
  - ESM-first output strategy
Removed sections:
  - Rollup-specific configuration (superseded by Vite)
  - Legacy build formats prioritization
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ (aligned with Vite/Vitest context)
  - .specify/templates/spec-template.md ✅ (aligned with component testing focus)
  - .specify/templates/tasks-template.md ✅ (aligned with Vue 3.5+ development)
Follow-up TODOs: None
================================================================================
-->

# VueQuill Constitution

> A Vue 3.5+ Rich Text Editor Component powered by Quill

## Core Principles

### I. Component-First Design

All features MUST be implemented as self-contained Vue 3.5+ components or composables.

- Components MUST be independently importable and tree-shakeable
- Components MUST expose a clear props/emits API contract using modern macros
- Components MUST be documented with TypeScript types and TSDoc comments
- Utility functions MUST be pure and side-effect free unless explicitly stated
- Every public API addition requires corresponding TypeScript definitions
- Use `<script setup>` as the default authoring pattern

**Rationale**: VueQuill is a component library. Users expect modular, well-typed, and predictable building blocks that integrate seamlessly with Vue 3.5+ reactivity.

### II. TypeScript 5.x Standards

All source code MUST be written in TypeScript 5.x with strict type checking.

- `strict: true` in tsconfig.json is NON-NEGOTIABLE
- Enable `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` for maximum safety
- All public APIs MUST have explicit type annotations (no implicit `any`)
- Use `satisfies` operator for type-safe object literals with inferred types
- Type definitions MUST be exported alongside runtime code
- Generic types SHOULD be used to maximize reusability
- Prefer `const` type parameters (TypeScript 5.0+) for immutable generics

**Rationale**: TypeScript 5.x provides enhanced type safety, better inference, and modern language features. Strict configuration catches errors at compile time.

### III. Vue 3.5+ Modern Syntax

All component logic MUST use Vue 3.5+ Composition API with modern macros.

**Required Macros and Patterns**:
- `defineProps<T>()` with TypeScript type literals for prop definitions
- `defineEmits<T>()` with typed emit declarations
- `defineModel()` (Vue 3.4+) for two-way binding props
- `defineOptions()` (Vue 3.3+) for component options like `inheritAttrs`
- `defineSlots<T>()` (Vue 3.3+) for typed slot definitions
- `defineExpose()` for explicit public instance API

**Composition Patterns**:
- Extract reusable logic into composables (`use*` pattern)
- Use `ref`, `shallowRef`, and `computed` appropriately for reactivity
- Prefer `watchEffect` for side effects, `watch` for explicit dependencies
- Use `toValue()` (Vue 3.3+) for normalizing refs/getters in composables

**Rationale**: Vue 3.5+ macros provide superior TypeScript inference, reduced boilerplate, and clearer component contracts. Modern patterns align with Vue ecosystem best practices.

### IV. Semantic Versioning & Breaking Change Policy

Version numbers MUST follow Semantic Versioning 2.0.0 (MAJOR.MINOR.PATCH).

- **MAJOR**: Breaking changes to public API (props, emits, methods, exports)
- **MINOR**: New features, new props/events that are backward-compatible
- **PATCH**: Bug fixes, performance improvements, internal refactors

Breaking changes MUST:
- Be documented in CHANGELOG.md with migration guidance
- Include deprecation warnings in the prior minor release when feasible
- Never occur in PATCH releases
- Follow Vue's own deprecation patterns where applicable

**Rationale**: Library consumers depend on predictable versioning to manage upgrades safely. Semantic versioning is the industry standard for npm packages.

### V. Documentation-Driven Development

All public APIs MUST be documented before or alongside implementation.

- Props, events, methods, and slots MUST have TSDoc documentation
- Usage examples MUST accompany new features in `/docs`
- Breaking changes MUST include migration guides
- Demo examples in `/demo` and `/examples` MUST reflect documented usage
- README MUST stay synchronized with current capabilities
- Use VitePress for documentation site generation

**Rationale**: Documentation is the primary interface between the library and its users. Undocumented features are effectively non-existent to consumers.

### VI. Quill Compatibility & Abstraction

VueQuill MUST maintain compatibility with the underlying Quill editor.

- Quill instance MUST be accessible via `defineExpose()` methods
- All Quill modules MUST be registrable through component props
- Custom formats and blots MUST be supportable without library modification
- Breaking Quill upgrades require a VueQuill MAJOR version bump
- Quill-specific types MUST be re-exported for consumer convenience
- Support both Quill 1.x and Quill 2.x where feasible (via peer dependencies)

**Rationale**: VueQuill is a Vue wrapper for Quill. Users expect full access to Quill's power while benefiting from Vue integration.

## Technology Standards

**Language/Version**: TypeScript 5.x+ with Vue 3.5+

**Runtime Requirements**:
- Node.js 20+ (LTS)
- Vue 3.5+ as peer dependency
- Quill 1.x or 2.x as peer dependency

**Build System**:
- **Vite 6** for library bundling and development
- Use `build.lib` configuration for library mode
- Externalize `vue` and `quill` as peer dependencies
- Enable source maps for debugging

**Output Formats** (priority order):
1. **ES Modules** (primary, tree-shakeable, `.js` extension)
2. **CommonJS** (Node.js compatibility, `.cjs` extension)
3. **UMD/Global** (CDN/browser usage, optional)

**Package Exports** (package.json):
```json
{
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/vue-quill.js",
      "require": "./dist/vue-quill.cjs"
    },
    "./style.css": "./dist/style.css"
  }
}
```

**Styling**:
- CSS/SCSS for component styles (modern approach)
- CSS outputs MUST be importable separately from JS
- Support CSS custom properties for theming

**Testing**:
- **Vitest** for unit and component testing
- **Vue Test Utils** for component mounting
- **@vitest/coverage-v8** for coverage reporting
- Snapshot testing for rendered output stability
- Minimum 80% coverage for public APIs

**Linting & Formatting**:
- **ESLint 9+** with flat config (`eslint.config.js`)
- `@typescript-eslint/eslint-plugin` for TypeScript rules
- `eslint-plugin-vue` with `vue3-recommended` preset
- **Prettier** for consistent code formatting
- **lint-staged** + **husky** for pre-commit validation

**Package Management**:
- **pnpm** for fast, efficient dependency management
- Lock file (`pnpm-lock.yaml`) MUST be committed
- Use workspace protocol for monorepo dependencies

## Development Workflow

### Code Review Requirements

All changes MUST go through pull request review.

- At least one approval required before merge
- CI checks (lint, type-check, test, build) MUST pass
- Breaking changes require explicit acknowledgment in PR description
- New features require documentation updates

### Branching Strategy

- `main`: Stable release branch (renamed from `master`)
- `develop`: Integration branch for next release
- Feature branches: `feat/[description]` or `issue-[number]-[description]`
- Hotfix branches: `hotfix/[description]`

### Commit Convention

Commit messages MUST follow **Conventional Commits** specification:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, semicolons)
- `refactor:` Code refactoring without feature/fix
- `perf:` Performance improvements
- `test:` Adding or updating tests
- `build:` Build system or dependencies
- `ci:` CI/CD configuration
- `chore:` Other changes

### Release Process

Releases use **semantic-release** automation:

- CHANGELOG.md auto-generated from commit history
- npm publishing automated via GitHub Actions
- Git tags created automatically
- GitHub releases published with notes

### Quality Gates

Before any release, the following MUST pass:

- [ ] TypeScript compilation with zero errors (`vue-tsc --noEmit`)
- [ ] ESLint with zero errors (warnings require justification)
- [ ] All Vitest tests passing with ≥80% coverage
- [ ] Build succeeds for all output formats
- [ ] Bundle size check (no unexpected increases >5%)
- [ ] Documentation builds successfully

## Governance

This constitution supersedes all informal practices. Amendments require:

1. A pull request modifying this file with clear rationale
2. Review and approval by a project maintainer
3. Version increment following semantic versioning rules
4. Update propagation to dependent templates (plan, spec, tasks)

All PRs and code reviews SHOULD verify compliance with these principles. Violations require explicit justification documented in the PR.

For day-to-day development guidance, refer to `README.md` and `/docs`.

**Version**: 2.0.0 | **Ratified**: 2025-12-02 | **Last Amended**: 2025-12-02
