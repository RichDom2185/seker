// filter returns the sublist of elements of the second argument
// (assumed to be a list), for which the given predicate function
// returns true.
function $filter(pred, xs, acc) {
  return is_null(xs)
    ? reverse(acc)
    : pred(head(xs))
    ? $filter(pred, tail(xs), pair(head(xs), acc))
    : $filter(pred, tail(xs), acc);
}
function filter(pred, xs) {
  return $filter(pred, xs, null);
}
