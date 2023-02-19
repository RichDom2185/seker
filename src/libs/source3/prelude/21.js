// integers_from constructs an infinite stream of integers
// starting at a given number n
// Lazy? Yes: The result stream forces the construction of
//            each next element
function integers_from(n) {
  return pair(n, () => integers_from(n + 1));
}

// eval_stream constructs the list of the first n elements
// of a given stream s
// Lazy? Sort-of: eval_stream only forces the computation of
//                the first n elements, and leaves the rest of
//                the stream untouched.
function eval_stream(s, n) {
  function es(s, n) {
    return n === 1 ? list(head(s)) : pair(head(s), es(stream_tail(s), n - 1));
  }
  return n === 0 ? null : es(s, n);
}
