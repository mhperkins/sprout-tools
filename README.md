# Sprout Society Tools

An internal dashboard for Sprout Society with two integrated tools: a **Grant Manager** for finding and tracking grant applications, and a **Social Manager** for planning and publishing Instagram content.

---

## Features

### Grant Manager
- Search for grants with AI-powered web search
- Save grants and track application status
- Manage deadlines with a dashboard overview
- Write and store grant answers, notes, and task lists per application
- Auto-search schedules with notifications for new matches
- Org profile builder for reusable application content
- Document and strategy library upload
- AI chat assistant for drafting and research

### Social Manager
- Content calendar (day / week / month views)
- Draft, approve, and schedule posts
- Publish images, carousels, reels, and stories directly to Instagram
- Import existing Instagram media
- AI caption generation with brand voice settings
- Analytics dashboard with engagement metrics
- Media library (Cloudinary)
- Archive and chat history

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, Tailwind CSS v4
- **Auth & Database:** Supabase
- **AI:** Anthropic Claude API (claude-sonnet-4)
- **Instagram:** Composio proxy → Instagram Graph API
- **Media:** Cloudinary

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Anthropic
ANTHROPIC_API_KEY=

# Composio + Instagram
COMPOSIO_API_KEY=
COMPOSIO_CONNECTED_ACCOUNT_ID=
IG_USER_ID=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
app/
  page.js                  # Auth + tool hub (home screen)
  api/
    ai/route.js            # Anthropic API proxy
    ai/cloudinary/route.js # Cloudinary media fetch
    ai/upload/             # Media upload routes
    instagram/route.js     # Instagram publish/fetch via Composio
components/
  GrantManager.jsx         # Full grant management UI
  SocialManager.jsx        # Full social media management UI
```
