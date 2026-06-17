---
name: push-notifications
description: Implement push notifications across iOS (APNs), Android (FCM), and cross-platform frameworks
allowed-tools: [Read, Write, Bash, Grep]
effort: medium
---

## When to activate

- Setting up push notification infrastructure
- Implementing notification handlers in mobile apps
- Configuring APNs certificates or FCM service accounts
- Designing notification payloads with actions and deep links
- Debugging notification delivery issues

## When NOT to use

- For email notification systems
- For in-app messaging only
- For SMS notification services

## Instructions

1. **Choose provider.** Firebase Cloud Messaging (FCM) for both platforms, or APNs + FCM separately for more control.
2. **iOS setup.** Generate APNs key (.p8) in Apple Developer Portal. Configure in FCM console or custom server.
3. **Android setup.** Create Firebase project, download `google-services.json`. Configure FCM in AndroidManifest.xml.
4. **Client implementation.** Request permission, register for token, handle foreground/background/killed states, implement action buttons.
5. **Server-side.** Token management, payload construction, scheduling, batching. Use topics for broadcast, tokens for targeted.
6. **Deep linking.** Include deep link URL in notification payload. App opens to specific screen on tap.
7. **Testing.** Test on real devices (simulators don't receive push). Use FCM console or Postman for test sends.

## Example

```json
{
  "notification": {
    "title": "New message from Alex",
    "body": "Hey, are you free for lunch today?",
    "image": "https://cdn.example.com/avatar/alex.jpg"
  },
  "data": {
    "type": "message",
    "conversationId": "conv_123",
    "deepLink": "app://chat/conv_123"
  },
  "android": {
    "priority": "high",
    "notification": { "channel_id": "messages" }
  },
  "apns": {
    "payload": {
      "aps": { "sound": "default", "badge": 1, "category": "MESSAGE" }
    }
  }
}
```
