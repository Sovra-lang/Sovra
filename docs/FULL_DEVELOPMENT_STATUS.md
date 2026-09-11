# Full development status

Updated: 2026-09-12. Status terms: Implemented, Partial, Experimental, Stub, Planned.

## Repository state and audit

The comprehensive audit is in `CODEX_HANDOFF_ASSESSMENT.md`; the subsequent
module validation fix is recorded in `DEVELOPMENT_LOG.md`. This pass reviewed
the current diff, numeric semantics, IR, interpreter, JavaScript generator,
test infrastructure and existing architecture. Prior edits remain in place.
The repository is a single Rust 2021 package with no third-party dependencies.
No restart or crate/layout migration is needed.

## Current capabilities

| Area | Status | Working scope / remaining work |
| --- | --- | --- |
| Lexer/parser/AST | Implemented subset | Functions, locals, literals, binary operations, inline modules; no control flow or structured data. |
| Name/type analysis | Partial | All function bodies and straight-line return completeness checked; unknown types and private resolution remain incomplete. |
| Typed representation/IR | Partial | Validated AST wrapper, linear stack IR and explicit Float widening; no general typed HIR, branches, optimizer or native ABI. |
| Interpreter/runtime | Partial | Primitive values, functions, builtins, depth bound, numeric widening and checked Int arithmetic. |
| Backend | Experimental | Text IR and JavaScript emission with tested numeric parity; full Float formatting and general runtime parity remain incomplete. No native/WASM target. |
| CLI | Partial | Help/version, source run/build/check and shallow project check work. Other recognized commands are stubs. |
| Standard library | Partial | print/println, len, to_string only; filesystem, collections, networking and other modules are planned. |
| Project system | Partial | Manifest, source discovery and application wiring scanner; not application type-checking or execution. |
| Tooling | Planned | Formatter, REPL, Sovra test runner, package resolution/registry, debugger, LSP, editor integration and agent inspection. |
| Application libraries | Planned | Web/data/auth/cloud libraries follow a stable core; Fielddesk is target syntax. |

Working features include `Int`, `Float`, `Bool`, `String`, `Unit`, typed
parameters/locals/returns, functions and exported inline module calls. Char,
Never, collections, closures, generics, structs/enums, traits, imports,
pattern matching, Result/Option, mutation and concurrency remain planned.
Nova integration follows inspectable compiler/tooling interfaces; no custom
foundation model is planned in this development pass.

## Verification and documentation

This pass reached 67 passing library tests, including real Node execution of
generated programs and numeric error comparisons. Regression failures were
observed before fixing widening, overflow, literal bounds, missing returns and
token byte ranges. CI explicitly installs Node 22 for backend execution tests.
The final `cargo test -- --nocapture` run passed 67 library tests and all 13 CLI
tests, with no Application Control skips; binary-unit and doc-test targets had
zero tests. Formatting, compilation, test compilation and strict Clippy passed.
Earlier Windows runs were blocked by Application Control, so future contributors
must still inspect skip messages rather than trusting the test count alone.

Specification, architecture, roadmap, handoff, examples, agent context and a
module and numeric course lessons exist. The complete curriculum is unfinished.
New stable behavior needs executable examples and tests, not just prose.
Numeric implementation decisions were recorded in ADR 0001 before code.

## Blockers and debt

- Numeric widening, Int bounds/overflow and JS numeric kinds are now fixed and
  tested. Non-finite Float/output policy and structured runtime errors remain.
- Token byte ranges now cover the full spelling. Diagnostics still lack reliable
  individual expression spans and file identity.
- Private module functions are checked but not lowered/callable; no import graph.
- Straight-line non-Unit fallthrough is rejected; Unknown types remain too
  permissive. ADR 0002 documents the next required design decision.
- Project scanning is line-based, scope-insensitive and not full validation.
- Tests need backend execution comparisons and meaningful platform coverage.
- Windows execution policy has intermittently blocked tests; the final run
  succeeded. Do not bypass policy or count skipped assertions as validation.

## Development sequence

1. Completed this pass: numeric widening/Int correctness, real differential
   tests, token ranges and straight-line return completeness.
2. Choose function parameter typing (ADR 0002), then close type holes and add
   expression/file-aware structured diagnostics.
3. Resolve/document private modules and cross-file loading before package work.
4. Add control flow and structured data incrementally, with design records for
   syntax/type decisions and a reviewed memory-model decision before references
   and concurrency. Do not select a final memory model from scaffolding alone.
5. Project creation/run/build, official formatter, REPL and Sovra test runner.
6. Stdlib, packages/lockfiles, LSP/VS Code and structured agent inspection.
7. Benchmark infrastructure, interop/native/WASM targets, cross-platform releases.
8. Application libraries, deployment integration and Nova workflows.

Keep existing M0-M15 labels; this sequence records dependencies rather than
renumbering completed slices. Continue authorized routine engineering between
milestones. Document and pause before fundamental syntax, memory, type or
compatibility changes. Do not label the overall platform production-ready.
