// Continued from the previous part
function $equal2(xs, ys) {
  return is_boolean(xs)
    ? is_boolean(ys) && ((xs && ys) || (!xs && !ys))
    : is_string(xs)
    ? is_string(ys) && xs === ys
    : is_undefined(xs)
    ? is_undefined(ys)
    : is_function(xs)
    ? // we know now that xs is a function,
      // but we use an if check anyway to make use of the type predicate
      is_function(ys) && xs === ys
    : false;
}
