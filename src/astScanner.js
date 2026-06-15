import fs from "fs";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";

const sensitiveNames = [
  "password",
  "secret",
  "token",
  "apikey",
  "apiKey",
  "api_key",
  "jwtSecret",
  "jwt_secret",
];

export function scanAST(file) {
  const issues = [];
  const code = fs.readFileSync(file, "utf-8");

  try {
    const ast = parse(code, {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
      errorRecovery: true,
    });

    traverse.default(ast, {
      VariableDeclarator(path) {
        const variableName = path.node.id?.name;
        const value = path.node.init;

        if (sensitiveNames.includes(variableName) && value?.type === "StringLiteral") {
          const line = value.loc.start.line;

          issues.push({
            file,
            line,
            code: code.split("\n")[line - 1].trim(),
            rule: "AST Hardcoded Secret",
            severity: "HIGH",
            suggestion: "Move sensitive value to environment variables",
          });
        }
      },

      CallExpression(path) {
        if (path.node.callee?.name === "eval") {
          const line = path.node.loc.start.line;

          issues.push({
            file,
            line,
            code: code.split("\n")[line - 1].trim(),
            rule: "AST Dangerous Eval",
            severity: "HIGH",
            suggestion: "Avoid eval because it can execute unsafe code",
          });
        }
      },

      AssignmentExpression(path) {
        const left = path.node.left;
      
        if (left?.type === "MemberExpression" && left.property?.name === "innerHTML") {
          const line = path.node.loc.start.line;
      
          issues.push({
            file,
            line,
            code: code.split("\n")[line - 1].trim(),
            rule: "AST Unsafe innerHTML",
            severity: "MEDIUM",
            suggestion: "Avoid innerHTML with user input. Use textContent or sanitize input.",
          });
        }
      }
    });
  } catch {
    return issues;
  }

  return issues;
}