# OPEN WHEN ♡ — by KIMVERSE

A responsive React + Vite starter app for creating and keeping meaningful letters.

## Features
- Create, edit, open, print, and delete letters
- Categories and search
- Browser-local saving with `localStorage`
- Export a JSON backup and restore it later
- Responsive desktop and mobile layout
- Starter sample letters

## Run locally
1. Install Node.js (LTS) from https://nodejs.org/
2. Open a terminal in this project folder.
3. Run `npm install`
4. Run `npm run dev`
5. Open the local URL printed by Vite (usually http://localhost:5173).

## Build for deployment
Run `npm run build`. Vite creates the production site in `dist/`.

For Vercel:
- Import the GitHub repository.
- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`

## Important privacy and sharing notes
This first version stores letters only in the current browser on the current device. It does not create user accounts, sync between devices, or generate public share links. A browser-local password would not be secure, so this version does not pretend to provide server-side protection. Before adding real accounts or share links, connect a backend such as Supabase, add authentication and access rules, and test privacy carefully. Do not put private API keys in frontend code.

## Branding
Product: OPEN WHEN
Studio: KIMVERSE
Tagline: Create. Share. Feel. ♡
