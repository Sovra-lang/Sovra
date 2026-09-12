# Automated source checks

An agent or editor can request structured diagnostics:

```text
cargo run -- check --format json examples/functions/main.svr
cargo run -- check --format json tests/fixtures/untyped-parameter.svr
cargo run -- check --format json examples/fielddesk
```

The first command succeeds with no diagnostics. The second exits 1 with E3014
and the missing parameter annotation's location. The third checks only the
project's manifest and wiring; it does not establish that Fielddesk can run.

For a built toolchain, invoke `svr check --format json <path>` and capture stdout,
stderr and the exit code separately. Cargo may write its own build progress to
stderr when using `cargo run`. Parse the report for check outcomes (0/1); for
usage errors (2), display stderr. Help requests return human text.

Use diagnostic codes to categorize issues and source ranges only when
`location` is non-null. After editing, run the check again; reports are snapshots
of that invocation, not persistent symbol identifiers. See the
[versioned schema](../reference/check-json.md) for offsets and limitations.
