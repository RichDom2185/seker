// append first argument, assumed to be a list, to the second argument.
// In the result null at the end of the first argument list
// is replaced by the second argument, regardless what the second
// argument consists of.
function $append(xs, ys, cont) {
  return is_null(xs)
    ? cont(ys)
    : $append(tail(xs), ys, (zs) => cont(pair(head(xs), zs)));
}
function append(xs, ys) {
  return $append(xs, ys, (xs) => xs);
}

// member looks for a given first-argument element in the
// second argument, assumed to be a list. It returns the first
// postfix sublist that starts with the given element. It returns null if the
// element does not occur in the list
function member(v, xs) {
  return is_null(xs) ? null : v === head(xs) ? xs : member(v, tail(xs));
}
