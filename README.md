# GW3 Frontier - Ultimate Fan Hub & Podcast

Welcome to **GW3 Frontier**, the premier community fansite, podcast network, and merchandise hub dedicated to the future of the Guild Wars franchise (_Guild Wars 3_), alongside coverage for _Guild Wars 2_ and the upcoming _Guild Wars Reforge_.

This platform tracks breaking news, community discussions, game trailers, meta builds, and interactive resource maps.

---

## 🚀 Features & Roadmap

### Current Features

- **Verbatim Podcast Hub:** Streaming and cataloging of all narrative and analytical podcast episodes.
- **Merch Store Integration:** Official fan apparel, desk mats, and community accessories.
- **Automated Content Scraper:** A `.github/workflows/scrape.yml` action that periodically pulls relevant community updates and game data.

### Future Modules (Coming Soon)

- **Meta Build Section:** A comprehensive database for optimized character builds, attribute scaling, and class guides as mechanics drop.
- **Interactive Resource Map:** Spatial tracking of gathering nodes, points of interest, and regional objectives across Tyria.
- **Multi-Game News Hub:** Consolidated tracking expanding from GW2/GW3 to include _Guild Wars Reforge_ coverage post-launch.

---

## 🛠️ Project Structure

- `.github/workflows/scrape.yml` — Automated GitHub Action to scrape media, news, and external asset feeds.
- `public/` — Static assets including logos, product display graphics, maps, and local database entries (e.g., `Ancient_Orr_returns_in_Guild_Wars_3.json`).
- `src/app/` — Main Next.js core application views, layouts, and interactive section components.

---

## 🎙️ Content Management Procedures

### 1. How to Add a New Podcast Episode

To manually insert a new episode into your catalog (e.g., Episode 3), follow these steps:

1.  **Prepare Assets:** Ensure your promotional thumbnail is uploaded to `public/images/` if you are using local image hosting.
2.  **Locate Data Layer:** Open your tracking JSON file inside the `public/` directory or your dedicated data component (e.g., `src/app/data/podcastEpisodes.ts`).
3.  **Append Episode Object:** Add a new entry to the data array using the following schema:

````typescript
    {
      id: "3",
      title: "Episode 3: [Your Episode Title]",
      description: "Detailed description of the discussion topics, trailers reviewed, and community questions answered.",
      publishDate: "2026-06-24",
      youtubeVideoId: "YOUR_YOUTUBE_VIDEO_ID",
      audioUrl: "/audio/ep3.mp3", // If hosting native audio
      merchLinks: [
        { name: "Featured Desk Mat", url: "/merch/desk-mat" }
      ]
    }
    ```
4.  **Deploy:** Commit your changes to GitHub. If using an automated deployment platform like Vercel, your site will rebuild automatically.

### 2. Updating the Main YouTube Broadcast / Trailer
When ArenaNet releases a new trailer or you drop a breaking stream reaction video, you can rotate the main page broadcast embed:

1.  Open the file containing your primary video display landing logic (typically your main page or a `FeaturedVideo.tsx` component).
2.  Locate the iframe embed src code or the configuration constant holding the current YouTube ID.
3.  Replace the string value with your new YouTube Video ID:
```typescript
    const FEATURED_YOUTUBE_ID = "NEW_VIDEO_ID_HERE";
    ```
4.  Save, commit, and push to trigger a production build.

### 3. Integrating Guild Wars Reforge News
Following the release on the 24th, expand your news layout:
1.  Add a `"reforge"` filter flag to your master news JSON objects or database schema.
2.  Toggle the visibility UI element in your main feed to display your updated video breakdowns and patch notes alongside legacy GW2/GW3 data.

---

## 💻 Local Development

## 🤖 Automated Data Pipelines & Syncing

### The News Scraper & Git Conflicts
The site features an automated GitHub Actions workflow (`scrape.yml`) that runs in the cloud to scrape the latest community news[cite: 1].
* **The Mechanism:** The scraper runs on the server and automatically commits updates directly to `src/lib/api/news.json`.
* **The Risk:** Working locally without pulling the latest changes will cause a merge conflict in `news.json` when you try to sync or merge branches.

### Golden Rule for Development
Always run a pull command **before** touching any code locally to bring down the latest automated news entries:
```bash
git pull

First, install the dependencies:
```bash
npm install
````
