/**
 * Community Forum Integration Example
 *
 * Demonstrates patterns for integrating the forum into applications:
 * - Express.js API server
 * - CLI interface
 * - Event streaming
 * - Analytics dashboard
 */

const {
  CommunityForum,
  CATEGORIES,
  BADGE_TYPES
} = require('./community-forum');

// Express is optional - only loaded if needed
let express;
try {
  express = require('express');
} catch (e) {
  // Express not installed - demo mode only
}

// ============================================================================
// 1. Express.js API Server
// ============================================================================

class ForumAPIServer {
  constructor(port = 3000) {
    if (!express) {
      throw new Error('Express.js is required. Install with: npm install express');
    }

    this.app = express();
    this.forum = new CommunityForum();
    this.port = port;

    this.app.use(express.json());
    this.setupRoutes();
  }

  setupRoutes() {
    // User routes
    this.app.post('/api/users', (req, res) => {
      try {
        const { userId, name, bio, avatar } = req.body;
        const user = this.forum.createUser(userId, { name, bio, avatar });
        res.status(201).json(user);
      } catch (e) {
        res.status(400).json({ error: e.message });
      }
    });

    this.app.get('/api/users/:userId', (req, res) => {
      try {
        const profile = this.forum.getUserProfile(req.params.userId);
        res.json(profile);
      } catch (e) {
        res.status(404).json({ error: e.message });
      }
    });

    this.app.get('/api/users/:userId/activity', (req, res) => {
      try {
        const activity = this.forum.getUserActivity(req.params.userId);
        res.json(activity);
      } catch (e) {
        res.status(404).json({ error: e.message });
      }
    });

    // Post routes
    this.app.post('/api/posts', (req, res) => {
      try {
        const { userId, category, title, content, tags } = req.body;
        const post = this.forum.createPost({
          userId,
          category,
          title,
          content,
          tags
        });
        res.status(201).json(post);
      } catch (e) {
        res.status(400).json({ error: e.message });
      }
    });

    this.app.get('/api/posts/:postId', (req, res) => {
      try {
        const post = this.forum.forum.posts.find(p => p.id === req.params.postId);
        if (!post) throw new Error('Post not found');

        this.forum.recordView(post.id);
        res.json(post);
      } catch (e) {
        res.status(404).json({ error: e.message });
      }
    });

    this.app.get('/api/posts/category/:category', (req, res) => {
      try {
        const posts = this.forum.getPostsByCategory(
          req.params.category,
          { sortBy: req.query.sortBy || 'recent', limit: parseInt(req.query.limit || 20) }
        );
        res.json(posts);
      } catch (e) {
        res.status(400).json({ error: e.message });
      }
    });

    this.app.get('/api/posts/trending', (req, res) => {
      try {
        const posts = this.forum.getTrendingPosts(parseInt(req.query.limit || 10));
        res.json(posts);
      } catch (e) {
        res.status(400).json({ error: e.message });
      }
    });

    this.app.post('/api/posts/:postId/replies', (req, res) => {
      try {
        const { userId, content } = req.body;
        const post = this.forum.createReply({
          postId: req.params.postId,
          userId,
          content
        });
        res.status(201).json(post);
      } catch (e) {
        res.status(400).json({ error: e.message });
      }
    });

    // Voting routes
    this.app.post('/api/posts/:postId/upvote', (req, res) => {
      try {
        const { userId } = req.body;
        const post = this.forum.upvotePost(req.params.postId, userId);
        res.json(post);
      } catch (e) {
        res.status(400).json({ error: e.message });
      }
    });

    this.app.post('/api/posts/:postId/replies/:replyId/upvote', (req, res) => {
      try {
        const { userId } = req.body;
        const post = this.forum.upvoteReply(
          req.params.postId,
          req.params.replyId,
          userId
        );
        res.json(post);
      } catch (e) {
        res.status(400).json({ error: e.message });
      }
    });

    this.app.post('/api/posts/:postId/replies/:replyId/accept', (req, res) => {
      try {
        const { userId } = req.body;
        const post = this.forum.acceptReply(
          req.params.postId,
          req.params.replyId,
          userId
        );
        res.json(post);
      } catch (e) {
        res.status(400).json({ error: e.message });
      }
    });

    this.app.post('/api/posts/:postId/helpful', (req, res) => {
      try {
        const { userId } = req.body;
        const post = this.forum.markHelpful(req.params.postId, userId);
        res.json(post);
      } catch (e) {
        res.status(400).json({ error: e.message });
      }
    });

    // Search route
    this.app.get('/api/search', (req, res) => {
      try {
        const query = req.query.q;
        if (!query) throw new Error('Query required');

        const results = this.forum.searchPosts(query);
        res.json(results);
      } catch (e) {
        res.status(400).json({ error: e.message });
      }
    });

    // Leaderboard
    this.app.get('/api/leaderboard', (req, res) => {
      try {
        const limit = parseInt(req.query.limit || 10);
        const leaderboard = this.forum.getLeaderboard(limit);
        res.json(leaderboard);
      } catch (e) {
        res.status(400).json({ error: e.message });
      }
    });

    // Stats
    this.app.get('/api/stats/categories', (req, res) => {
      try {
        const stats = this.forum.getCategoryStats();
        res.json(stats);
      } catch (e) {
        res.status(400).json({ error: e.message });
      }
    });
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`Forum API running on http://localhost:${this.port}`);
    });
  }
}

// ============================================================================
// 2. CLI Interface
// ============================================================================

class ForumCLI {
  constructor() {
    this.forum = new CommunityForum();
    this.currentUser = null;
  }

  login(userId) {
    this.currentUser = this.forum.getOrCreateUser(userId, { name: userId });
    console.log(`Logged in as ${this.currentUser.name}`);
  }

  createPost(category, title, content, tags = []) {
    if (!this.currentUser) throw new Error('Not logged in');

    const post = this.forum.createPost({
      userId: this.currentUser.id,
      category,
      title,
      content,
      tags
    });

    console.log(`Post created: ${post.id}`);
    console.log(`Title: ${post.title}`);
    console.log(`Category: ${post.category}`);
    return post;
  }

  listPosts(category, sortBy = 'recent') {
    const posts = this.forum.getPostsByCategory(category, {
      sortBy,
      limit: 20
    });

    console.log(`\nPosts in ${category}:`);
    posts.forEach((post, i) => {
      console.log(`${i + 1}. ${post.title} (${post.upvotes} upvotes)`);
      console.log(`   By: ${post.userName} | Replies: ${post.replies.length}`);
    });
  }

  viewPost(postId) {
    const post = this.forum.forum.posts.find(p => p.id === postId);
    if (!post) throw new Error('Post not found');

    this.forum.recordView(post.id);

    console.log(`\n${post.title}`);
    console.log(`Category: ${post.category}`);
    console.log(`By: ${post.userName} | Views: ${post.views} | Upvotes: ${post.upvotes}`);
    console.log(`\n${post.content}`);
    console.log(`\nReplies (${post.replies.length}):`);

    post.replies.forEach((reply, i) => {
      const accepted = reply.accepted ? ' [ACCEPTED]' : '';
      console.log(`${i + 1}. ${reply.userName}${accepted}`);
      console.log(`   ${reply.content}`);
      console.log(`   Upvotes: ${reply.upvotes}`);
    });
  }

  reply(postId, content) {
    if (!this.currentUser) throw new Error('Not logged in');

    const post = this.forum.createReply({
      postId,
      userId: this.currentUser.id,
      content
    });

    console.log(`Reply posted!`);
    return post;
  }

  upvote(postId, replyId = null) {
    if (!this.currentUser) throw new Error('Not logged in');

    if (replyId) {
      this.forum.upvoteReply(postId, replyId, this.currentUser.id);
      console.log(`Reply upvoted!`);
    } else {
      this.forum.upvotePost(postId, this.currentUser.id);
      console.log(`Post upvoted!`);
    }
  }

  showProfile(userId = null) {
    const targetUser = userId || this.currentUser?.id;
    if (!targetUser) throw new Error('User not specified');

    const profile = this.forum.getUserProfile(targetUser);

    console.log(`\n${profile.name}`);
    console.log(`Bio: ${profile.bio || 'N/A'}`);
    console.log(`Reputation: ${profile.reputation}`);
    console.log(`Rank: ${profile.stats.rank > 0 ? profile.stats.rank : 'N/A'}`);
    console.log(`Posts: ${profile.postCount} | Replies: ${profile.replyCount}`);
    console.log(`Badges: ${profile.badges.length}`);
    profile.badges_earned.forEach(badge => {
      console.log(`  - ${badge.label}`);
    });
  }

  showLeaderboard() {
    const leaderboard = this.forum.getLeaderboard(10);

    console.log('\n=== LEADERBOARD ===');
    leaderboard.forEach((user, i) => {
      console.log(`${i + 1}. ${user.name} - ${user.reputation} rep (${user.badgeCount} badges)`);
    });
  }

  showTrending() {
    const trending = this.forum.getTrendingPosts(5);

    console.log('\n=== TRENDING ===');
    trending.forEach((post, i) => {
      console.log(`${i + 1}. ${post.title}`);
      console.log(`   By: ${post.userName} | Engagement: ${post.upvotes + post.replies.length}`);
    });
  }
}

// ============================================================================
// 3. Event Streaming
// ============================================================================

class ForumEventStream {
  constructor(forum) {
    this.forum = forum;
    this.listeners = {};
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }

  // Hook into forum operations
  monitorForum() {
    const originalCreatePost = this.forum.createPost.bind(this.forum);
    this.forum.createPost = (options) => {
      const post = originalCreatePost(options);
      this.emit('post:created', { post });
      return post;
    };

    const originalUpvotePost = this.forum.upvotePost.bind(this.forum);
    this.forum.upvotePost = (postId, userId) => {
      const post = originalUpvotePost(postId, userId);
      this.emit('post:upvoted', { postId, userId, post });
      return post;
    };

    const originalCreateReply = this.forum.createReply.bind(this.forum);
    this.forum.createReply = (options) => {
      const post = originalCreateReply(options);
      this.emit('reply:created', { postId: options.postId, userId: options.userId });
      return post;
    };
  }
}

// ============================================================================
// 4. Analytics Dashboard
// ============================================================================

class ForumAnalyticsDashboard {
  constructor(forum) {
    this.forum = forum;
  }

  getStats() {
    const users = Object.values(this.forum.forum.users);
    const posts = this.forum.forum.posts;

    return {
      totalUsers: users.length,
      totalPosts: posts.length,
      totalReplies: posts.reduce((sum, p) => sum + p.replies.length, 0),
      averageReputation: users.reduce((sum, u) => sum + u.reputation, 0) / (users.length || 1),
      topUser: users.length > 0 ?
        users.reduce((max, u) => u.reputation > max.reputation ? u : max) :
        null,
      categoryBreakdown: this.forum.getCategoryStats()
    };
  }

  getEngagementMetrics() {
    const posts = this.forum.forum.posts;

    return {
      totalUpvotes: posts.reduce((sum, p) => sum + p.upvotes, 0),
      totalViews: posts.reduce((sum, p) => sum + p.views, 0),
      averageRepliesPerPost: posts.length > 0 ?
        posts.reduce((sum, p) => sum + p.replies.length, 0) / posts.length :
        0,
      postsWithReplies: posts.filter(p => p.replies.length > 0).length,
      acceptedReplies: posts.flatMap(p => p.replies).filter(r => r.accepted).length
    };
  }

  printDashboard() {
    const stats = this.getStats();
    const engagement = this.getEngagementMetrics();

    console.log('\n=== FORUM ANALYTICS DASHBOARD ===\n');

    console.log('User Stats:');
    console.log(`  Total Users: ${stats.totalUsers}`);
    console.log(`  Avg Reputation: ${stats.averageReputation.toFixed(1)}`);
    if (stats.topUser) {
      console.log(`  Top User: ${stats.topUser.name} (${stats.topUser.reputation} rep)`);
    }

    console.log('\nContent Stats:');
    console.log(`  Total Posts: ${stats.totalPosts}`);
    console.log(`  Total Replies: ${engagement.totalReplies}`);
    console.log(`  Avg Replies/Post: ${engagement.averageRepliesPerPost.toFixed(1)}`);

    console.log('\nEngagement:');
    console.log(`  Total Upvotes: ${engagement.totalUpvotes}`);
    console.log(`  Total Views: ${engagement.totalViews}`);
    console.log(`  Posts w/ Replies: ${engagement.postsWithReplies}`);
    console.log(`  Accepted Answers: ${engagement.acceptedReplies}`);

    console.log('\nCategory Breakdown:');
    Object.entries(stats.categoryBreakdown).forEach(([cat, data]) => {
      console.log(`  ${cat}: ${data.postCount} posts, ${data.replyCount} replies`);
    });
  }
}

// ============================================================================
// Example Usage
// ============================================================================

if (require.main === module) {
  console.log('Community Forum Integration Examples\n');

  // Example 1: CLI Usage
  console.log('=== CLI EXAMPLE ===');
  const cli = new ForumCLI();
  cli.login('alice');
  const post = cli.createPost(
    CATEGORIES.SKILLS_SHOWCASE,
    'Advanced React Patterns',
    'Here are some advanced React patterns I learned...',
    ['react', 'javascript']
  );

  cli.login('bob');
  cli.reply(post.id, 'Great tips! I especially liked the hooks section.');
  cli.upvote(post.id);

  cli.listPosts(CATEGORIES.SKILLS_SHOWCASE);
  cli.showLeaderboard();
  cli.showTrending();

  // Example 2: Analytics
  console.log('\n=== ANALYTICS EXAMPLE ===');
  const dashboard = new ForumAnalyticsDashboard(cli.forum);
  dashboard.printDashboard();

  // Example 3: Event Stream
  console.log('\n=== EVENT STREAM EXAMPLE ===');
  const stream = new ForumEventStream(cli.forum);
  stream.monitorForum();

  stream.on('post:created', (data) => {
    console.log(`📝 New post: "${data.post.title}"`);
  });

  stream.on('post:upvoted', (data) => {
    console.log(`👍 Post upvoted by ${data.userId}`);
  });

  cli.login('charlie');
  const post2 = cli.createPost(
    CATEGORIES.QUESTIONS,
    'How to optimize React performance?',
    'I have a slow React app...',
    ['react', 'performance']
  );
  cli.upvote(post2.id);

  console.log('\n=== EXPRESS API SETUP ===');
  console.log('To start the Express API server:');
  console.log('const server = new ForumAPIServer(3000);');
  console.log('server.start();');
  console.log('\nAvailable endpoints:');
  console.log('  POST   /api/users');
  console.log('  GET    /api/users/:userId');
  console.log('  GET    /api/users/:userId/activity');
  console.log('  POST   /api/posts');
  console.log('  GET    /api/posts/:postId');
  console.log('  GET    /api/posts/category/:category');
  console.log('  GET    /api/posts/trending');
  console.log('  POST   /api/posts/:postId/replies');
  console.log('  POST   /api/posts/:postId/upvote');
  console.log('  POST   /api/posts/:postId/replies/:replyId/upvote');
  console.log('  POST   /api/posts/:postId/replies/:replyId/accept');
  console.log('  POST   /api/posts/:postId/helpful');
  console.log('  GET    /api/search?q=query');
  console.log('  GET    /api/leaderboard');
  console.log('  GET    /api/stats/categories');
}

module.exports = {
  ForumAPIServer,
  ForumCLI,
  ForumEventStream,
  ForumAnalyticsDashboard
};
