// removes the first occurrence of a given first-argument element
// in second-argument, assmed to be a list. Returns the original
// list if there is no occurrence.
function $remove(v, xs, acc) {
  // Ensure that typechecking of append and reverse are done independently
  const app = append;
  const rev = reverse;
  return is_null(xs)
    ? app(rev(acc), xs)
    : v === head(xs)
    ? app(rev(acc), tail(xs))
    : $remove(v, tail(xs), pair(head(xs), acc));
}
function remove(v, xs) {
  return $remove(v, xs, null);
}
