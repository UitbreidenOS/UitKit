---
name: app-store-deploy
description: Navigate App Store and Google Play submission — metadata, screenshots, review guidelines, and release management
allowed-tools: [Read, Write, Grep]
effort: medium
---

## When to activate

- Preparing app for first App Store/Play Store submission
- Creating store listings with optimized metadata
- Generating screenshots and app previews
- Navigating the review process and handling rejections
- Setting up phased releases and A/B testing store listings

## When NOT to use

- For internal/enterprise app distribution
- For web app deployment
- For desktop app distribution

## Instructions

1. **Pre-submission checklist.** Privacy policy URL, support URL, app icon (1024x1024), screenshots (all required sizes), age rating.
2. **App Store (iOS).** App Store Connect: create app record, upload build via Xcode/EAS, configure pricing/availability, fill metadata.
3. **Play Store (Android).** Google Play Console: create app, upload AAB, complete data safety form, set up store listing.
4. **Screenshots.** iPhone 6.7" + 6.5" (required), iPad 12.9" if universal. Android: phone + 7" + 10" tablet. Use tools like Fastlane snapshot.
5. **Review guidelines.** Apple: no placeholder content, no test accounts that expire, no private API usage. Google: policy compliance, target SDK version.
6. **Release strategy.** Internal testing → closed beta → phased rollout (1% → 5% → 20% → 100%). Monitor crash rates at each stage.
7. **Handle rejections.** Read rejection reason carefully, fix issue, resubmit. Use Resolution Center for appeals. Common: Guideline 4.0 (Design), 5.1.1 (Privacy).

## Example

```
Release Checklist — App Store v2.1.0:

Pre-build:
☐ Update version number (2.1.0) and build number (42)
☐ Update CHANGELOG.md
☐ Run full test suite (unit + integration + UI)
☐ Update screenshots if UI changed

Store metadata:
☐ What's New text (max 4000 chars)
☐ Description updated if features added
☐ Keywords reviewed (App Store only)

Release:
☐ Upload build to App Store Connect / Play Console
☐ Submit for review (App Store) / Rollout to 5% (Play Store)
☐ Monitor crash-free rate >99.5%
☐ Full rollout after 48h at 5%
```
