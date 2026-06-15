import chalk from "chalk";

export function reportIssues(issues, meta = {}) {
  console.log(
    chalk.cyan.bold(`
[SECUREPUSH] Security Scan Report
---------------------------------
`)
  );

  if (issues.length === 0) {
    console.log(chalk.green.bold("[PASSED] No security issues found\n"));
    return;
  }

  let high = 0;
  let medium = 0;
  let low = 0;

  for (const issue of issues) {
    const color =
      issue.severity === "HIGH"
        ? chalk.red
        : issue.severity === "MEDIUM"
        ? chalk.yellow
        : chalk.blue;

    if (issue.severity === "HIGH") high++;
    else if (issue.severity === "MEDIUM") medium++;
    else low++;

    console.log(color.bold(`[${issue.severity}] ${issue.rule}`));
    console.log(chalk.white(`File : ${issue.file}:${issue.line}`));
    console.log(chalk.gray(`Code : ${issue.code || "N/A"}`));
    console.log(chalk.cyan(`Fix  : ${issue.suggestion}`));
    console.log("");
  }

  console.log(chalk.white.bold("[SUMMARY]"));
  console.log(chalk.red(`HIGH   : ${high}`));
  console.log(chalk.yellow(`MEDIUM : ${medium}`));
  console.log(chalk.blue(`LOW    : ${low}`));
  console.log(chalk.white(`Files scanned : ${meta.filesScanned || 0}`));
  console.log(chalk.white(`Scan time     : ${meta.duration || 0}ms`));
  console.log("");
}