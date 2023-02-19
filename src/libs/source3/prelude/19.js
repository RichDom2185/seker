// stream_remove_all removes all instances of v instead of just the first.
// Lazy? Yes: the result stream forces the construction of each next element
function stream_remove_all(v, xs) {
  return is_null(xs)
    ? null
    : v === head(xs)
    ? stream_remove_all(v, stream_tail(xs))
    : pair(head(xs), () => stream_remove_all(v, stream_tail(xs)));
}
