// build_list takes a a function fun as first argument,
// and a nonnegative integer n as second argument,
// build_list returns a list of n elements, that results from
// applying fun to the numbers from 0 to n-1.
function $build_list(i, fun, already_built) {
  return i < 0
    ? already_built
    : $build_list(i - 1, fun, pair(fun(i), already_built));
}
function build_list(fun, n) {
  return $build_list(n - 1, fun, null);
}

// for_each applies first arg fun, assumed to be a unary function,
// to the elements of the second argument, assumed to be a list.
// fun is applied element-by-element:
// for_each(fun, list(1, 2)) results in the calls fun(1) and fun(2).
// for_each returns true.
function for_each(fun, xs) {
  if (is_null(xs)) {
    return true;
  } else {
    fun(head(xs));
    return for_each(fun, tail(xs));
  }
}
