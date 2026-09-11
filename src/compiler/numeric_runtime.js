// Numeric helpers emitted with the JavaScript backend.
function svrWidenFloat(value) {
  if (typeof value !== "bigint" && typeof value !== "number") {
    throw new Error("Float conversion expects Int or Float");
  }
  return Number(value);
}

function svrCheckedInt(value) {
  if (value < -9223372036854775808n || value > 9223372036854775807n) {
    throw new Error("integer overflow");
  }
  return value;
}

function svrBinary(operator, left, right) {
  if ((typeof left === "bigint" && typeof right === "number") ||
      (typeof left === "number" && typeof right === "bigint")) {
    left = Number(left);
    right = Number(right);
  }
  if (operator === "/" && (right === 0 || right === 0n)) {
    throw new Error("division by zero");
  }
  let result;
  switch (operator) {
    case "+": result = left + right; break;
    case "-": result = left - right; break;
    case "*": result = left * right; break;
    case "/": result = left / right; break;
    case "==": return left === right;
    case "!=": return left !== right;
    case "<": return left < right;
    case "<=": return left <= right;
    case ">": return left > right;
    case ">=": return left >= right;
    default: throw new Error("unsupported runtime operation `" + operator + "`");
  }
  return typeof result === "bigint" ? svrCheckedInt(result) : result;
}
