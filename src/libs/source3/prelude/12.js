// accumulate applies an operation op (assumed to be a binary function)
// to elements of sequence (assumed to be a list) in a right-to-left order.
// first apply op to the last element and initial, resulting in r1, then to
// the  second-last element and r1, resulting in r2, etc, and finally
// to the first element and r_n-1, where n is the length of the
// list.
// accumulate(op, zero, list(1, 2, 3)) results in
// op(1, op(2, op(3, zero)))
function $accumulate(f, initial, xs, cont) {
  return is_null(xs)
    ? cont(initial)
    : $accumulate(f, initial, tail(xs), (x) => cont(f(head(xs), x)));
}
function accumulate(f, initial, xs) {
  return $accumulate(f, initial, xs, (x) => x);
}
