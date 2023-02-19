// Supporting streams in the Scheme style, following
// "stream discipline"
// is_stream recurses down the stream and checks that it ends with the
// empty list null
function is_stream(xs) {
  return (
    is_null(xs) ||
    (is_pair(xs) &&
      is_function(tail(xs)) &&
      arity(tail(xs)) === 0 &&
      is_stream(stream_tail(xs)))
  );
}

// A stream is either null or a pair whose tail is
// a nullary function that returns a stream.
function list_to_stream(xs) {
  return is_null(xs) ? null : pair(head(xs), () => list_to_stream(tail(xs)));
}
