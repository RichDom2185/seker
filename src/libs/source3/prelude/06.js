// reverse reverses the argument, assumed to be a list
function $reverse(original, reversed) {
  return is_null(original)
    ? reversed
    : $reverse(tail(original), pair(head(original), reversed));
}
function reverse(xs) {
  return $reverse(xs, null);
}
