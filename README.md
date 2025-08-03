# Merge Doctor

A UI for previewing merges and running repetitive tasks - with support for remote dev environments.

## Prerequisites

- Node.js (v22 or higher)
- Rust (latest stable)
- Unix-based operating system (macOS or Linux)
- Cargo (Rust package manager)
- pnpm (v10 or higher)

## Development Setup

1. Install dependencies:
```bash
pnpm install
```

## Available Scripts

- `pnpm tauri dev` - Start the development server
- `pnpm build` - Build the production version
- `pnpm lint` - Run Biome linting
- `pnpm format` - Format code using Biome

## Code Quality Tools

### Biome

We use Biome for consistent code formatting and linting. The configuration can be found in `biome.json`.

Key features:
- JavaScript/TypeScript linting
- Automatic code formatting
- Import sorting
- Consistent code style enforcement

### Lefthook

Lefthook is used for managing Git hooks. Configuration is in `lefthook.yml`.

Current hooks:
- pre-commit: Runs Biome formatting and linting

## Building for Production

1. Ensure all dependencies are installed:
```bash
pnpm install
```

2. Build the application:
```bash
pnpm tauri build
```

The built application will be available in the `src-tauri/target/release` directory.

## Notes

- Currently only supports Unix-based systems (macOS and Linux)
- Windows support planned for future releases
