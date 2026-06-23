# Community Forum System

Complete internal forum/discussion platform for Claudient users with categories, gamification, reputation tracking, and leaderboards.

## Features

- **5 Categories**: Skills Showcase, Questions, Feature Requests, Bug Reports, Off-Topic
- **Posts & Replies**: Hierarchical discussions with voting
- **Gamification**:
  - 8 badge types (First Post, Helpful Contributor, Question Answerer, etc.)
  - Reputation scoring system
  - Leaderboard rankings
  - User activity tracking
- **Engagement**: Upvoting, marked helpful, accepted answers
- **Search & Discovery**: Full-text search, trending posts, category filtering
- **Analytics**: User stats, engagement metrics, category breakdowns

## Quick Start

### Basic Usage

```javascript
const { CommunityForum, CATEGORIES } = require('./community-forum');

const forum = new CommunityForum();

// Create user
forum.createUser('alice', { name: 'Alice', bio: 'Developer' });

// Create post
const post = forum.createPost({
  userId: 'alice',
  category: CATEGORIES.SKILLS_SHOWCASE,
  title: 'My New Skill',
  content: 'I just learned something cool!',
  tags: ['learning', 'skills']
});

// Reply to post
forum.createReply({
  postId: post.id,
  userId: 'bob',
  content: 'Great tips!'
});

// Upvote
forum.upvotePost(post.id, 'bob');

// View leaderboard
const leaderboard = forum.getLeaderboard(10);
console.log(leaderboard);
```

## API Reference

### User Management

#### `createUser(userId, profile)`
Create a new forum user.

**Parameters:**
- `userId` (string): Unique identifier
- `profile` (object):
  - `name` (string): Display name
  - `avatar` (string): Avatar URL
  - `bio` (string): User bio

**Returns:** User object

**Example:**
```javascript
const user = forum.createUser('alice', {
  name: 'Alice Developer',
  bio: 'Full-stack engineer'
});
```

#### `getOrCreateUser(userId, profile)`
Get existing user or create if doesn't exist.

#### `getUserProfile(userId)`
Get complete user profile with stats and badges.

**Returns:**
```javascript
{
  id: 'alice',
  name: 'Alice',
  reputation: 150,
  postCount: 5,
  replyCount: 12,
  badges: ['first-post', 'helpful-contributor'],
  stats: {
    totalUpvotes: 25,
    totalViews: 150,
    acceptedReplies: 3,
    rank: 2
  }
}
```

#### `getUserActivity(userId)`
Get activity summary for a user.

**Returns:**
```javascript
{
  userId: 'alice',
  reputation: 150,
  badges: [
    { type: 'first-post', label: 'First Post', awardedAt: '...' }
  ],
  postsCreated: 5,
  repliesCreated: 12,
  acceptedAnswers: 3,
  totalUpvotes: 25,
  joinedAt: '...',
  lastActivityAt: '...'
}
```

#### `getUserRank(userId)`
Get user's leaderboard rank (1-based) or -1 if not in top 100.

### Posts & Replies

#### `createPost(options)`
Create a new forum post.

**Parameters:**
- `userId` (string): Post author
- `category` (string): One of CATEGORIES values
- `title` (string): Post title
- `content` (string): Post content
- `tags` (array): Optional tag list

**Reputation Reward:** 10 points

**Returns:** Post object

**Example:**
```javascript
const post = forum.createPost({
  userId: 'alice',
  category: CATEGORIES.QUESTIONS,
  title: 'How to optimize React?',
  content: 'My app is slow...',
  tags: ['react', 'performance']
});
```

#### `createReply(options)`
Create a reply on a post.

**Parameters:**
- `postId` (string): Target post ID
- `userId` (string): Reply author
- `content` (string): Reply text

**Reputation Reward:** 5 points

**Returns:** Updated post object

#### `getPostsByCategory(category, options)`
Get posts filtered by category.

**Parameters:**
- `category` (string): Category name
- `options` (object):
  - `sortBy` (string): 'recent' | 'popular' | 'views'
  - `limit` (number): Max posts to return (default: 20)

**Returns:** Array of posts

**Example:**
```javascript
const questions = forum.getPostsByCategory(CATEGORIES.QUESTIONS, {
  sortBy: 'recent',
  limit: 10
});
```

#### `searchPosts(query)`
Search posts by title, content, or tags.

**Parameters:**
- `query` (string): Search term

**Returns:** Array of matching posts

**Example:**
```javascript
const results = forum.searchPosts('react hooks');
```

### Voting & Engagement

#### `upvotePost(postId, userId)`
Upvote a post.

**Reputation Reward:** +3 points to post author

**Returns:** Updated post

**Throws:** Error if user already upvoted

#### `upvoteReply(postId, replyId, userId)`
Upvote a reply.

**Reputation Reward:** +2 points to reply author

**Returns:** Updated post

#### `acceptReply(postId, replyId, accepterUserId)`
Mark a reply as accepted answer (for questions).

**Reputation Reward:** +25 points to reply author

**Requirements:** Only post author can accept

**Returns:** Updated post

**Example:**
```javascript
// Question author accepts best answer
forum.acceptReply(postId, replyId, 'alice');
```

#### `markHelpful(postId, userId)`
Mark a post as helpful.

**Reputation Reward:** +15 points to post author

**Returns:** Updated post

### Gamification

#### Badges

8 badge types automatically awarded:

| Badge | Trigger | Reward |
|-------|---------|--------|
| `FIRST_POST` | First post created | 50 rep |
| `HELPFUL_CONTRIBUTOR` | 50+ total upvotes | 50 rep |
| `QUESTION_ANSWERER` | 10+ accepted answers | 50 rep |
| `BUG_HUNTER` | Manual award (admin) | 50 rep |
| `FEATURE_INNOVATOR` | Manual award (admin) | 50 rep |
| `RESPECTED_MEMBER` | Manual award (admin) | 50 rep |
| `TRENDING_AUTHOR` | Manual award (admin) | 50 rep |
| `SKILL_MASTER` | Manual award (admin) | 50 rep |

#### `awardBadge(userId, badgeType, label)`
Manually award a badge to a user.

**Parameters:**
- `userId` (string): Recipient
- `badgeType` (string): Badge type constant
- `label` (string): Display label

**Example:**
```javascript
const { BADGE_TYPES } = require('./community-forum');
forum.awardBadge('alice', BADGE_TYPES.BUG_HUNTER, 'Bug Hunter');
```

### Rankings & Discovery

#### `getLeaderboard(limit)`
Get top users by reputation.

**Parameters:**
- `limit` (number): Max users (default: 10)

**Returns:** Array of users with stats

**Example:**
```javascript
const top10 = forum.getLeaderboard(10);
// [
//   { userId: 'alice', name: 'Alice', reputation: 200, rank: 1, ... },
//   { userId: 'bob', name: 'Bob', reputation: 150, rank: 2, ... }
// ]
```

#### `getTrendingPosts(limit)`
Get most engaging posts (sorted by engagement score).

**Calculation:** `upvotes * 3 + helpful * 2 + replies + views * 0.1`

**Returns:** Array of trending posts

#### `getCategoryStats()`
Get statistics for each category.

**Returns:**
```javascript
{
  'skills-showcase': {
    postCount: 25,
    replyCount: 43,
    totalViews: 500,
    totalUpvotes: 120
  },
  'questions': { ... }
}
```

### Persistence & Export

#### `save()`
Save forum state to disk (.claude/community-forum.json).

#### `load()`
Load forum from disk.

#### `export()`
Export complete forum data for analysis or migration.

**Returns:** Forum state object with timestamp

#### `clear()`
Wipe all forum data.

## Constants

### Categories

```javascript
CATEGORIES = {
  SKILLS_SHOWCASE: 'skills-showcase',
  QUESTIONS: 'questions',
  FEATURE_REQUESTS: 'feature-requests',
  BUG_REPORTS: 'bug-reports',
  OFF_TOPIC: 'off-topic'
}
```

### Badge Types

```javascript
BADGE_TYPES = {
  FIRST_POST: 'first-post',
  HELPFUL_CONTRIBUTOR: 'helpful-contributor',
  SKILL_MASTER: 'skill-master',
  QUESTION_ANSWERER: 'question-answerer',
  BUG_HUNTER: 'bug-hunter',
  FEATURE_INNOVATOR: 'feature-innovator',
  RESPECTED_MEMBER: 'respected-member',
  TRENDING_AUTHOR: 'trending-author'
}
```

### Reputation Rewards

```javascript
REPUTATION_REWARDS = {
  POST_CREATED: 10,
  REPLY_CREATED: 5,
  REPLY_UPVOTED: 2,
  POST_UPVOTED: 3,
  REPLY_ACCEPTED: 25,
  POST_MARKED_HELPFUL: 15,
  BADGE_EARNED: 50
}
```

## Integration Patterns

### Pattern 1: Express API Server

```javascript
const { ForumAPIServer } = require('./community-forum-integration-example');

const server = new ForumAPIServer(3000);
server.start();

// API endpoints available at http://localhost:3000/api/
```

### Pattern 2: CLI Interface

```javascript
const { ForumCLI } = require('./community-forum-integration-example');

const cli = new ForumCLI();
cli.login('alice');
cli.createPost(CATEGORIES.QUESTIONS, 'How?', 'Help!');
cli.showLeaderboard();
```

### Pattern 3: Event Monitoring

```javascript
const { ForumEventStream } = require('./community-forum-integration-example');
const stream = new ForumEventStream(forum);

stream.on('post:created', (data) => {
  console.log(`New post: ${data.post.title}`);
});

stream.on('post:upvoted', (data) => {
  console.log(`Post upvoted by ${data.userId}`);
});

stream.monitorForum(); // Hook into forum operations
```

### Pattern 4: Analytics Dashboard

```javascript
const { ForumAnalyticsDashboard } = require('./community-forum-integration-example');

const dashboard = new ForumAnalyticsDashboard(forum);
dashboard.printDashboard();

const stats = dashboard.getStats();
const engagement = dashboard.getEngagementMetrics();
```

## Storage

Forum data persists to `.claude/community-forum.json`:

```json
{
  "schemaVersion": 1,
  "posts": [ ... ],
  "users": { ... },
  "badges": { ... },
  "leaderboard": [ ... ],
  "timestamp": "2024-..."
}
```

Automatic persistence on every state-modifying operation (create, upvote, etc.).

## Examples

### Full Discussion Thread

```javascript
const forum = new CommunityForum();

// Create users
forum.createUser('alice', { name: 'Alice' });
forum.createUser('bob', { name: 'Bob' });
forum.createUser('charlie', { name: 'Charlie' });

// Alice asks a question
const post = forum.createPost({
  userId: 'alice',
  category: CATEGORIES.QUESTIONS,
  title: 'Best way to handle async in React?',
  content: 'I have async operations in my component...',
  tags: ['react', 'async']
});

// Bob provides answer
forum.createReply({
  postId: post.id,
  userId: 'bob',
  content: 'Use useEffect with dependency array...'
});

// Charlie also replies
forum.createReply({
  postId: post.id,
  userId: 'charlie',
  content: 'Or consider custom hooks...'
});

// Community votes
forum.upvoteReply(post.id, post.replies[0].id, 'charlie');
forum.upvoteReply(post.id, post.replies[0].id, 'alice');

// Alice marks best answer
forum.acceptReply(post.id, post.replies[0].id, 'alice');

// Check results
const profile = forum.getUserProfile('bob');
console.log(profile.reputation); // 5 (reply) + 2 (upvote) + 25 (accepted) = 32
console.log(profile.badges); // ['question-answerer']
```

### Trending Content Discovery

```javascript
// Get trending posts
const trending = forum.getTrendingPosts(5);

// Get posts by category, sorted by recency
const recent = forum.getPostsByCategory(CATEGORIES.SKILLS_SHOWCASE, {
  sortBy: 'recent',
  limit: 10
});

// Search discussions
const results = forum.searchPosts('performance');
```

## Testing

Run all tests:
```bash
node lib/community-forum.test.js
```

29 test cases covering:
- User management
- Post creation and replies
- Voting and engagement
- Badges and reputation
- Leaderboard rankings
- Search and filtering
- Persistence

## Performance

- **Memory:** O(n) where n = total posts + replies
- **Search:** O(n) linear scan (suitable for <10k posts)
- **Leaderboard:** O(n log n) sort
- **Voting:** O(1) append

## Future Enhancements

- Database backend (PostgreSQL/MongoDB)
- Full-text search index (Elasticsearch)
- Moderation/spam filtering
- Post editing/deletion
- Mention/notification system
- Private messages
- Post pinning/stickies
- Thread bookmarking
- User blocking
- Reputation decay over time
- Advanced analytics (posting trends, engagement patterns)
- API rate limiting
- Multi-language support

## License

MIT
