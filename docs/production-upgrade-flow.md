# Production Upgrade Flow

This is the handoff flow for continuing the production-grade Sovra upgrade.
Use it when picking up M12 and later project/runtime work.

## Current Spine

1. Harden `svr check <project>` before `svr test` or project runtime work.
2. Keep the CLI thin; production rules should live behind compiler/project APIs.
3. Validate the Fielddesk app surface incrementally: manifest, source discovery,
   services, routes, pages, auth, data models, scheduled tasks, service
   contracts, policies, then richer page/model checks.
4. Treat each checker rule as a public contract: stable diagnostic code, focused
   test coverage, and matching docs.
5. Keep shallow scanners conservative until the parser owns application syntax.
   A malformed declaration should produce a diagnostic, not disappear silently.

## Current Checkpoint

M12 now validates manifest metadata, source discovery, service bindings, app
routes, page routes, auth target wiring, app data model references, and
scheduled task targets. This pass also validates auth policy shape and policy
model references. The handoff assessment identified prerequisite executable
subset correctness gaps. All module function bodies now receive semantic
checks. Numeric conversion/bounds, checked Int arithmetic, JS numeric kinds,
token ranges and straight-line return completeness have since been hardened.
ADR 0002 is approved and implemented: executable function parameters require
explicit types (`E3014`), with local inference and the default Unit return type
preserved. Named-type resolution and expression/file-aware diagnostics remain
before broader type-system claims. The project scanner does not enforce source
semantic rules. See `FULL_DEVELOPMENT_STATUS.md` before further service-contract
and model/page expansion.

## Verification Flow

Agents can request `svr check --format json <path>` for structured outcomes.
See `reference/check-json.md`: project success remains a wiring check, and
project diagnostic locations are null until per-file provenance is retained.

Run these in order after each slice:

```text
cargo fmt --check
cargo check
cargo test --no-run
cargo test
```

On this machine, Windows Application Control may block executing freshly built
Rust test binaries or `target/debug/svr.exe`. If that happens, record the block
and rely on `cargo test --no-run` plus compile checks until policy allows local
execution.

## Next M12 Slices

1. Service contracts: validate duplicate operation names and references to
   bound services.
2. Page bindings: validate page targets, view references, and data dependencies
   once the application parser can provide structured nodes.
