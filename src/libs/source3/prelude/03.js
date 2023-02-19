// returns the length of a given argument list
// assumes that the argument is a list
function $length(xs, acc) {
  return is_null(xs) ? acc : $length(tail(xs), acc + 1);
}
function length(xs) {
  return $length(xs, 0);
}

// map applies first arg f, assumed to be a unary function,
// to the elements of the second argument, assumed to be a list.
// f is applied element-by-element:
// map(f, list(1, 2)) results in list(f(1), f(2))
function $map(f, xs, acc) {
  return is_null(xs) ? reverse(acc) : $map(f, tail(xs), pair(f(head(xs)), acc));
}
function map(f, xs) {
  return $map(f, xs, null);
}
