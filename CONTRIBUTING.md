# **Contributing to ChartDB**

Thank you for your interest in contributing to ChartDB! We want to make your experience as easy as possible.

## How to Contribute

ChartDB's OSS Core is local-first: it must remain usable without accounts, cloud diagram storage, database passwords, or automatic uploads. Contributions should preserve that default unless a future Cloud/Team plan explicitly changes the scope.

### Submitting Pull Requests

To submit a pull request:

1. Fork the repository, create a branch from `main`, and focus on a single change.
2. Write clear, concise commit messages and ensure your code follows the project's guidelines.
3. Add or update tests for behavior changes. Use the smallest fixture that proves the behavior.
4. Run `npm run lint`, `npm run test:ci`, and `npm run build` before requesting review.
5. Open a pull request and clearly state what issue it addresses.
6. If needed, provide a brief explanation of your solution.
7. Submit your pull request for review.

### Reporting Bugs

If you find a bug, check [GitHub issues](https://github.com/Lynn-Lee/ChartDB/issues) to see if it is already reported. If not, use the bug report template and include:

- Clear reproduction steps.
- Browser, OS, ChartDB version, and deployment mode.
- A sanitized SQL, DBML, JSON backup, or Smart Query fixture when imported data is involved.
- Console output or screenshots when they clarify the failure.

For questions about using ChartDB, reach out via [Discord](https://discord.gg/QeFwyWSKwC). For feature requests, use the feature request template and describe the local-first impact.

### Dialect Regressions

Use the dialect regression issue template for import or export problems. A useful report includes:

- Dialect and database version.
- Flow: SQL import, DBML import, Smart Query import, SQL export, DBML export, import preview, or backup restore.
- Minimal sanitized fixture.
- Expected object counts, such as tables, relationships, custom types, warnings, and unsupported objects.
- Actual result and the last known working version if available.

Maintainers should convert accepted dialect regressions into focused fixtures or tests before changing parser behavior.

### Security Reports

Please do not open public issues for vulnerabilities. Use GitHub private vulnerability reporting:

https://github.com/Lynn-Lee/ChartDB/security/advisories/new

Security reports should include a private report summary, reproduction path, impacted version or deployment mode, and whether the issue affects IndexedDB data, imported schema content, Docker/Nginx runtime config, AI-assisted export, Markdown rendering, or generated SQL/DBML. Do not include active secrets, production database credentials, or private customer data.

### Creating a Branch

To get started:

1. Fork [the repository](https://github.com/Lynn-Lee/ChartDB/fork).
2. Create a branch from `main`.
3. If you’re new to GitHub pull requests, check out [this video series](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github).

### License

By contributing, you agree that your work will be licensed under ChartDB's [license](https://github.com/Lynn-Lee/ChartDB/blob/main/LICENSE).

## Questions?

Feel free to ask in `#contributing` on [Discord](https://discord.gg/QeFwyWSKwC) if you have questions about our process, how to proceed, etc.

---
