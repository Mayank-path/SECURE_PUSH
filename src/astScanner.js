
import fs from "fs"

import { parse } from "@babel/parser"
import traverse from "@babel/traverse"

const sensitiveNames = [
  "password",
  "secret",
  "token",
  "apikey",
  "apiKey",
]

export function scanAST(file) {
  const issues = []

  const code = fs.readFileSync(file, "utf-8")

  const ast = parse(code, {
    sourceType: "module",
    plugins: ["jsx"]
  })

  traverse.default(ast, {
    VariableDeclarator(path) {
      const name = path.node.id.name

      const value = path.node.init

      if (
        sensitiveNames.includes(name) &&
        value &&
        value.type === "StringLiteral"
      ) {
        issues.push({
          file,
          line: value.loc.start.line,
          code: code.split("\n")[value.loc.start.line - 1].trim(),
          rule: "AST Hardcoded Secret",
          severity: "HIGH",
          suggestion:
            "Move sensitive value to environment variables"
        })
      }
    }
  })

  return issues
}

