# Memory model: decision preparation

Status: Planned design; no production memory model has been selected.

The current interpreter owns Rust primitive values and clones values into local
maps/function arguments. Generated JavaScript relies on the host engine for
strings, Number and BigInt storage. This is the current implementation, not a
promise about object identity, aliasing, references or concurrency in Sovra.

Before adding reference-bearing structured data, evaluate these options against
real application and runtime tests:

| Candidate | Benefit | Cost / unresolved issue |
| --- | --- | --- |
| Ownership and borrowing | Predictable reclamation and explicit transfer | Learning burden and interactions with closures/async/application objects |
| ARC | Local reclamation, approachable shared values | Cycles, reference traffic, concurrency and weak-reference policy |
| Tracing GC | Simple cyclic object graphs and aliasing | Pauses, memory overhead, embedding and native runtime complexity |
| Regions | Efficient bulk allocation/reclamation | Escaping values, lifetime boundaries and long-lived graphs |
| Hybrid | Different policies at deliberate boundaries | More implementation and semantic complexity to explain and test |

Evaluation must cover mutation/aliasing, cyclic graphs, deterministic resource
cleanup, FFI handles, task cancellation, concurrency safety, interpreter/native/
WASM consistency, memory overhead and tail latency. Benchmark before claiming
performance benefits. Ordinary application ergonomics and safety both matter.

An accepted ADR and synchronized type/runtime specification must precede the
final decision. The user has explicitly required a pause before redefining the
memory model. No prototype allocator or ownership syntax is introduced here.
