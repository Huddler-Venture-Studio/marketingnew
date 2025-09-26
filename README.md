# Huddler Marketing Website

Fully featured marketing website for Huddler.

- 🔸 Perfect for showcasing Huddler's features and capabilities
- 🔸 Fully editable from BaseHub CMS
- 🔸 Comes with Search, Dark/Light Mode, Analytics, and more
- 🔸 Newsletter integration with Resend email service
- 🔸 Direct links to Docs and Knowledge Base

## Stack

- Next.js 15
- BaseHub CMS
- Tailwind CSS 
- Resend for email newsletters
- TypeScript

## Local Development

**Install dependencies**
```bash
npm install
```

**Add your environment variables to `.env.local`**
```txt
# .env.local

# BaseHub CMS
BASEHUB_TOKEN="<get-it-from-your-basehub-repo>"

# Resend for newsletters
RESEND_API_KEY="<your-resend-api-key>"
```

**Start the dev server**
```bash
npm run dev
```

## Environment Variables

- `BASEHUB_TOKEN`: Required for BaseHub CMS integration
- `RESEND_API_KEY`: Required for newsletter functionality using Resend
- Domain for emails: `*@notifications.huddler.io`

## Features

- **Newsletter Integration**: Custom newsletter signup with Resend email service
- **Navigation Links**: Direct links to docs.huddler.io and knowledge.huddler.io
- **Responsive Design**: Mobile-first responsive layout
- **Dark/Light Mode**: Theme switching capability
- **SEO Optimized**: Meta tags and structured data
- **BaseHub CMS**: Content management through BaseHub
