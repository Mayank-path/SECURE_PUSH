
import fs from "fs"
import path from "path"
import { rules } from "./rules.js"
import { findHighEntropyStrings } from "./entropy.js"

const ignoreFilePath = path.join(process.cwd(), ".secureignore")

let customIgnores = []

if (fs.existsSync(ignoreFilePath)) {
  const content = fs.readFileSync(ignoreFilePath, "utf-8")

  customIgnores = content
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean)
}

function shouldSkipFile(file) {
  const ignoredFiles = [
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    "package.json",
    "src/rules.js"
  ]

  const ignoredFolders = [
    "node_modules",
    ".git",
    "dist",
    "build",
    "coverage",
  ]

  return (
    ignoredFiles.some(name => file.endsWith(name)) ||
    ignoredFolders.some(folder => file.includes(folder)) ||
    customIgnores.some(ignore => file.includes(ignore)) ||
    !fs.existsSync(file)
  )
}

function isSafeLine(line) {
  return (
    line.includes("process.env") ||
    line.includes("import.meta.env") ||
    line.includes("example") ||
    line.includes("dummy") ||
    line.includes("placeholder")
  )
}

function getLineIssues(file, line, lineNumber) {
  const issues = []

  if (isSafeLine(line)) return issues

  for (const rule of rules) {
    const matches = [...line.matchAll(rule.regex)]

    for (const match of matches) {
      issues.push({
        file,
        line: lineNumber,
        code: line.trim(),
        rule: rule.name,
        severity: rule.severity,
        suggestion: rule.suggestion
      })
    }
  }

  const entropyMatches = findHighEntropyStrings(line)

  for (const value of entropyMatches) {
    issues.push({
      file,
      line: lineNumber,
      code: line.trim(),
      rule: "High Entropy Secret",
      severity: "MEDIUM",
      suggestion:
        "This looks like a secret/token. Move it to environment variables"
    })
  }

  return issues
}

export function scanFiles(files) {
  const issues = []
  let scannedFiles = 0

  for (const file of files) {
    if (shouldSkipFile(file)) continue

    scannedFiles++

    const content = fs.readFileSync(file, "utf-8")
    const lines = content.split("\n")

    lines.forEach((line, index) => {
      const lineIssues = getLineIssues(
        file,
        line,
        index + 1
      )

      issues.push(...lineIssues)
    })
  }

  return {
    issues,
    scannedFiles
  }
}

