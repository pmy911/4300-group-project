# Syncro

**Fall 2024**

**Contributors**: Devon O'Quinn, Preston Young, Lily Krall, Justin Lee

## Description

Syncro is a simple calendar app that allows users to schedule tasks and events. It helps users organize their time effectively and manage their daily activities with ease.

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
# Remove the current `src` and `public` folders
rm -rf src
rm -rf public

# Pull the entire repository content
git init
git remote add origin https://github.com/pmy911/4300-group-project
git pull origin main --allow-unrelated-histories

# Set the upstream branch to enable pushing files
git branch --set-upstream-to=origin/main main

# only push source code
git add src
git commit -m 'commit message'
git push
```

> **Note**: Run `git branch --set-upstream-to=origin/main main` to ensure you can push files to the repository.

Additionally, install the following dependencies:

```bash
npm install--save mongoose
npm install dotenv
npm install bcrypt
npm install --save-dev @types/bcrypt
npm install next-auth@beta
npx auth secret 
npm i bcryptjs         
npm install --save-dev @types/bcryptjs
```

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
