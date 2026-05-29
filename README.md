<!-- prettier-ignore -->
<div align="center">

<img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/instagram.svg" alt="" width="64" height="64" style="filter: invert(1); opacity: 0.9;">

# instagram dm scraper

[![JavaScript](https://img.shields.io/badge/JavaScript-ES2020-yellow?style=flat-square&logo=javascript&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Bookmarklet](https://img.shields.io/badge/Type-Bookmarklet-blue?style=flat-square)](https://en.wikipedia.org/wiki/Bookmarklet)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[What it does](#what-it-does) • [How to use](#how-to-use) • [Features](#features) • [Export format](#export-format) • [FAQ](#faq)

</div>

A single-file browser bookmarklet that exports instagram direct messages as clean, structured json. No extensions, no serverside code, no credentials to configure — just paste and run.

> [!WARNING]
> This tool is for **personal backup and archival purposes only**. It reuses your active instagram session. Respect privacy laws and terms of service. Do not redistribute exported conversations without consent.

## What it does

When you run the script on [instagram.com](https://www.instagram.com), it injects a small, floating panel into the top-right corner of the page. From there you can:

1. **Search** for any user by username across your inbox and instagram's search index.
2. **Select** a conversation thread.
3. **Choose** a download mode — either the most recent n messages or the full chat history.
4. **Export** a chronological json file with participants, stats, and every message parsed into a readable schema.

The entire tool lives in one javascript file. There is no build step, no dependencies, and nothing to install.

## How to use

### Prerequisites

- A modern browser (chrome, firefox, edge, safari)
- An active instagram session (log in at [instagram.com](https://www.instagram.com))

### Running the scraper

1. Open instagram in your browser and ensure you are logged in.
2. Open the browser console (`f12` → console).
3. Copy the entire contents of [`ig_scraper.js`](ig_scraper.js).
4. Paste into the console and press **enter**.

A dark, draggable panel will appear in the top-right corner. From there:

- **Type a username** and click **find**.
- **Pick a thread** from the results.
- **Choose a mode** (recent or full history) and click **load**.
- **Download json** when the status reads ready.

> [!TIP]
> If the console warns about "pastings code", type `allow pasting` (firefox) or just paste and hit enter again. The script only touches the instagram page you are on and removes itself cleanly when closed.

### Workflow

```
search user → pick thread → choose mode → load messages → download json
```

The panel is fully draggable. If you need to move it, grab the top bar and drag anywhere on screen.

## Features

- **Zero setup** — single file, no build tools, no dependencies.
- **Dual search** — queries both your direct inbox and instagram's topsearch endpoint for reliable thread resolution.
- **Thread fallback** — if the thread isn't in search results, it attempts participant-based lookup and inbox scanning.
- **Paginated fetching** — automatically pages through message history with polite delays.
- **Rich message parsing** — handles text, photos, videos, voice messages, gifs, story replies, post shares, links, reactions, replies, and unsent messages.
- **Chronological export** — messages are sorted oldest-to-newest regardless of fetch direction.
- **Dark, minimal ui** — compact floating panel with monospace typography. designed to stay out of your way.

### Supported message types

| Type | Exported as |
|------|-------------|
| `text` | Plain text |
| `like` | `[like]` |
| `media` | `[image]` or `[video]` with url |
| `animated_media` | `[gif]` with url |
| `voice_media` | `[voice message]` with url and duration |
| `reel_share` / `story_share` | `[shared a story]` with context |
| `media_share` / `clip` / `felix_share` | `[shared a post]` with permalink |
| `link` | Url with title and summary |
| `placeholder` | `[unsupported message]` |
| `action_log` | System description |
| `reactions` | Emoji + sender mapping |
| `reply_to` | Original message snippet |
| `unsent` | `[unsent]` flag |

## Export format

The downloaded json follows a consistent schema:

```json
{
  "schema": "instagram-dm-export/v1",
  "exported_at": "2024-01-15 14:30:00 UTC",
  "export_options": {
    "mode": "latest",
    "requested_limit": 200,
    "downloaded_messages": 187
  },
  "participants": {
    "me": { "handle": "me", "user_id": "1234567890" },
    "peer": { "handle": "@username", "username": "username", "full_name": "name", "user_id": "..." }
  },
  "thread": {
    "id": "...",
    "url": "https://www.instagram.com/direct/t/.../"
  },
  "stats": {
    "total_messages": 187,
    "first_message_at": "2024-01-01 10:00:00 UTC",
    "last_message_at": "2024-01-15 14:30:00 UTC",
    "by_kind": { "text": 120, "media": 45, ... },
    "from_me": 93,
    "from_peer": 94
  },
  "messages": [
    {
      "id": "...",
      "sent_at": "2024-01-01 10:00:00 UTC",
      "from": "me",
      "kind": "text",
      "content": "hello"
    }
  ]
}
```

The `messages` array is sorted **oldest → newest** and every `content` field is a human-readable summary safe for further processing.

## FAQ

**Will this get my account banned?**

> [!NOTE]
> The script uses the same api endpoints and headers that the instagram web app already uses. It adds no extra requests beyond what a normal browsing session would generate. That said, use it sparingly and avoid hammering the api with excessive full-history exports.

**Do i need to enter my password?**

No. The script piggybacks on your existing browser session cookies (`csrftoken`, `ds_user_id`, `www-claim-v2`). If you are logged into instagram, it just works.

**Can i use this on mobile?**

Not easily. It is designed for desktop browsers where you can access the developer console. Mobile browsers generally restrict console access.

**Does it download media files?**

It extracts the original cdn urls for media (images, videos, voice notes) and includes them in the json. It does not bulk-download the actual files — you would need a separate downloader for that.

**What if the thread is not found?**

Make sure you have an existing conversation with that user. If the thread is very old or was deleted, it may not be resolvable. Start a fresh dm to make it discoverable.

**The panel disappeared, how do i get it back?**

Re-paste the script in the console. It will remove the old instance and create a fresh one.

**Can i change the message limit?**

Yes. The slider defaults to 200 recent messages. You can adjust it from 20 up to 5,000, or choose **full history** to fetch everything.

## How it works

Under the hood, the script:

1. Reads your active session cookies to authenticate requests.
2. Calls `/api/v1/web/search/topsearch/` and `/api/v1/direct_v2/inbox/` to locate the user and their thread id.
3. Paginates through `/api/v1/direct_v2/threads/{thread_id}/` 20 messages at a time.
4. Parses each message item into a normalized object with metadata.
5. Sorts the final collection and triggers a browser download.

The entire ui is built and styled inline — no external assets, no network requests beyond instagram's own api.

## Getting help

If you run into issues, check the browser console for error logs. The panel includes a live status feed that shows every api call and its result.

For bugs or questions, [open an issue](https://github.com/reavann/IGScraper/issues) on this repository.
