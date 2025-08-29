# LINE Dictionary Bot

A serverless LINE chatbot built with Next.js 15 and TypeScript. Send any English word and the bot replies with noun and verb definitions plus synonyms. Built as a coding test.

## Requirements fulfilled
- Next.js App Router, deployable on Vercel
- LINE Messaging API webhook (`POST /api/line/webhook`)
- Dictionary lookups via `api.dictionaryapi.dev`
- Optional synonyms (up to 5) for each part of speech
- TypeScript types for dictionary responses and LINE events

## Local development
1. Install dependencies
   ```bash
   npm install
   ```
2. Copy `.env.local.example` to `.env.local` and fill in your LINE credentials
   ```bash
   cp .env.local.example .env.local
   ```
3. Run the dev server
   ```bash
   npm run dev
   ```

  Visit `http://localhost:3000/` for a simple info page and `http://localhost:3000/qr` for the QR code.

## Deploy (Vercel)
Deploy this repository to Vercel. The project is serverless-ready and uses the Node.js runtime where needed.

After deployment, set the webhook URL in the [LINE Developers console](https://developers.line.biz/) to:
```
https://<your-domain>/api/line/webhook
```

## Usage examples
- Input: `Mango`
  ```
  ■ Noun: A tropical Asian fruit tree, Mangifera indica.
  ■ Verb: To stuff and pickle (a fruit).
  ```
- Input: `Tiger`
  ```
  ■ Noun: Panthera tigris, a large predatory mammal of the cat family, indigenous to Asia.
  ```
- If no noun or verb found:
  ```
  Sorry, I couldn't find a noun/verb definition for "<word>".
  ```

## QR code
Add your LINE Add Friend QR image to the `public/` directory and update `/app/qr/page.tsx` to reference it. The `/qr` route currently renders a placeholder box.

## Environment variables
Configure the following variables (see `.env.local.example`):
```
LINE_CHANNEL_SECRET=your_line_channel_secret
LINE_CHANNEL_ACCESS_TOKEN=your_line_channel_access_token
```

These are used for request verification and replying via the LINE Messaging API.

## Sharing
To share your bot, provide:
- This GitHub repository
- Your bot's LINE ID
- The QR code (uploaded to `public/` and shown on `/qr`)
