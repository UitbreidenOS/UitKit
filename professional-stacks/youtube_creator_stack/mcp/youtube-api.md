# YouTube API MCP Setup

## Overview

The YouTube Data API v3 provides access to channel analytics, video metadata, and performance metrics for analytics-tracker and competitor-analyzer skills.

## Prerequisites

1. **Google Cloud Account** — Free tier available
2. **YouTube Channel** — Account with creator/admin access
3. **API Key** — From Google Cloud Console

## Setup Steps

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (name it "YouTube Creator Stack")
3. Enable the YouTube Data API v3:
   - Search for "YouTube Data API v3"
   - Click "Enable"
4. Create an API key:
   - Go to "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the API key

### 2. Add to settings.json

```json
{
  "mcpServers": {
    "youtube": {
      "command": "npx",
      "args": ["-y", "youtube-mcp"],
      "env": {
        "YOUTUBE_API_KEY": "your-api-key-here",
        "YOUTUBE_CHANNEL_ID": "your-channel-id"
      }
    }
  }
}
```

### 3. Get Your Channel ID

1. Go to YouTube Studio
2. Click your profile icon → "Create a channel" or select existing
3. Go to "Settings" → "Channel" → Copy "Channel ID"
4. Add to settings.json as shown above

## Available Tools

### analytics-tracker

Fetch video performance metrics:

```
youtube.getVideoStats(videoId, metric)
```

**Metrics available:**
- `views` — Total views
- `watch_time_hours` — Total watch time in hours
- `average_view_duration` — Avg seconds per viewer
- `click_through_rate` — CTR %
- `impressions` — Total impressions
- `likes` — Total likes
- `comments` — Total comments
- `shares` — Total shares
- `subscribers_gained` — Subscriber gain

### competitor-analyzer

Fetch competitor channel analytics:

```
youtube.searchChannels(query, maxResults=10)
youtube.getChannelStats(channelId)
youtube.getChannelVideos(channelId, maxResults=10)
```

**Returns:**
- Channel subscriber count
- Total channel views
- Video upload history
- Top-performing videos
- Upload frequency

## Rate Limits

- **Free tier:** 10,000 units per day
- Cost per request: 1–5 units depending on API call
- Exceeding limit: Wait 24 hours before resuming

**Estimate:** ~2,000 analytics queries available per day (sufficient for daily tracking + competitive analysis)

## Troubleshooting

### Invalid API Key
- Verify key is copied correctly (no extra spaces)
- Ensure YouTube Data API v3 is enabled in Google Cloud Console
- Check quota hasn't been exceeded

### Channel ID Not Found
- Verify channel is public
- Copy full channel ID (format: `UC...`)
- Ensure account has admin/creator access

### No Analytics Available
- Wait 24–48 hours after publishing (YouTube processes analytics asynchronously)
- Video must be public (unlisted/private videos have no public analytics)

## Best Practices

1. **Cache results:** Don't call the same video's analytics twice in one session
2. **Batch requests:** Request multiple videos in one API call when possible
3. **Monitor quota:** Check remaining quota periodically (displayed in Google Cloud Console)
4. **Schedule wisely:** Run analytics-tracker 24–48 hours post-publish for best data

## Example Usage

```
# Track new video performance
youtube.getVideoStats("dQw4w9WgXcQ", "views")
youtube.getVideoStats("dQw4w9WgXcQ", "click_through_rate")

# Analyze competitor top videos
youtube.getChannelVideos("UCdYlqZngYWZmvxVTlJbEqcg", maxResults=5)

# Compare metrics across 3 videos
youtube.getVideoStats("video1_id", "watch_time_hours")
youtube.getVideoStats("video2_id", "watch_time_hours")
youtube.getVideoStats("video3_id", "watch_time_hours")
```

## Costs

- **Google Cloud free tier:** $0 for up to 10K units/day (sufficient)
- **Paid tier:** $4 per 1M units (if exceeding free tier)
- **Estimated monthly cost:** $0–$10 depending on usage

## References

- [YouTube Data API v3 Documentation](https://developers.google.com/youtube/v3)
- [Quota Calculator](https://developers.google.com/youtube/v3/docs/quota)
- [YouTube API Python SDK](https://github.com/googleapis/google-api-python-client)
