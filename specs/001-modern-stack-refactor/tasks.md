# Tasks: Modern Stack Refactor

**Input**: Design documents from `/specs/001-modern-stack-refactor/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: Not explicitly requested in spec.md - test tasks included for quality but marked optional.

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story (US1-US8) from spec.md

## Path Conventions

Based on plan.md project structure:
- Main package: `packages/vue-quill/`
- Source: `packages/vue-quill/src/`
- Tests: `packages/vue-quill/src/__tests__/`
- Demo: `demo/`
- Docs: `docs/`

---

## Phase 1: Setup (Project Infrastructure)

**Purpose**: Migrate build system from Rollup to Vite 6, update dependencies

- [x] T001 Update root `package.json` with pnpm workspace config and modern scripts
- [x] T002 Update `packages/vue-quill/package.json` with Vue 3.5+, Quill 2.x, Vite 6 dependencies and modern `exports` field
- [x] T003 [P] Create `packages/vue-quill/vite.config.ts` with library mode configuration per research.md
- [x] T004 [P] Create `packages/vue-quill/tsconfig.json` with TypeScript 5.x strict configuration
- [x] T005 [P] Create `packages/vue-quill/vitest.config.ts` with Vue Test Utils setup
- [x] T006 [P] Create `eslint.config.js` with ESLint 9+ flat config for Vue/TypeScript
- [x] T007 Remove legacy files: `rollup.config.js`, `api-extractor.json`, old build scripts
- [x] T008 Run `pnpm install` and verify dependency resolution

---

## Phase 2: Foundational (Core Types & Infrastructure)

**Purpose**: Core TypeScript types and Editor class that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T009 Create `packages/vue-quill/src/types.ts` with all TypeScript interfaces from data-model.md (ContentType, EditorTheme, ToolbarOption, QuillModule, EditorEvents)
- [x] T010 Create `packages/vue-quill/src/Editor.ts` implementing Editor interface (TipTap-style wrapper around Quill)
- [x] T011 Create `packages/vue-quill/src/EditorCommandChain.ts` implementing chainable commands pattern
- [x] T012 [P] Create `packages/vue-quill/src/toolbar-presets.ts` with minimal, essential, full toolbar configurations
- [x] T013 [P] Create `packages/vue-quill/src/utils.ts` with helper functions (content conversion, SSR detection)
- [x] T014 Implement `packages/vue-quill/src/useEditor.ts` composable (PRIMARY API) per contracts/component-api.ts
- [x] T015 Verify TypeScript compilation with `pnpm type-check`

**Checkpoint**: Foundation ready - Editor class and useEditor composable functional

---

## Phase 3: User Story 1 - Install and Import Component (Priority: P1) 🎯 MVP

**Goal**: Developers can install VueQuill, import component, and render basic editor

**Independent Test**: Run `pnpm add @vueup/vue-quill` in fresh Vue 3.5+ project, import and render `<QuillEditor />`

### Implementation for User Story 1

- [x] T016 [US1] Create `packages/vue-quill/src/components/QuillEditor.vue` with `<script setup>` using defineProps, defineEmits, defineExpose
- [x] T017 [US1] Create `packages/vue-quill/src/components/EditorContent.vue` for TipTap-style rendering separation
- [x] T018 [US1] Create `packages/vue-quill/src/index.ts` with public exports (QuillEditor, EditorContent, useEditor, types)
- [x] T019 [US1] Import and bundle Quill CSS in `packages/vue-quill/src/style.css`
- [x] T020 [US1] Build package with `pnpm build` and verify output files (ESM, CJS, CSS, .d.ts)
- [x] T021 [US1] Test import in demo app: update `demo/src/App.vue` to use new component

**Checkpoint**: User Story 1 complete - basic editor renders with styling

---

## Phase 4: User Story 2 - Two-Way Content Binding (Priority: P1) 🎯 MVP

**Goal**: v-model binding works bidirectionally with all content types (delta, html, text)

**Independent Test**: Bind `v-model` to ref, type in editor, verify ref updates; update ref, verify editor updates

### Implementation for User Story 2

- [ ] T022 [US2] Implement `defineModel()` for v-model binding in QuillEditor.vue
- [ ] T023 [US2] Add content type conversion in Editor class (getHTML, getJSON, getText, setContent)
- [ ] T024 [US2] Implement content synchronization: editor → model (onUpdate callback)
- [ ] T025 [US2] Implement content synchronization: model → editor (watch modelValue)
- [ ] T026 [US2] Handle null/undefined content (display empty editor)
- [ ] T027 [US2] Add `demo/src/examples/ContentTypes.vue` demonstrating all three content types

**Checkpoint**: User Story 2 complete - two-way binding works for delta, html, text

---

## Phase 5: User Story 3 - Theme and Toolbar Customization (Priority: P2)

**Goal**: Developers can switch themes (snow, bubble) and customize toolbar

**Independent Test**: Render editor with different theme and toolbar props, verify visual changes

### Implementation for User Story 3

- [ ] T028 [US3] Implement theme prop handling in QuillEditor.vue (snow, bubble, '')
- [ ] T029 [US3] Implement toolbar prop with preset resolution (minimal, essential, full)
- [ ] T030 [US3] Implement custom toolbar array configuration
- [ ] T031 [US3] Implement external toolbar via CSS selector (`#my-toolbar`)
- [ ] T032 [US3] Implement toolbar slot for custom toolbar markup
- [ ] T033 [US3] Add `demo/src/examples/ThemeToolbar.vue` demonstrating theme and toolbar options

**Checkpoint**: User Story 3 complete - themes and toolbar customization work

---

## Phase 6: User Story 4 - Register Custom Quill Modules (Priority: P2)

**Goal**: Developers can register and use custom Quill modules

**Independent Test**: Register image-resize module, verify it loads and functions

### Implementation for User Story 4

- [ ] T034 [US4] Implement modules prop in QuillEditor.vue accepting QuillModule[]
- [ ] T035 [US4] Add module registration logic in Editor class (before Quill init)
- [ ] T036 [US4] Handle module options passing correctly
- [ ] T037 [US4] Add `demo/src/examples/CustomModules.vue` with example module registration

**Checkpoint**: User Story 4 complete - custom modules can be registered

---

## Phase 7: User Story 5 - Access Quill Instance Programmatically (Priority: P2)

**Goal**: Developers can access underlying Quill instance for advanced operations

**Independent Test**: Get template ref, call `editor.quill`, use Quill API directly

### Implementation for User Story 5

- [ ] T038 [US5] Implement defineExpose in QuillEditor.vue exposing `editor` property
- [ ] T039 [US5] Ensure Editor class exposes `quill` property with correct typing
- [ ] T040 [US5] Ensure Editor class exposes `element` property (DOM reference)
- [ ] T041 [US5] Add `demo/src/examples/ProgrammaticAccess.vue` showing Quill API usage

**Checkpoint**: User Story 5 complete - Quill instance accessible via component ref

---

## Phase 8: User Story 6 - Handle Editor Events (Priority: P2)

**Goal**: Developers can listen to all editor events (update, selection, focus, blur, create)

**Independent Test**: Attach event listeners, verify callbacks fire with correct payloads

### Implementation for User Story 6

- [ ] T042 [US6] Implement onCreate callback in useEditor and component emit
- [ ] T043 [US6] Implement onUpdate callback with delta, oldDelta, source payload
- [ ] T044 [US6] Implement onSelectionUpdate callback with range, oldRange, source payload
- [ ] T045 [US6] Implement onFocus and onBlur callbacks with FocusEvent
- [ ] T046 [US6] Implement onError callback for initialization failures
- [ ] T047 [US6] Add component events for template usage (@create, @update, @focus, @blur, @error)
- [ ] T048 [US6] Add `demo/src/examples/Events.vue` demonstrating all events

**Checkpoint**: User Story 6 complete - all events work with typed payloads

---

## Phase 9: User Story 7 - Read-Only and Disabled States (Priority: P3)

**Goal**: Developers can toggle editor between editable and read-only states

**Independent Test**: Toggle editable prop, verify editing is enabled/disabled

### Implementation for User Story 7

- [ ] T049 [US7] Implement editable prop in QuillEditor.vue
- [ ] T050 [US7] Implement setEditable method in Editor class
- [ ] T051 [US7] Implement placeholder prop
- [ ] T052 [US7] Handle reactive editable changes (watch and update Quill)
- [ ] T053 [US7] Add `demo/src/examples/ReadOnly.vue` demonstrating toggle

**Checkpoint**: User Story 7 complete - read-only and placeholder work

---

## Phase 10: User Story 8 - Use with Vue Forms (Priority: P3)

**Goal**: VueQuill integrates with form validation libraries

**Independent Test**: Wrap in VeeValidate field, verify validation triggers on content change

### Implementation for User Story 8

- [ ] T054 [US8] Ensure v-model emits correct events for form libraries
- [ ] T055 [US8] Add name prop support for form field identification
- [ ] T056 [US8] Ensure blur event fires for touched state tracking
- [ ] T057 [US8] Add `demo/src/examples/FormIntegration.vue` with VeeValidate example

**Checkpoint**: User Story 8 complete - form integration works

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, optimization, final validation

- [ ] T058 [P] Create `docs/content/guide/migration.md` with v1.x → v2.0 migration guide
- [ ] T059 [P] Update `README.md` with new API examples (useEditor, EditorContent)
- [ ] T060 [P] Update `docs/content/guide/usage.md` with TipTap-style patterns
- [ ] T061 [P] Update `docs/content/api/` with new component API documentation
- [ ] T062 Add TSDoc comments to all public exports in `packages/vue-quill/src/`
- [ ] T063 [P] Create `packages/vue-quill/src/__tests__/QuillEditor.spec.ts` with Vitest
- [ ] T064 [P] Create `packages/vue-quill/src/__tests__/useEditor.spec.ts` with Vitest
- [ ] T065 Run `pnpm build` and verify bundle size (<15KB gzipped)
- [ ] T066 Update `examples/vite-app/` to use new API
- [ ] T067 Run full test suite and verify 80% coverage target
- [ ] T068 Run `pnpm audit` and fix any vulnerabilities
- [ ] T069 Validate quickstart.md examples work in demo app

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) ─────────────────────────────────────┐
                                                      │
Phase 2 (Foundational) ◄──────────────────────────────┘
        │
        ▼ BLOCKS ALL USER STORIES
        │
        ├───► Phase 3 (US1: Install/Import) 🎯 MVP
        │           │
        │           ▼
        ├───► Phase 4 (US2: v-model Binding) 🎯 MVP ◄── depends on US1
        │
        ├───► Phase 5 (US3: Themes/Toolbar) ◄── can start after US2
        ├───► Phase 6 (US4: Custom Modules)  ◄── independent
        ├───► Phase 7 (US5: Quill Access)    ◄── independent
        ├───► Phase 8 (US6: Events)          ◄── independent
        ├───► Phase 9 (US7: Read-Only)       ◄── independent
        └───► Phase 10 (US8: Forms)          ◄── depends on US2, US6
                    │
                    ▼
              Phase 11 (Polish)
```

### User Story Dependencies

| Story | Depends On | Can Parallel With |
|-------|------------|-------------------|
| US1 (Install) | Foundational | - |
| US2 (v-model) | US1 | - |
| US3 (Themes) | US2 | US4, US5, US6, US7 |
| US4 (Modules) | US1 | US3, US5, US6, US7, US8 |
| US5 (Quill Access) | US1 | US3, US4, US6, US7, US8 |
| US6 (Events) | US1 | US3, US4, US5, US7 |
| US7 (Read-Only) | US1 | US3, US4, US5, US6, US8 |
| US8 (Forms) | US2, US6 | - |

### Parallel Opportunities

**Within Phase 1 (Setup):**
```
T003, T004, T005, T006 can run in parallel (independent config files)
```

**Within Phase 2 (Foundational):**
```
T012, T013 can run in parallel (independent utility files)
```

**After Phase 4 (v-model complete):**
```
US3, US4, US5, US6, US7 can all start in parallel
```

**Within Phase 11 (Polish):**
```
T058, T059, T060, T061, T063, T064 can run in parallel (independent docs/tests)
```

---

## Parallel Example: After MVP (US1 + US2)

```bash
# After US2 is complete, launch these in parallel:

# Developer A: Themes & Toolbar (US3)
Task: "Implement theme prop handling in QuillEditor.vue"
Task: "Implement toolbar prop with preset resolution"

# Developer B: Events (US6)
Task: "Implement onCreate callback in useEditor"
Task: "Implement onUpdate callback with delta payload"

# Developer C: Quill Access (US5)
Task: "Implement defineExpose in QuillEditor.vue"
Task: "Ensure Editor class exposes quill property"
```

---

## Implementation Strategy

### MVP First (US1 + US2 = Core Value)

1. ✅ Complete Phase 1: Setup
2. ✅ Complete Phase 2: Foundational
3. ✅ Complete Phase 3: User Story 1 (Install/Import)
4. ✅ Complete Phase 4: User Story 2 (v-model Binding)
5. **STOP and VALIDATE**: Test basic editor with v-model
6. **DEPLOY/TAG**: v2.0.0-alpha.1

### Incremental Delivery

| Release | Stories Included | Value Delivered |
|---------|------------------|-----------------|
| v2.0.0-alpha.1 | US1, US2 | Basic editor with v-model |
| v2.0.0-alpha.2 | + US3 | Theme/toolbar customization |
| v2.0.0-alpha.3 | + US4, US5 | Module registration, Quill access |
| v2.0.0-beta.1 | + US6 | Full event handling |
| v2.0.0-beta.2 | + US7, US8 | Read-only, form integration |
| v2.0.0 | + Polish | Docs, tests, migration guide |

---

## Summary

| Metric | Value |
|--------|-------|
| **Total Tasks** | 69 |
| **Setup Tasks** | 8 |
| **Foundational Tasks** | 7 |
| **US1 Tasks** | 6 |
| **US2 Tasks** | 6 |
| **US3 Tasks** | 6 |
| **US4 Tasks** | 4 |
| **US5 Tasks** | 4 |
| **US6 Tasks** | 7 |
| **US7 Tasks** | 5 |
| **US8 Tasks** | 4 |
| **Polish Tasks** | 12 |
| **Parallel Opportunities** | 15+ tasks can run in parallel |
| **MVP Scope** | US1 + US2 (22 tasks including setup/foundational) |

---

## Event Name Mapping (Spec → Implementation)

The spec.md uses Quill-style event names, while the implementation uses TipTap-style callback names:

| spec.md Event | Implementation Callback | Payload |
|---------------|------------------------|--------|
| `ready` (FR-020) | `onCreate` | `{ editor }` (access Quill via `editor.quill`) |
| `textChange` (FR-016) | `onUpdate` | `{ editor, delta, oldDelta, source }` |
| `selectionChange` (FR-017) | `onSelectionUpdate` | `{ editor, range, oldRange, source }` |
| `editorChange` (FR-018) | `onTransaction` | `{ editor }` |
| `focus` (FR-019) | `onFocus` | `{ editor, event }` |
| `blur` (FR-019) | `onBlur` | `{ editor, event }` |
| `error` (FR-021) | `onError` | `{ editor, error }` |

---

## Notes

- All tasks use absolute paths relative to monorepo root
- [P] tasks can be parallelized (different files, no dependencies)
- [US#] labels map tasks to spec.md user stories
- Each user story has independent test criteria from spec.md
- Commit after each task or logical group
- TipTap-inspired patterns: useEditor composable-first, EditorContent separation, callback options
