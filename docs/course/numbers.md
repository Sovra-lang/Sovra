# Numbers

Status: Implemented numeric subset; full non-finite Float/output policy remains
experimental. Run `cargo run -- run examples/numbers/main.svr`.

`Int` holds signed 64-bit integers. `Float` holds binary64 floating-point values.
An Int becomes a Float when assigned to a Float local, passed to a Float
parameter, returned from a Float function, or combined with a Float operand.

```svr
fn half(value: Float) -> Float {
    return value / 2
}

fn main() {
    let ratio: Float = 5
    print(ratio / 2)  // 2.5
    print(half(5))    // 2.5
    print(5 / 2)      // 2
    print(5.0 / 2.0)  // 2.5
    print(2 == 2.0)   // true
}
```

Integer division truncates toward zero. Large integers stay exact until
converted to Float; that conversion may round. Decimal integer literals beyond
the signed 64-bit range are rejected with `E3012`. Overflow while calculating
Int values and division by zero report runtime errors. There is no automatic
Float-to-Int conversion. Unary negative literal syntax is not implemented;
subtraction such as `0 - 5` is supported.

Both the interpreter and JavaScript backend have execution tests for these
rules. Generated JavaScript requires BigInt and TextEncoder support. Float
formatting at extreme magnitudes and non-finite results are not yet a stable
cross-backend contract.
