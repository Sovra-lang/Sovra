# ADR 0002: Function parameter typing

Status: Accepted and implemented. The user approved Option A on 2026-09-12.

## Problem

Before this decision, the parser and specification allowed untyped function
parameters. Semantic analysis represented them as `Unknown`, which was accepted
by type compatibility checks without sound inference. For example, an untyped
parameter passed to `std::len` could pass checking while a caller supplied an
Int; execution then failed. Arbitrary names in type annotations are also not
declaration-resolved; that separate limitation remains.

Numeric conversion preserves already accepted Int/Float behavior, but it cannot
repair an unsound function signature. Enforcing a new signature policy required
an explicit compatibility decision.

## Decision: Option A, explicit function parameter types

Every function parameter requires an explicit type annotation. This applies to
top-level, exported module and non-exported module functions, including unused
functions and parameters. Local `let` bindings retain inference from their
initializers. An omitted return annotation still means `Unit`; function return
types are not inferred from their bodies or callers.

The parser retains a missing parameter annotation as `None` in the AST so the
semantic analyzer can report `E3014` at the parameter name with an actionable
message:

```text
parameter `value` requires an explicit type annotation; write `value: Type`
```

`Type` in that suggestion is a placeholder for the intended type, such as
`String` or `Int`. Parsing an untyped declaration remains possible, but it
cannot pass semantic checking or proceed through source `run` or `build`.
No public compiler-stage API or parser syntax redesign is needed.

This offers predictable function interfaces and a simpler basis for future
separate compilation and agent tooling. It is a source compatibility change
even though Sovra remains pre-stable. To migrate `fn length(value) -> Int`, write
`fn length(value: String) -> Int` when the body expects a string. Existing typed
declarations and inferred local bindings keep their behavior. Specification,
diagnostics, regression coverage, [example](../../examples/functions/main.svr)
and [course lesson](../course/functions.md) accompany the implementation.

The project directory checker remains a line-based manifest and wiring scanner;
it does not enforce this semantic rule. Check individual executable source files
with `svr check <source.svr>`. Named-type resolution and a general typed HIR are
not implemented by this decision.

## Alternative considered: Option B, sound parameter inference

Retain untyped declarations and implement constraint-based inference from
bodies/calls with explicit handling for recursion, exported signatures and
ambiguous types. Reject unresolved constraints rather than using Unknown as
a wildcard. Preserve concise syntax at the cost of a larger typed-HIR and
solver milestone before further feature expansion.

## Scope of approval

The full-development directive requires a pause before fundamental type-semantics
or compatibility changes. This ADR recorded both options before implementation,
and the user approved Option A. That approval covers required function parameter
annotations while preserving local inference and the Unit return default.

Memory management, traits, generics, closure inference and concurrency remain
separate decisions; this ADR does not select their eventual designs.
