// list_to_string returns a string that represents the argument list.
// It applies itself recursively on the elements of the given list.
// When it encounters a non-list, it applies to_string to it.
function $list_to_string(xs, cont) {
  return is_null(xs)
    ? cont("null")
    : is_pair(xs)
    ? $list_to_string(head(xs), (x) =>
        $list_to_string(tail(xs), (y) => cont("[" + x + "," + y + "]"))
      )
    : cont(stringify(xs));
}
function list_to_string(xs) {
  return $list_to_string(xs, (x) => x);
}
