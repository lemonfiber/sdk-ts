/**
 * Reading an API Extractor report into its declarations, and the breaks of one
 * surface against another.
 */
import { describe, expect, it } from "vitest";
import { breaks, codeOf, declarations } from "./compare.mjs";

/** A report as API Extractor writes one, holding `code`, with the line endings it writes. */
const report = (code) =>
  ['## API Report File for "@lemonfiber/sdk-ts"', "", "```ts", "", code, "", "```", ""].join(
    "\r\n",
  );

/** A surface of one entry point holding `code`. */
const surface = (code, entry = "@lemonfiber/sdk-ts") => new Map([[entry, report(code)]]);

describe("reading a report", () => {
  it("reads the TypeScript between the fences, whatever line endings it was written with", () => {
    expect(codeOf(report("export type A = 1;"))).toBe("\nexport type A = 1;\n");
  });

  it("refuses a report holding no TypeScript", () => {
    expect(() => codeOf("## API Report File")).toThrow("the report holds no ```ts block");
  });

  it("keys each declaration by name, its comments no part of it, and each overload of one name together", () => {
    const read = declarations(
      report(
        [
          '// Warning: (ae-forgotten-export) The symbol "B" needs to be exported',
          "export interface A {",
          "    // (undocumented)",
          "    b: B;",
          "}",
          "export function f(a: string): void;",
          "export function f(a: number): void;",
          "export const one = 1, two = 2;",
          "export {};",
        ].join("\n"),
      ),
    );
    expect([...read.keys()]).toEqual(["A", "f", "one", "two"]);
    expect(read.get("A").members).toEqual(new Map([["b", "b: B;"]]));
    expect(read.get("f").text).toBe(
      "export function f(a: string): void; export function f(a: number): void;",
    );
  });
});

describe("what breaks", () => {
  it("finds nothing where the surfaces are the same, or the new one only adds", () => {
    const before = 'export interface A {\n    a: string;\n}\nexport type U = "x" | "y";';
    const after =
      'export interface A {\n    a: string;\n    b?: number;\n}\nexport type U = "x" | "y" | "z";\nexport type C = 1;';
    expect(breaks(surface(before), surface(before))).toEqual([]);
    expect(breaks(surface(before), surface(after))).toEqual([]);
  });

  it("names an entry point, a declaration and a member the new surface no longer holds", () => {
    const before = new Map([
      ...surface("export type A = 1;\nexport interface I {\n    a: string;\n}"),
      ...surface("export type C = 1;", "@lemonfiber/sdk-ts/contract"),
    ]);
    expect(breaks(before, surface("export interface I {\n    b: string;\n}"))).toEqual([
      "[BC] @lemonfiber/sdk-ts: `A` is removed",
      "[BC] @lemonfiber/sdk-ts: `I.a` is removed",
      "[BC] `@lemonfiber/sdk-ts/contract` is no longer an entry point",
    ]);
  });

  it("names a member whose declaration changed, of an interface, a class, an object type and an enum", () => {
    const before = [
      "export interface I {\n    a?: string | null;\n}",
      "export class K {\n    go(): void;\n}",
      'export type O = {\n    "/api/keys": string;\n};',
      "export enum E {\n    A = 1\n}",
    ].join("\n");
    const after = [
      "export interface I {\n    a?: Apis | null;\n}",
      "export class K {\n    go(): string;\n}",
      'export type O = {\n    "/api/keys": number;\n};',
      "export enum E {\n    A = 2\n}",
    ].join("\n");
    expect(breaks(surface(before), surface(after))).toEqual([
      "[BC] @lemonfiber/sdk-ts: `E.A` changed from `A = 1` to `A = 2`",
      "[BC] @lemonfiber/sdk-ts: `I.a` changed from `a?: string | null;` to `a?: Apis | null;`",
      "[BC] @lemonfiber/sdk-ts: `K.go` changed from `go(): void;` to `go(): string;`",
      '[BC] @lemonfiber/sdk-ts: `O./api/keys` changed from `"/api/keys": string;` to `"/api/keys": number;`',
    ]);
  });

  it("names a declaration whose head changed, what it extends or the sort of thing it is, its members aside", () => {
    expect(
      breaks(
        surface(
          "export interface I extends J {\n    a: string;\n}\nexport type O = {\n    a: string;\n};",
        ),
        surface(
          "export interface I {\n    a: string;\n}\nexport interface O {\n    a: string;\n}",
        ),
      ),
    ).toEqual([
      "[BC] @lemonfiber/sdk-ts: `I` changed from `export interface I extends J { a: string; }` to `export interface I { a: string; }`",
      "[BC] @lemonfiber/sdk-ts: `O` changed from `export type O = { a: string; };` to `export interface O { a: string; }`",
    ]);
  });

  it("names a union member the new union no longer admits", () => {
    expect(
      breaks(
        surface('export type RefusalCode = "STACK-2" | "STACK-3";'),
        surface('export type RefusalCode = "STACK-2" | "STACK-4";'),
      ),
    ).toEqual(['[BC] @lemonfiber/sdk-ts: `RefusalCode` no longer admits `"STACK-3"`']);
  });

  it("names any other declaration whose text changed, and one that changed what sort of declaration it is", () => {
    expect(
      breaks(
        surface(
          'export function f(a: string): void;\nexport const API_VERSION = 1;\nexport type U = "a" | "b";',
        ),
        surface(
          "export function f(a: number): void;\nexport const API_VERSION = 2;\nexport type U = string;",
        ),
      ),
    ).toEqual([
      "[BC] @lemonfiber/sdk-ts: `API_VERSION` changed from `export const API_VERSION = 1;` to `export const API_VERSION = 2;`",
      '[BC] @lemonfiber/sdk-ts: `U` changed from `export type U = "a" | "b";` to `export type U = string;`',
      "[BC] @lemonfiber/sdk-ts: `f` changed from `export function f(a: string): void;` to `export function f(a: number): void;`",
    ]);
  });
});
