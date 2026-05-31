import { execSync } from "child_process"

export function getChangedFiles() {
  const output = execSync("git diff --cached --name-only", {
    encoding: "utf-8"
  })

  return output
    .split("\n")
    .map(file => file.trim())
    .filter(Boolean)
}