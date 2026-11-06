/**
 * The public surface of the package as API Extractor reports it, read into its
 * declarations, and the ways one surface breaks what another offered.
 *
 * A declaration is keyed by the entry point that reports it and its name. A
 * name an entry no longer reports, a member an interface, class, enum or object
 * type no longer holds, a member whose declaration changed, a union that lost a
 * member, and any other change to a declaration's text are each a break. A union
 * that only gained members, and a declaration or member that only arrived, are
 * not: a reader of the old surface reads the new one. Comments, `// Warning:`
 * lines included, are no part of a declaration.
 */
import ts from "typescript";

const printer = ts.createPrinter({ removeComments: true });

/** The TypeScript an API Extractor report holds, between its opening ```ts fence and the fence closing it. */
export function codeOf(written) {
  const report = written.replaceAll("\r\n", "\n");
  const opened = report.indexOf("```ts\n");
  const closed = report.lastIndexOf("\n```");
  if (opened === -1 || closed <= opened) throw new Error("the report holds no ```ts block");
  return report.slice(opened + "```ts\n".length, closed);
}

/** A node as the printer writes it, comments and formatting aside. */
const written = (node, file) =>
  printer.printNode(ts.EmitHint.Unspecified, node, file).replaceAll(/\s+/g, " ").trim();

/** The name a member is declared under, or its text where it has none a reader can name. */
function memberName(member, file) {
  if (member.name !== undefined)
    return member.name.getText(file).replaceAll(/^["']|["']$/g, "");
  return written(member, file);
}

/** Each member of an interface, class or object type, by name, each overload of one name together. */
function membersOf(members, file) {
  const held = new Map();
  for (const member of members) {
    const name = memberName(member, file);
    held.set(name, [...(held.get(name) ?? []), written(member, file)]);
  }
  return new Map([...held].map(([name, texts]) => [name, texts.toSorted().join(" ")]));
}

/** What a declaration says beside its members or its union: its sort, modifiers, type parameters and what it extends. */
function headOf(statement, file) {
  const parts = [statement.modifiers, statement.typeParameters, statement.heritageClauses]
    .flatMap((nodes) => [...(nodes ?? [])])
    .map((node) => written(node, file));
  return [ts.SyntaxKind[statement.kind], ...parts].join(" ");
}

/** What one declaration offers: its text, and its members or union members where it has them. */
function offered(statement, file) {
  const text = written(statement, file);
  const head = headOf(statement, file);
  if (
    ts.isInterfaceDeclaration(statement) ||
    ts.isClassDeclaration(statement) ||
    ts.isEnumDeclaration(statement)
  ) {
    return { text, head, members: membersOf(statement.members, file) };
  }
  if (ts.isTypeAliasDeclaration(statement)) {
    if (ts.isTypeLiteralNode(statement.type)) {
      return { text, head, members: membersOf(statement.type.members, file) };
    }
    if (ts.isUnionTypeNode(statement.type)) {
      return {
        text,
        head,
        union: new Set(statement.type.types.map((type) => written(type, file))),
      };
    }
  }
  return { text, head };
}

/** The names a statement declares: one for a declaration, each for a variable statement. */
function namesOf(statement) {
  if (ts.isVariableStatement(statement))
    return statement.declarationList.declarations.map((one) => one.name.getText());
  if (statement.name !== undefined) return [statement.name.text];
  return [];
}

/** Every declaration a report holds, by name, each overload of one name together. */
export function declarations(report) {
  const file = ts.createSourceFile("report.d.ts", codeOf(report), ts.ScriptTarget.Latest, true);
  const found = new Map();
  for (const statement of file.statements) {
    for (const name of namesOf(statement)) {
      const one = offered(statement, file);
      const held = found.get(name);
      found.set(name, held === undefined ? one : { text: `${held.text} ${one.text}` });
    }
  }
  return found;
}

/** Each way the members `after` holds break the members `before` held, under `name`. */
function memberBreaks(name, before, after) {
  const found = [];
  for (const [member, text] of before) {
    if (!after.has(member)) found.push(`\`${name}.${member}\` is removed`);
    else if (after.get(member) !== text)
      found.push(`\`${name}.${member}\` changed from \`${text}\` to \`${after.get(member)}\``);
  }
  return found;
}

/** Each way one declaration breaks what it offered before, under `name`. */
function declarationBreaks(name, before, after) {
  if (before.text === after.text) return [];
  if (before.head !== after.head)
    return [`\`${name}\` changed from \`${before.text}\` to \`${after.text}\``];
  if (before.members !== undefined && after.members !== undefined)
    return memberBreaks(name, before.members, after.members);
  if (before.union !== undefined && after.union !== undefined) {
    return [...before.union]
      .filter((member) => !after.union.has(member))
      .map((member) => `\`${name}\` no longer admits \`${member}\``);
  }
  return [`\`${name}\` changed from \`${before.text}\` to \`${after.text}\``];
}

/**
 * Each way the surface `after` breaks the surface `before`, as lines, sorted.
 *
 * Each surface is a map from an entry point's import specifier to the report
 * API Extractor wrote for it.
 */
export function breaks(before, after) {
  const found = [];
  for (const [entry, report] of before) {
    if (!after.has(entry)) {
      found.push(`[BC] \`${entry}\` is no longer an entry point`);
      continue;
    }
    const was = declarations(report);
    const now = declarations(after.get(entry));
    for (const [name, declaration] of was) {
      const lines = now.has(name)
        ? declarationBreaks(name, declaration, now.get(name))
        : [`\`${name}\` is removed`];
      found.push(...lines.map((line) => `[BC] ${entry}: ${line}`));
    }
  }
  return found.toSorted();
}
