// Adapted from https://github.com/source-academy/JSpike/blob/main/src/parser/parser.ts
// @ts-ignore missing type definitions
import { error, head, is_null, map, parse, tail } from "sicp";

type List<A> = null | [A, List<A>];

type Value = undefined | string | number | boolean;

type Literal = { tag: "lit"; val: Value };
type Name = { tag: "nam"; sym: string };
type Application = { tag: "app"; fun: SyntaxTree; args: List<SyntaxTree> };
type LogicalComposition = {
  tag: "log";
  sym: string;
  frst: SyntaxTree;
  scnd: SyntaxTree;
};
type BinaryOperation = {
  tag: "binop";
  sym: string;
  frst: SyntaxTree;
  scnd: SyntaxTree;
};
type ArrayAccess = { tag: "arr_acc"; arr: SyntaxTree; ind: SyntaxTree };
type ArrayAssignment = {
  tag: "arr_assmt";
  arr: SyntaxTree;
  ind: SyntaxTree;
  expr: SyntaxTree;
};
type LiteralArray = { tag: "arr_lit"; elems: [SyntaxTree] };
type UnaryOperation = { tag: "unop"; sym: string; frst: SyntaxTree };
type Decl = string | { tag: "rest"; sym: string };
type Lambda = { tag: "lam"; prms: [Decl]; body: SyntaxTree };
type Sequence = { tag: "seq"; stmts: [SyntaxTree] };
type ConditionalExpression = {
  tag: "cond_expr";
  pred: SyntaxTree;
  cons: SyntaxTree;
  alt: SyntaxTree;
};
type ConditionalStatement = {
  tag: "cond_stmt";
  pred: SyntaxTree;
  cons: SyntaxTree;
  alt: SyntaxTree;
};
type While = { tag: "while"; pred: SyntaxTree; body: SyntaxTree };
type For = {
  tag: "for";
  init: SyntaxTree;
  pred: SyntaxTree;
  upd: SyntaxTree;
  body: SyntaxTree;
};
type Break = { tag: "break" };
type Continue = { tag: "cont" };
type Block = { tag: "blk"; body: SyntaxTree };
type Let = { tag: "let"; sym: string; expr: SyntaxTree };
type Assignment = { tag: "assmt"; sym: string; expr: SyntaxTree };
type Const = { tag: "const"; sym: string; expr: SyntaxTree };
type Function = { tag: "fun"; sym: string; prms: [Decl]; body: SyntaxTree };
type Return = { tag: "ret"; expr: SyntaxTree };

type Import = { tag: "import"; syms: List<string>; from: string };
type This = { tag: "this" };
type Spread = { tag: "spread"; sym: string };
type Property = { tag: "prop"; sym: string };
type SyntaxTree =
  | Literal
  | Name
  | Application
  | BinaryOperation
  | UnaryOperation
  | LogicalComposition
  | Lambda
  | Sequence
  | ConditionalExpression
  | ConditionalStatement
  | While
  | Break
  | Continue
  | For
  | Block
  | Let
  | Const
  | Assignment
  | ArrayAccess
  | ArrayAssignment
  | LiteralArray
  | Function
  | Return
  | Import
  | This
  | Spread
  | Property;

function list_to_array(xs: any): any {
  return is_null(xs) ? [] : [head(xs)].concat(list_to_array(tail(xs)));
}

function parameters(xs: any) {
  return map(
    (x: any) =>
      head(x) === "rest_element"
        ? { tag: "rest", sym: head(tail(head(tail(x)))) }
        : head(tail(x)),
    xs
  );
}

// turn tagged list syntax from parse into object
function objectify(t: any): SyntaxTree {
  switch (head(t)) {
    case "literal":
      return { tag: "lit", val: head(tail(t)) };
    case "name":
      return { tag: "nam", sym: head(tail(t)) };
    case "application":
      return {
        tag: "app",
        fun: objectify(head(tail(t))),
        args: list_to_array(map(objectify, head(tail(tail(t))))),
      };
    case "logical_composition":
      return {
        tag: "log",
        sym: head(tail(t)),
        frst: objectify(head(tail(tail(t)))),
        scnd: objectify(head(tail(tail(tail(t))))),
      };
    case "binary_operator_combination":
      return {
        tag: "binop",
        sym: head(tail(t)),
        frst: objectify(head(tail(tail(t)))),
        scnd: objectify(head(tail(tail(tail(t))))),
      };
    case "object_access":
      return {
        tag: "arr_acc",
        arr: objectify(head(tail(t))),
        ind: objectify(head(tail(tail(t)))),
      };
    case "object_assignment":
      return {
        tag: "arr_assmt",
        arr: objectify(head(tail(head(tail(t))))),
        ind: objectify(head(tail(tail(head(tail(t)))))),
        expr: objectify(head(tail(tail(t)))),
      };
    case "array_expression":
      return {
        tag: "arr_lit",
        elems: list_to_array(map(objectify, head(tail(t)))),
      };
    case "unary_operator_combination":
      return {
        tag: "unop",
        sym: head(tail(t)),
        frst: objectify(head(tail(tail(t)))),
      };
    case "lambda_expression":
      return {
        tag: "lam",
        prms: list_to_array(parameters(head(tail(t)))),
        body: objectify(head(tail(tail(t)))),
      };
    case "sequence":
      return {
        tag: "seq",
        stmts: list_to_array(map(objectify, head(tail(t)))),
      };
    case "block":
      return {
        tag: "blk",
        body: objectify(head(tail(t))),
      };
    case "variable_declaration":
      return {
        tag: "let",
        sym: head(tail(head(tail(t)))),
        expr: objectify(head(tail(tail(t)))),
      };
    case "constant_declaration":
      return {
        tag: "const",
        sym: head(tail(head(tail(t)))),
        expr: objectify(head(tail(tail(t)))),
      };
    case "assignment":
      return {
        tag: "assmt",
        sym: head(tail(head(tail(t)))),
        expr: objectify(head(tail(tail(t)))),
      };
    case "conditional_statement":
      return {
        tag: "cond_stmt",
        pred: objectify(head(tail(t))),
        cons: objectify(head(tail(tail(t)))),
        alt: objectify(head(tail(tail(tail(t))))),
      };
    case "while_loop":
      return {
        tag: "while",
        pred: objectify(head(tail(t))),
        body: objectify(head(tail(tail(t)))),
      };
    case "for_loop":
      return {
        tag: "for",
        init: objectify(head(tail(t))),
        pred: objectify(head(tail(tail(t)))),
        upd: objectify(head(tail(tail(tail(t))))),
        body: objectify(head(tail(tail(tail(tail(t)))))),
      };
    case "break_statement":
      return {
        tag: "break",
      };
    case "continue_statement":
      return {
        tag: "cont",
      };
    case "conditional_expression":
      return {
        tag: "cond_expr",
        pred: objectify(head(tail(t))),
        cons: objectify(head(tail(tail(t)))),
        alt: objectify(head(tail(tail(tail(t))))),
      };
    case "function_declaration":
      return {
        tag: "fun",
        sym: head(tail(head(tail(t)))),
        prms: list_to_array(parameters(head(tail(tail(t))))),
        body: objectify(head(tail(tail(tail(t))))),
      };
    case "return_statement":
      return {
        tag: "ret",
        expr: objectify(head(tail(t))),
      };
    case "import_declaration":
      return {
        tag: "import",
        syms: map((x: any) => head(tail(x)), head(tail(t))),
        from: head(tail(tail(t))),
      };
    case "this_expression":
      return {
        tag: "this",
      };
    case "spread_element":
      return {
        tag: "spread",
        sym: head(tail(head(tail(t)))),
      };
    case "property":
      return {
        tag: "prop",
        sym: head(tail(t)),
      };
    default:
      throw error(t, "unknown syntax:");
  }
}

export function parse_into_json(program: string) {
  const obj = objectify(parse(program));
  const json = JSON.stringify(obj);
  return json;
}
