# ADR 0001: Preserve numeric kinds through execution

Status: Accepted for implementation of existing numeric contracts, 2026-09-12.

## Context

Semantic analysis already accepts Int-to-Float widening in annotated locals,
parameters, returns and mixed arithmetic/comparisons. The interpreter uses i64
and f64 but lowering discards annotations. JavaScript emission uses Number for
both kinds, misclassifying `5.0 / 2.0` as integer division and rounding large Ints.

## Decision

Keep existing syntax and the interpreter's signed 64-bit Int / binary64 Float
representation. Add an explicit IR `WidenFloat` instruction at annotated Float
locals, parameters and return boundaries. It preserves Float and converts Int;
it rejects other runtime kinds rather than silently coercing them. Function
parameter prologues perform conversion so direct IR callers use the same rules.

Mixed numeric binary operations widen the Int operand to binary64 before
arithmetic or comparison, matching the already accepted semantic rule. This can
round large integers; Int-only arithmetic/comparison remains exact. Integer
division truncates toward zero; Float division remains floating-point division.

Use JavaScript BigInt for Sovra Int and Number for Float. Decimal strings are
passed to BigInt rather than emitted as raw BigInt literal syntax, preserving
leading-zero decimal input. Normalize only mixed numeric operands and explicit
widening sites. Require a JS runtime supporting BigInt. This is a backend
representation change, not a new source numeric type or public JavaScript ABI.

Check out-of-range Int literals during semantic validation. Arithmetic overflow
must return an error consistently instead of host debug panics/release wrapping;
both engines check i64 bounds. Float remains host binary64 for now; a complete
non-finite/formatting policy is not established by this ADR and must be designed
separately. Do not claim complete cross-backend equivalence for all Float output.

## Consequences and validation

IR gains one operation; no parser/AST syntax change is needed. No general typed
HIR rewrite is necessary for this fix. Both engines retain checked-value kinds.
Stdlib-generated Int values must also use BigInt in JS. Node execution tests
compare numeric outputs and failures rather than merely matching emitted text.
This establishes a focused numeric contract while leaving memory model, new
numeric types, coercive string conversions and private module semantics open.
