#!/usr/bin/env node

import { performance } from "perf_hooks"

import { getChangedFiles } from "../src/git.js"
import { scanFiles } from "../src/scanner.js"
import { reportIssues } from "../src/reporter.js"

const start = performance.now()

const files = getChangedFiles()

if (files.length === 0) {
  console.log("✅ SecurePush: No staged files to scan")
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

const hasHighIssue = issues.some(
  issue => issue.severity === "HIGH"
)

if (hasHighIssue) {
  console.log(
    "❌ Push blocked due to HIGH severity issue"
  )

  process.exit(1)
}

console.log("✅ Push allowed")

process.exit(0)

