export const rules = [
  {
    name: "MongoDB URI",
    regex: /mongodb(\+srv)?:\/\/[^\s"'`]+/gi,
    severity: "HIGH",
    suggestion: "Move MongoDB URI to .env and use process.env.MONGO_URI"
  },
  {
    name: "Database URL",
    regex: /(mysql|postgres|postgresql|redis):\/\/[^\s"'`]+/gi,
    severity: "HIGH",
    suggestion: "Move database URL to environment variables"
  },
  {
    name: "Private Key",
    regex: /-----BEGIN (RSA |OPENSSH |EC |DSA )?PRIVATE KEY-----/gi,
    severity: "HIGH",
    suggestion: "Never commit private keys. Remove the key and rotate it"
  },
  {
    name: "Hardcoded Secret",
    regex: /(password|passwd|pwd|secret|token|api[_-]?key)\s*[:=]\s*["'`]([^"'`]{4,})["'`]/gi,
    severity: "MEDIUM",
    suggestion: "Use environment variables instead of hardcoded values"
  },
  {
    name: "Debugger Statement",
    regex: /\bdebugger\b/g,
    severity: "LOW",
    suggestion: "Remove debugger before pushing code"
  },
  
  
]