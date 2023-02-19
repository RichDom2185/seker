// Similar to remove, but removes all instances of v
// instead of just the first
function $remove_all(v, xs, acc) {
  // Ensure that typechecking of append and reverse are done independently
  const app = append;
  const rev = reverse;
  return is_null(xs)
    ? app(rev(acc), xs)
    : v === head(xs)
    ? $remove_all(v, tail(xs), acc)
    : $remove_all(v, tail(xs), pair(head(xs), acc));
}
function remove_all(v, xs) {
  return $remove_all(v, xs, null);
}
