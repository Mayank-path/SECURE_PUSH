# 🔐 SecurePush

SecurePush is a Git-integrated security scanner that prevents insecure code and sensitive information from entering version control. It automatically scans staged files before commits and blocks high-risk changes using Husky pre-commit hooks.

---

## Features

### AST-Based Security Analysis

SecurePush uses Abstract Syntax Tree (AST) traversal to detect:

* Hardcoded secrets
* Dangerous `eval()` usage
* Unsafe `innerHTML` assignments

### Rule-Based Security Detection

Detects common security risks such as:

* MongoDB connection URIs
* Sensitive committed files (`.env`, `.pem`, `.key`)
* Debugger statements

### Entropy Analysis

Identifies suspicious high-entropy strings that may represent:

* API Keys
* JWT Tokens
* Access Tokens
* Secrets

### Git Hook Integration

Automatically scans staged files before every commit using Husky.

### Custom Ignore System

Supports repository-specific exclusions through:

```txt
.secureignore
```

### Commit Protection

Blocks commits when HIGH or MEDIUM severity issues are detected.

---

## Architecture

```txt
Git Commit
     │
     ▼
Husky Pre-Commit Hook
     │
     ▼
SecurePush Scanner
     │
     ├── AST Analysis
     ├── Regex Rules
     ├── Entropy Analysis
     └── Sensitive File Detection
     │
     ▼
Security Report
     │
     ▼
Allow Commit / Block Commit
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/Mayank-path/SECURE_PUSH.git
cd SECURE_PUSH
```

Install dependencies:

```bash
npm install
```

Verify the installation:

```bash
npm run scan
```

---

## Usage

Scan staged files:

```bash
node bin/index.js
```

Commit normally:

```bash
git add .
git commit -m "message"
```

SecurePush will automatically run before the commit is created.

---

## Example Security Detection

### Hardcoded Secret

```js
const password = "admin123";
```

Output:

```txt
[HIGH] AST Hardcoded Secret
[BLOCKED] Push blocked due to security issues
```

---

### Dangerous Eval

```js
eval("console.log('danger')");
```

Output:

```txt
[HIGH] AST Dangerous Eval
```

---

### Unsafe innerHTML

```js
document.body.innerHTML = userInput;
```

Output:

```txt
[MEDIUM] AST Unsafe innerHTML
```

---

## Screenshots

### Security Issues Detected

<img width="682" height="156" alt="image" src="https://github.com/user-attachments/assets/42bd5818-cbdf-446a-82ca-cc1a90d1c9db" />

---

### Commit Blocked

<img width="695" height="302" alt="image" src="https://github.com/user-attachments/assets/fc4b24ca-4e9d-45ce-9a91-d8ff6aa893bd" />

---

### Clean Security Scan

<img width="326" height="157" alt="image" src="https://github.com/user-attachments/assets/63ed7aa1-2d5d-4f4e-98e7-ca7055a7f4b7" />

---

## Supported Detections

| Severity | Detection                |
| -------- | ------------------------ |
| HIGH     | AST Hardcoded Secret     |
| HIGH     | AST Dangerous Eval       |
| HIGH     | MongoDB URI              |
| HIGH     | Sensitive File Committed |
| MEDIUM   | AST Unsafe innerHTML     |
| MEDIUM   | High Entropy Secret      |
| LOW      | Debugger Statement       |

---

## Project Structure

```txt
SECURE_PUSH
│
├── bin
│   └── index.js
│
├── src
│   ├── astScanner.js
│   ├── entropy.js
│   ├── git.js
│   ├── reporter.js
│   ├── rules.js
│   └── scanner.js
│
├── .husky
├── .secureignore
├── package.json
└── README.md
```

---

## Future Improvements

* Additional AST security rules
* GitHub Actions integration
* NPM package publishing
* Repository-wide audit mode

---

## Why SecurePush?

Most secret leaks occur because sensitive data reaches Git history before review. SecurePush shifts security left by identifying vulnerabilities during development and preventing risky code from being committed in the first place.

---

## License

This project is licensed under the MIT License.
