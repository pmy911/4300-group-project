# Syncro

**Fall 2024**

**Contributors**: Devon O'Quinn, Preston Young, Lily Krall, Justin Lee

## Description

Syncro is a simple calendar app that allows users to schedule tasks and events. It helps users organize their time effectively and manage their daily activities with ease.

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [Features](#features)

## Installation

Follow these steps to install and set up the project:

```bash
# Initialize a Next.js app in your desired project directory
mkdir 4300-group-project
cd 4300-group-project
npx create-next-app@latest .

# When prompted, use the following settings:
# √ Would you like to use TypeScript? ... Yes
# √ Would you like to use ESLint? ... Yes
# √ Would you like to use Tailwind CSS? ... Yes
# √ Would you like your code inside a `src/` directory? ... Yes
# √ Would you like to use App Router? (recommended) ... Yes
# √ Would you like to use Turbopack for next dev? ... No
# √ Would you like to customize the import alias (@/* by default)? ... No
```

Ensure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed before running the commands.

```bash
# Remove the current `src` folder
rm -rf src
rm -rf public

# Pull the entire repository content
git init
git remote add origin https://github.com/pmy911/4300-group-project
git pull origin main

# Set the upstream branch to enable pushing files
git branch --set-upstream-to=origin/main main
```

> **Note**: Run `git branch --set-upstream-to=origin/main main` to ensure you can push files to the repository.

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

Provide instructions and examples for using your project. Include screenshots or code snippets to make it easier for users to understand.

## Features

- Schedule tasks and events easily
- View and manage your daily and upcoming schedules
- User-friendly interface for quick navigation
