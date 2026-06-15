#!/usr/bin/env node

import { performance } from "perf_hooks"

import { getChangedFiles } from "../src/git.js"
import { scanFiles } from "../src/scanner.js"
import { reportIssues } from "../src/reporter.js"

const start = performance.now()

const files = getChangedFiles()

if (files.length === 0) {
  console.log("[PASSED] No staged files to scan")
  process.exit(0)
}

const result = scanFiles(files)

const issues = result.issues

const end = performance.now()

const duration = Math.round(end - start)

reportIssues(issues, {
  filesScanned: result.scannedFiles,
  duration,
})

const shouldBlockPush = issues.some(
  issue =>
    issue.severity === "HIGH" ||
    issue.severity === "MEDIUM"
)

if (shouldBlockPush) {
  console.log(
    "[BLOCKED] Push blocked due to security issues"
  )

  process.exit(1)
}

console.log("[PASSED] Push allowed")

process.exit(0)