---
name: rss-feed-manager
description: Configure, validate, and maintain podcast RSS feeds for Apple Podcasts, Spotify, and directory submissions
allowed-tools: [Read, Write, Bash, Grep]
effort: medium
---

## When to activate

- Setting up a new podcast RSS feed
- Validating feed against Apple/Spotify requirements
- Updating episode metadata in the feed
- Troubleshooting feed errors or missing episodes
- Migrating between podcast hosting platforms

## When NOT to use

- For audio editing or production
- For social media distribution
- For analytics and listener stats

## Instructions

1. **Validate feed structure.** Check RSS 2.0 compliance + podcast namespace tags (itunes:, podcast:, content:).
2. **Verify required tags.** Title, description, author, language, category, explicit flag, image (1400x1400 to 3000x3000px).
3. **Check episode items.** Each episode: title, description, enclosure (MP3 URL, file size, type), pubDate, guid.
4. **Test feed validity.** Run through podcast feed validators (Podbase, Cast Feed Validator).
5. **Update show metadata.** Season/episode numbers, episode type (full/trailer/bonus), content advisory.
6. **Handle migration.** If switching hosts: 301 redirect old feed URL to new, update all directories, verify no episodes lost.
7. **Monitor directory status.** Check Apple Podcasts Connect and Spotify for Podcasters for feed errors or rejections.

## Example

```xml
<item>
  <title>Ep 42: Scaling APIs to 10M Requests/Day</title>
  <description>Show notes here...</description>
  <enclosure url="https://cdn.example.com/ep42.mp3" length="45678900" type="audio/mpeg"/>
  <pubDate>Fri, 13 Jun 2026 08:00:00 GMT</pubDate>
  <guid isPermaLink="false">ep-42-scaling-apis</guid>
  <itunes:episode>42</itunes:episode>
  <itunes:season>3</itunes:season>
  <itunes:episodeType>full</itunes:episodeType>
  <itunes:duration>00:35:00</itunes:duration>
</item>
```
