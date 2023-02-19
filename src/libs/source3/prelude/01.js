// Source §3 Prelude

// equal computes the structural equality
// over its arguments
// NOTE: We have to split this into parts because the amount of
//       function calls results in a very large JSON object that
//       would otherwise cause an out of memory error.
function equal(xs, ys) {
  return is_pair(xs)
    ? is_pair(ys) && equal(head(xs), head(ys)) && equal(tail(xs), tail(ys))
    : is_null(xs)
    ? is_null(ys)
    : is_number(xs)
    ? is_number(ys) && xs === ys
    : $equal2(xs, ys);
}
