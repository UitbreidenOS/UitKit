/**
 * Community Forum System
 *
 * Internal discussion platform for Claudient users:
 * - Categories: skills showcase, questions, feature requests, bug reports, off-topic
 * - Gamification: badges, reputation scores, leaderboard
 * - Persistence: .claude/community-forum.json
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const FORUM_FILE = path.join(process.cwd(), '.claude', 'community-forum.json');
const CLAUDE_DIR = path.join(process.cwd(), '.claude');

const SCHEMA_VERSION = 1;

const CATEGORIES = {
  SKILLS_SHOWCASE: 'skills-showcase',
  QUESTIONS: 'questions',
  FEATURE_REQUESTS: 'feature-requests',
  BUG_REPORTS: 'bug-reports',
  OFF_TOPIC: 'off-topic'
};

const BADGE_TYPES = {
  FIRST_POST: 'first-post',
  HELPFUL_CONTRIBUTOR: 'helpful-contributor',
  SKILL_MASTER: 'skill-master',
  QUESTION_ANSWERER: 'question-answerer',
  BUG_HUNTER: 'bug-hunter',
  FEATURE_INNOVATOR: 'feature-innovator',
  RESPECTED_MEMBER: 'respected-member',
  TRENDING_AUTHOR: 'trending-author'
};

const REPUTATION_REWARDS = {
  POST_CREATED: 10,
  REPLY_CREATED: 5,
  REPLY_UPVOTED: 2,
  POST_UPVOTED: 3,
  REPLY_ACCEPTED: 25,
  POST_MARKED_HELPFUL: 15,
  BADGE_EARNED: 50
};

function createDefaultForum() {
  return {
    schemaVersion: SCHEMA_VERSION,
    posts: [],
    users: {},
    badges: {},
    leaderboard: [],
    timestamp: new Date().toISOString()
  };
}

function ensureClaudeDir() {
  if (!fs.existsSync(CLAUDE_DIR)) {
    fs.mkdirSync(CLAUDE_DIR, { recursive: true });
  }
}

function saveForum(forum) {
  ensureClaudeDir();
  try {
    fs.writeFileSync(
      FORUM_FILE,
      JSON.stringify(forum, null, 2),
      'utf8'
    );
  } catch (error) {
    throw new Error(`Failed to save forum: ${error.message}`);
  }
}

function loadForum() {
  if (!fs.existsSync(FORUM_FILE)) {
    return null;
  }
  try {
    const content = fs.readFileSync(FORUM_FILE, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to load forum: ${error.message}`);
  }
}

function generateId() {
  return crypto.randomBytes(8).toString('hex');
}

/**
 * CommunityForum - Main forum management class
 */
class CommunityForum {
  constructor(options = {}) {
    this.storageKey = options.storageKey || 'community-forum';
    this.forum = this.load() || createDefaultForum();
  }

  load() {
    return loadForum();
  }

  save() {
    this.forum.timestamp = new Date().toISOString();
    saveForum(this.forum);
  }

  /**
   * Create a new user
   * @param {string} userId - Unique user identifier
   * @param {Object} profile - User profile (name, avatar, bio)
   * @returns {Object} Created user object
   */
  createUser(userId, profile = {}) {
    if (this.forum.users[userId]) {
      throw new Error(`User ${userId} already exists`);
    }

    const user = {
      id: userId,
      name: profile.name || userId,
      avatar: profile.avatar || null,
      bio: profile.bio || '',
      joinedAt: new Date().toISOString(),
      reputation: 0,
      postCount: 0,
      replyCount: 0,
      badges: [],
      badges_earned: [],
      followers: [],
      following: []
    };

    this.forum.users[userId] = user;
    this.save();
    return user;
  }

  /**
   * Get or create user
   * @param {string} userId - User identifier
   * @param {Object} profile - Profile if creating new user
   * @returns {Object} User object
   */
  getOrCreateUser(userId, profile = {}) {
    if (this.forum.users[userId]) {
      return this.forum.users[userId];
    }
    return this.createUser(userId, profile);
  }

  /**
   * Create a forum post
   * @param {Object} options - Post configuration
   * @returns {Object} Created post object
   */
  createPost(options) {
    const { userId, category, title, content, tags = [] } = options;

    if (!userId || !category || !title || !content) {
      throw new Error('Missing required fields: userId, category, title, content');
    }

    if (!Object.values(CATEGORIES).includes(category)) {
      throw new Error(`Invalid category: ${category}`);
    }

    const user = this.getOrCreateUser(userId);
    const postId = generateId();

    const post = {
      id: postId,
      userId,
      userName: user.name,
      category,
      title,
      content,
      tags,
      replies: [],
      upvotes: 0,
      upvoters: [],
      helpful: 0,
      helpfulMarkers: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0
    };

    this.forum.posts.push(post);

    // Award reputation
    user.reputation += REPUTATION_REWARDS.POST_CREATED;
    user.postCount += 1;

    // Check for first post badge
    if (user.postCount === 1) {
      this.awardBadge(userId, BADGE_TYPES.FIRST_POST, 'First Post');
    }

    this.updateLeaderboard();
    this.save();

    return post;
  }

  /**
   * Create a reply on a post
   * @param {Object} options - Reply configuration
   * @returns {Object} Updated post object
   */
  createReply(options) {
    const { postId, userId, content } = options;

    if (!postId || !userId || !content) {
      throw new Error('Missing required fields: postId, userId, content');
    }

    const post = this.forum.posts.find(p => p.id === postId);
    if (!post) {
      throw new Error(`Post ${postId} not found`);
    }

    const user = this.getOrCreateUser(userId);
    const replyId = generateId();

    const reply = {
      id: replyId,
      userId,
      userName: user.name,
      content,
      upvotes: 0,
      upvoters: [],
      accepted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    post.replies.push(reply);
    post.updatedAt = new Date().toISOString();

    // Award reputation
    user.reputation += REPUTATION_REWARDS.REPLY_CREATED;
    user.replyCount += 1;

    this.updateLeaderboard();
    this.save();

    return post;
  }

  /**
   * Upvote a post
   * @param {string} postId - Post identifier
   * @param {string} userId - User upvoting
   * @returns {Object} Updated post
   */
  upvotePost(postId, userId) {
    const post = this.forum.posts.find(p => p.id === postId);
    if (!post) {
      throw new Error(`Post ${postId} not found`);
    }

    if (post.upvoters.includes(userId)) {
      throw new Error(`User ${userId} already upvoted this post`);
    }

    post.upvoters.push(userId);
    post.upvotes += 1;

    // Award reputation to post author
    const author = this.forum.users[post.userId];
    if (author) {
      author.reputation += REPUTATION_REWARDS.POST_UPVOTED;
    }

    this.updateLeaderboard();
    this.save();

    return post;
  }

  /**
   * Upvote a reply
   * @param {string} postId - Post identifier
   * @param {string} replyId - Reply identifier
   * @param {string} userId - User upvoting
   * @returns {Object} Updated post
   */
  upvoteReply(postId, replyId, userId) {
    const post = this.forum.posts.find(p => p.id === postId);
    if (!post) {
      throw new Error(`Post ${postId} not found`);
    }

    const reply = post.replies.find(r => r.id === replyId);
    if (!reply) {
      throw new Error(`Reply ${replyId} not found`);
    }

    if (reply.upvoters.includes(userId)) {
      throw new Error(`User ${userId} already upvoted this reply`);
    }

    reply.upvoters.push(userId);
    reply.upvotes += 1;

    // Award reputation to reply author
    const author = this.forum.users[reply.userId];
    if (author) {
      author.reputation += REPUTATION_REWARDS.REPLY_UPVOTED;

      // Badge: Helpful contributor (50+ upvotes)
      const totalUpvotes = this.getUserTotalUpvotes(reply.userId);
      if (totalUpvotes >= 50 && !author.badges.includes(BADGE_TYPES.HELPFUL_CONTRIBUTOR)) {
        this.awardBadge(reply.userId, BADGE_TYPES.HELPFUL_CONTRIBUTOR, 'Helpful Contributor');
      }
    }

    this.updateLeaderboard();
    this.save();

    return post;
  }

  /**
   * Mark a reply as accepted (for questions)
   * @param {string} postId - Post identifier
   * @param {string} replyId - Reply identifier
   * @param {string} accepterUserId - User accepting the answer
   * @returns {Object} Updated post
   */
  acceptReply(postId, replyId, accepterUserId) {
    const post = this.forum.posts.find(p => p.id === postId);
    if (!post) {
      throw new Error(`Post ${postId} not found`);
    }

    if (post.userId !== accepterUserId) {
      throw new Error('Only post author can accept replies');
    }

    const reply = post.replies.find(r => r.id === replyId);
    if (!reply) {
      throw new Error(`Reply ${replyId} not found`);
    }

    reply.accepted = true;

    // Award reputation
    const author = this.forum.users[reply.userId];
    if (author) {
      author.reputation += REPUTATION_REWARDS.REPLY_ACCEPTED;

      // Badge: Question answerer (10+ accepted)
      const acceptedCount = this.getUserAcceptedAnswers(reply.userId);
      if (acceptedCount >= 10 && !author.badges.includes(BADGE_TYPES.QUESTION_ANSWERER)) {
        this.awardBadge(reply.userId, BADGE_TYPES.QUESTION_ANSWERER, 'Question Answerer');
      }
    }

    this.updateLeaderboard();
    this.save();

    return post;
  }

  /**
   * Mark post as helpful
   * @param {string} postId - Post identifier
   * @param {string} userId - User marking as helpful
   * @returns {Object} Updated post
   */
  markHelpful(postId, userId) {
    const post = this.forum.posts.find(p => p.id === postId);
    if (!post) {
      throw new Error(`Post ${postId} not found`);
    }

    if (post.helpfulMarkers.includes(userId)) {
      throw new Error(`User ${userId} already marked this post as helpful`);
    }

    post.helpfulMarkers.push(userId);
    post.helpful += 1;

    // Award reputation
    const author = this.forum.users[post.userId];
    if (author) {
      author.reputation += REPUTATION_REWARDS.POST_MARKED_HELPFUL;
    }

    this.updateLeaderboard();
    this.save();

    return post;
  }

  /**
   * Award a badge to a user
   * @param {string} userId - User identifier
   * @param {string} badgeType - Badge type
   * @param {string} label - Display label
   */
  awardBadge(userId, badgeType, label) {
    const user = this.forum.users[userId];
    if (!user) {
      throw new Error(`User ${userId} not found`);
    }

    if (user.badges.includes(badgeType)) {
      return; // Already has this badge
    }

    user.badges.push(badgeType);
    user.badges_earned.push({
      type: badgeType,
      label,
      awardedAt: new Date().toISOString()
    });

    user.reputation += REPUTATION_REWARDS.BADGE_EARNED;

    // Track badge in global index
    if (!this.forum.badges[badgeType]) {
      this.forum.badges[badgeType] = {
        type: badgeType,
        label,
        holders: []
      };
    }
    this.forum.badges[badgeType].holders.push(userId);

    this.updateLeaderboard();
    this.save();
  }

  /**
   * Get leaderboard rankings
   * @param {number} limit - Number of top users to return
   * @returns {Array} Top users sorted by reputation
   */
  getLeaderboard(limit = 10) {
    const users = Object.values(this.forum.users)
      .map(user => ({
        userId: user.id,
        name: user.name,
        reputation: user.reputation,
        postCount: user.postCount,
        replyCount: user.replyCount,
        badgeCount: user.badges.length,
        joinedAt: user.joinedAt
      }))
      .sort((a, b) => b.reputation - a.reputation)
      .slice(0, limit);

    return users;
  }

  /**
   * Get trending posts
   * @param {number} limit - Number of posts to return
   * @returns {Array} Trending posts
   */
  getTrendingPosts(limit = 10) {
    return this.forum.posts
      .map(post => ({
        ...post,
        engagementScore: post.upvotes * 3 + post.helpful * 2 + post.replies.length + post.views * 0.1
      }))
      .sort((a, b) => b.engagementScore - a.engagementScore)
      .slice(0, limit)
      .map(post => {
        const { engagementScore, ...rest } = post;
        return rest;
      });
  }

  /**
   * Get posts by category
   * @param {string} category - Category name
   * @param {Object} options - Filter/sort options
   * @returns {Array} Filtered posts
   */
  getPostsByCategory(category, options = {}) {
    if (!Object.values(CATEGORIES).includes(category)) {
      throw new Error(`Invalid category: ${category}`);
    }

    let posts = this.forum.posts.filter(p => p.category === category);

    if (options.sortBy === 'recent') {
      posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (options.sortBy === 'popular') {
      posts.sort((a, b) => b.upvotes - a.upvotes);
    } else if (options.sortBy === 'views') {
      posts.sort((a, b) => b.views - a.views);
    }

    return posts.slice(0, options.limit || 20);
  }

  /**
   * Search posts by title or tags
   * @param {string} query - Search query
   * @returns {Array} Matching posts
   */
  searchPosts(query) {
    const q = query.toLowerCase();
    return this.forum.posts.filter(post =>
      post.title.toLowerCase().includes(q) ||
      post.content.toLowerCase().includes(q) ||
      post.tags.some(tag => tag.toLowerCase().includes(q))
    );
  }

  /**
   * Get user profile with full stats
   * @param {string} userId - User identifier
   * @returns {Object} User profile and stats
   */
  getUserProfile(userId) {
    const user = this.forum.users[userId];
    if (!user) {
      throw new Error(`User ${userId} not found`);
    }

    const userPosts = this.forum.posts.filter(p => p.userId === userId);
    const userReplies = this.forum.posts.flatMap(p =>
      p.replies.filter(r => r.userId === userId)
    );

    const totalUpvotes = userPosts.reduce((sum, p) => sum + p.upvotes, 0) +
                         userReplies.reduce((sum, r) => sum + r.upvotes, 0);

    const rank = this.getUserRank(userId);

    return {
      ...user,
      stats: {
        totalUpvotes,
        totalViews: userPosts.reduce((sum, p) => sum + p.views, 0),
        acceptedReplies: userReplies.filter(r => r.accepted).length,
        rank
      }
    };
  }

  /**
   * Get user rank in leaderboard
   * @param {string} userId - User identifier
   * @returns {number} Rank (1-based) or -1 if not in top 100
   */
  getUserRank(userId) {
    const leaderboard = this.getLeaderboard(100);
    const rank = leaderboard.findIndex(u => u.userId === userId) + 1;
    return rank > 0 ? rank : -1;
  }

  /**
   * Get user's total upvotes
   * @param {string} userId - User identifier
   * @returns {number} Total upvotes on all content
   */
  getUserTotalUpvotes(userId) {
    const userPosts = this.forum.posts.filter(p => p.userId === userId);
    const userReplies = this.forum.posts.flatMap(p =>
      p.replies.filter(r => r.userId === userId)
    );

    return userPosts.reduce((sum, p) => sum + p.upvotes, 0) +
           userReplies.reduce((sum, r) => sum + r.upvotes, 0);
  }

  /**
   * Get count of user's accepted answers
   * @param {string} userId - User identifier
   * @returns {number} Count of accepted replies
   */
  getUserAcceptedAnswers(userId) {
    return this.forum.posts.flatMap(p =>
      p.replies.filter(r => r.userId === userId && r.accepted)
    ).length;
  }

  /**
   * Get user activity summary
   * @param {string} userId - User identifier
   * @returns {Object} Activity stats
   */
  getUserActivity(userId) {
    const user = this.forum.users[userId];
    if (!user) {
      throw new Error(`User ${userId} not found`);
    }

    const posts = this.forum.posts.filter(p => p.userId === userId);
    const replies = this.forum.posts.flatMap(p =>
      p.replies.filter(r => r.userId === userId)
    );

    return {
      userId,
      reputation: user.reputation,
      badges: user.badges_earned,
      postsCreated: posts.length,
      repliesCreated: replies.length,
      acceptedAnswers: replies.filter(r => r.accepted).length,
      totalUpvotes: this.getUserTotalUpvotes(userId),
      joinedAt: user.joinedAt,
      lastActivityAt: this.getLastActivityTime(userId)
    };
  }

  /**
   * Get last activity timestamp for a user
   * @param {string} userId - User identifier
   * @returns {string|null} ISO timestamp or null
   */
  getLastActivityTime(userId) {
    const allContent = [
      ...this.forum.posts.filter(p => p.userId === userId),
      ...this.forum.posts.flatMap(p => p.replies.filter(r => r.userId === userId))
    ];

    if (allContent.length === 0) return null;

    return allContent.reduce((latest, item) =>
      new Date(item.updatedAt || item.createdAt) > new Date(latest) ?
        item.updatedAt || item.createdAt :
        latest
    );
  }

  /**
   * Record post view
   * @param {string} postId - Post identifier
   */
  recordView(postId) {
    const post = this.forum.posts.find(p => p.id === postId);
    if (!post) {
      throw new Error(`Post ${postId} not found`);
    }
    post.views += 1;
    this.save();
  }

  /**
   * Generate category stats
   * @returns {Object} Stats per category
   */
  getCategoryStats() {
    const stats = {};

    for (const category of Object.values(CATEGORIES)) {
      const posts = this.forum.posts.filter(p => p.category === category);
      stats[category] = {
        postCount: posts.length,
        replyCount: posts.reduce((sum, p) => sum + p.replies.length, 0),
        totalViews: posts.reduce((sum, p) => sum + p.views, 0),
        totalUpvotes: posts.reduce((sum, p) => sum + p.upvotes, 0)
      };
    }

    return stats;
  }

  /**
   * Update leaderboard cache
   * @private
   */
  updateLeaderboard() {
    this.forum.leaderboard = this.getLeaderboard(50);
  }

  /**
   * Export forum data
   * @returns {Object} Complete forum state
   */
  export() {
    return {
      ...this.forum,
      exportedAt: new Date().toISOString()
    };
  }

  /**
   * Clear all forum data
   */
  clear() {
    this.forum = createDefaultForum();
    this.save();
  }
}

module.exports = {
  CommunityForum,
  CATEGORIES,
  BADGE_TYPES,
  REPUTATION_REWARDS,
  createDefaultForum,
  loadForum,
  saveForum
};
