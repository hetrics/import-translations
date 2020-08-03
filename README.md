# @hetrics/import-translations

> Module to parse Google sheets CSV translations data to JSON and write them to file based on translation language sections.

### How to use

Install

```bash
npm install @hetrics/import-translations -D
```

In package.json, add a script `import translations` in the format below:

```json
{
    "scripts": {
        "update-translations": "node node_modules/@hetrics/import-translations/dist/index.js ${translations directory} ${published google sheet url}"
    },
}

```

After updating translations sheet, pull in new translations:

```bash
npm run update-translations
```

### Note

The script doesn't check if translations directory exists and will fail if it doesn't, so translations directory should be created before running the script for the first.
