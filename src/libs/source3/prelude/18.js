// stream_remove removes the first occurrence of a given first-argument element
// in a given second-argument list. Returns the original list
// if there is no occurrence.
// Lazy? Yes: the result stream forces the construction of each next element
function stream_remove(v, xs) {
  return is_null(xs)
    ? null
    : v === head(xs)
    ? stream_tail(xs)
    : pair(head(xs), () => stream_remove(v, stream_tail(xs)));
}
