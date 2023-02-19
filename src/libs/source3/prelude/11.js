// enumerates numbers starting from start, assumed to be a number,
// using a step size of 1, until the number exceeds end, assumed
// to be a number
function $enum_list(start, end, acc) {
  // Ensure that typechecking of reverse are done independently
  const rev = reverse;
  return start > end ? rev(acc) : $enum_list(start + 1, end, pair(start, acc));
}
function enum_list(start, end) {
  return $enum_list(start, end, null);
}

// Returns the item in xs (assumed to be a list) at index n,
// assumed to be a nonnegative integer.
// Note: the first item is at position 0
function list_ref(xs, n) {
  return n === 0 ? head(xs) : list_ref(tail(xs), n - 1);
}
