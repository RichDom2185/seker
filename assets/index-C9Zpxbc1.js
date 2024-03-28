const e=`// Source §3 Prelude

// equal computes the structural equality
// over its arguments
// NOTE: We have to split this into parts because the amount of
//       function calls results in a very large JSON object that
//       would otherwise cause an out of memory error.
function equal(xs, ys) {
  return is_pair(xs)
    ? is_pair(ys) && equal(head(xs), head(ys)) && equal(tail(xs), tail(ys))
    : is_null(xs)
    ? is_null(ys)
    : is_number(xs)
    ? is_number(ys) && xs === ys
    : $equal2(xs, ys);
}
`,n=`// Continued from the previous part
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
`,t=`// returns the length of a given argument list
// assumes that the argument is a list
function $length(xs, acc) {
  return is_null(xs) ? acc : $length(tail(xs), acc + 1);
}
function length(xs) {
  return $length(xs, 0);
}

// map applies first arg f, assumed to be a unary function,
// to the elements of the second argument, assumed to be a list.
// f is applied element-by-element:
// map(f, list(1, 2)) results in list(f(1), f(2))
function $map(f, xs, acc) {
  return is_null(xs) ? reverse(acc) : $map(f, tail(xs), pair(f(head(xs)), acc));
}
function map(f, xs) {
  return $map(f, xs, null);
}
`,s=`// build_list takes a a function fun as first argument,
// and a nonnegative integer n as second argument,
// build_list returns a list of n elements, that results from
// applying fun to the numbers from 0 to n-1.
function $build_list(i, fun, already_built) {
  return i < 0
    ? already_built
    : $build_list(i - 1, fun, pair(fun(i), already_built));
}
function build_list(fun, n) {
  return $build_list(n - 1, fun, null);
}

// for_each applies first arg fun, assumed to be a unary function,
// to the elements of the second argument, assumed to be a list.
// fun is applied element-by-element:
// for_each(fun, list(1, 2)) results in the calls fun(1) and fun(2).
// for_each returns true.
function for_each(fun, xs) {
  if (is_null(xs)) {
    return true;
  } else {
    fun(head(xs));
    return for_each(fun, tail(xs));
  }
}
`,r=`// list_to_string returns a string that represents the argument list.
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
`,a=`// reverse reverses the argument, assumed to be a list
function $reverse(original, reversed) {
  return is_null(original)
    ? reversed
    : $reverse(tail(original), pair(head(original), reversed));
}
function reverse(xs) {
  return $reverse(xs, null);
}
`,i=`// append first argument, assumed to be a list, to the second argument.
// In the result null at the end of the first argument list
// is replaced by the second argument, regardless what the second
// argument consists of.
function $append(xs, ys, cont) {
  return is_null(xs)
    ? cont(ys)
    : $append(tail(xs), ys, (zs) => cont(pair(head(xs), zs)));
}
function append(xs, ys) {
  return $append(xs, ys, (xs) => xs);
}

// member looks for a given first-argument element in the
// second argument, assumed to be a list. It returns the first
// postfix sublist that starts with the given element. It returns null if the
// element does not occur in the list
function member(v, xs) {
  return is_null(xs) ? null : v === head(xs) ? xs : member(v, tail(xs));
}
`,o=`// removes the first occurrence of a given first-argument element
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
`,u=`// Similar to remove, but removes all instances of v
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
`,l=`// filter returns the sublist of elements of the second argument
// (assumed to be a list), for which the given predicate function
// returns true.
function $filter(pred, xs, acc) {
  return is_null(xs)
    ? reverse(acc)
    : pred(head(xs))
    ? $filter(pred, tail(xs), pair(head(xs), acc))
    : $filter(pred, tail(xs), acc);
}
function filter(pred, xs) {
  return $filter(pred, xs, null);
}
`,m=`// enumerates numbers starting from start, assumed to be a number,
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
`,c=`// accumulate applies an operation op (assumed to be a binary function)
// to elements of sequence (assumed to be a list) in a right-to-left order.
// first apply op to the last element and initial, resulting in r1, then to
// the  second-last element and r1, resulting in r2, etc, and finally
// to the first element and r_n-1, where n is the length of the
// list.
// accumulate(op, zero, list(1, 2, 3)) results in
// op(1, op(2, op(3, zero)))
function $accumulate(f, initial, xs, cont) {
  return is_null(xs)
    ? cont(initial)
    : $accumulate(f, initial, tail(xs), (x) => cont(f(head(xs), x)));
}
function accumulate(f, initial, xs) {
  return $accumulate(f, initial, xs, (x) => x);
}
`,f=`// Supporting streams in the Scheme style, following
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
`,h=`// stream_to_list transforms a given stream to a list
// Lazy? No: stream_to_list needs to force the whole stream
function stream_to_list(xs) {
  return is_null(xs) ? null : pair(head(xs), stream_to_list(stream_tail(xs)));
}

// stream_length returns the length of a given argument stream
// throws an exception if the argument is not a stream
// Lazy? No: The function needs to explore the whole stream
function stream_length(xs) {
  return is_null(xs) ? 0 : 1 + stream_length(stream_tail(xs));
}
`,d=`// stream_map applies first arg f to the elements of the second
// argument, assumed to be a stream.
// f is applied element-by-element:
// stream_map(f,list_to_stream(list(1,2)) results in
// the same as list_to_stream(list(f(1),f(2)))
// stream_map throws an exception if the second argument is not a
// stream, and if the second argument is a nonempty stream and the
// first argument is not a function.
// Lazy? Yes: The argument stream is only explored as forced by
//            the result stream.
function stream_map(f, s) {
  return is_null(s)
    ? null
    : pair(f(head(s)), () => stream_map(f, stream_tail(s)));
}

// build_stream takes a function fun as first argument,
// and a nonnegative integer n as second argument,
// build_stream returns a stream of n elements, that results from
// applying fun to the numbers from 0 to n-1.
// Lazy? Yes: The result stream forces the applications of fun
//            for the next element
function build_stream(fun, n) {
  function build(i) {
    return i >= n ? null : pair(fun(i), () => build(i + 1));
  }
  return build(0);
}
`,_=`// stream_for_each applies first arg fun to the elements of the stream
// passed as second argument. fun is applied element-by-element:
// for_each(fun,list_to_stream(list(1, 2,null))) results in the calls fun(1)
// and fun(2).
// stream_for_each returns true.
// stream_for_each throws an exception if the second argument is not a
// stream, and if the second argument is a nonempty stream and the
// first argument is not a function.
// Lazy? No: stream_for_each forces the exploration of the entire stream
function stream_for_each(fun, xs) {
  if (is_null(xs)) {
    return true;
  } else {
    fun(head(xs));
    return stream_for_each(fun, stream_tail(xs));
  }
}

// stream_reverse reverses the argument stream
// stream_reverse throws an exception if the argument is not a stream.
// Lazy? No: stream_reverse forces the exploration of the entire stream
function stream_reverse(xs) {
  function rev(original, reversed) {
    return is_null(original)
      ? reversed
      : rev(
          stream_tail(original),
          pair(head(original), () => reversed)
        );
  }
  return rev(xs, null);
}
`,p=`// stream_append appends first argument stream and second argument stream.
// In the result, null at the end of the first argument stream
// is replaced by the second argument stream
// stream_append throws an exception if the first argument is not a
// stream.
// Lazy? Yes: the result stream forces the actual append operation
function stream_append(xs, ys) {
  return is_null(xs)
    ? ys
    : pair(head(xs), () => stream_append(stream_tail(xs), ys));
}

// stream_member looks for a given first-argument element in a given
// second argument stream. It returns the first postfix substream
// that starts with the given element. It returns null if the
// element does not occur in the stream
// Lazy? Sort-of: stream_member forces the stream only until the element is found.
function stream_member(x, s) {
  return is_null(s)
    ? null
    : head(s) === x
    ? s
    : stream_member(x, stream_tail(s));
}
`,x=`// stream_remove removes the first occurrence of a given first-argument element
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
`,g=`// stream_remove_all removes all instances of v instead of just the first.
// Lazy? Yes: the result stream forces the construction of each next element
function stream_remove_all(v, xs) {
  return is_null(xs)
    ? null
    : v === head(xs)
    ? stream_remove_all(v, stream_tail(xs))
    : pair(head(xs), () => stream_remove_all(v, stream_tail(xs)));
}
`,v=`// filter returns the substream of elements of given stream s
// for which the given predicate function p returns true.
// Lazy? Yes: The result stream forces the construction of
//            each next element. Of course, the construction
//            of the next element needs to go down the stream
//            until an element is found for which p holds.
function stream_filter(p, s) {
  return is_null(s)
    ? null
    : p(head(s))
    ? pair(head(s), () => stream_filter(p, stream_tail(s)))
    : stream_filter(p, stream_tail(s));
}

// enumerates numbers starting from start,
// using a step size of 1, until the number
// exceeds end.
// Lazy? Yes: The result stream forces the construction of
//            each next element
function enum_stream(start, end) {
  return start > end ? null : pair(start, () => enum_stream(start + 1, end));
}
`,y=`// integers_from constructs an infinite stream of integers
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
`,b=`// Returns the item in stream s at index n (the first item is at position 0)
// Lazy? Sort-of: stream_ref only forces the computation of
//                the first n elements, and leaves the rest of
//                the stream untouched.
function stream_ref(s, n) {
  return n === 0 ? head(s) : stream_ref(stream_tail(s), n - 1);
}
`,$=[e,n,t,s,r,a,i,o,u,l,m,c,f,h,d,_,p,x,g,v,y,b];export{$ as sourceThreePrelude};
