/**
 * Community Forum Tests
 *
 * Test suite for forum functionality:
 * - User management
 * - Post creation and replies
 * - Voting and engagement
 * - Badges and reputation
 * - Leaderboard and trending
 */

const {
  CommunityForum,
  CATEGORIES,
  BADGE_TYPES,
  REPUTATION_REWARDS
} = require('./community-forum');

const fs = require('fs');
const path = require('path');

// Mock storage
const TEST_DIR = path.join(process.cwd(), '.claude');
const TEST_FORUM_FILE = path.join(TEST_DIR, 'community-forum.json');

function cleanupTestFiles() {
  try {
    if (fs.existsSync(TEST_FORUM_FILE)) {
      fs.unlinkSync(TEST_FORUM_FILE);
    }
  } catch (e) {
    // Ignore cleanup errors
  }
}

function runTests() {
  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      cleanupTestFiles();
      fn();
      console.log(`✓ ${name}`);
      passed++;
    } catch (error) {
      console.log(`✗ ${name}`);
      console.log(`  Error: ${error.message}`);
      failed++;
    } finally {
      cleanupTestFiles();
    }
  }

  function assert(condition, message) {
    if (!condition) throw new Error(message);
  }

  function assertEqual(a, b, message) {
    if (a !== b) throw new Error(message || `Expected ${b}, got ${a}`);
  }

  // User Management Tests
  test('should create a new user', () => {
    const forum = new CommunityForum();
    const user = forum.createUser('alice', { name: 'Alice', bio: 'Dev' });
    assert(user.id === 'alice', 'User ID mismatch');
    assert(user.name === 'Alice', 'User name mismatch');
    assert(user.reputation === 0, 'Initial reputation should be 0');
  });

  test('should prevent duplicate users', () => {
    const forum = new CommunityForum();
    forum.createUser('alice', { name: 'Alice' });
    try {
      forum.createUser('alice', { name: 'Alice2' });
      throw new Error('Should have thrown');
    } catch (e) {
      assert(e.message.includes('already exists'), 'Wrong error');
    }
  });

  test('should get or create user', () => {
    const forum = new CommunityForum();
    const user1 = forum.getOrCreateUser('bob', { name: 'Bob' });
    const user2 = forum.getOrCreateUser('bob');
    assert(user1.id === user2.id, 'Should return same user');
  });

  // Post Creation Tests
  test('should create a post', () => {
    const forum = new CommunityForum();
    forum.createUser('alice', { name: 'Alice' });

    const post = forum.createPost({
      userId: 'alice',
      category: CATEGORIES.SKILLS_SHOWCASE,
      title: 'My New Skill',
      content: 'Just learned something cool!',
      tags: ['learning', 'skills']
    });

    assert(post.id, 'Post should have ID');
    assert(post.title === 'My New Skill', 'Title mismatch');
    assert(post.category === CATEGORIES.SKILLS_SHOWCASE, 'Category mismatch');
    assert(post.tags.length === 2, 'Tags mismatch');
  });

  test('should award reputation for post creation', () => {
    const forum = new CommunityForum();
    forum.createUser('alice', { name: 'Alice' });
    forum.createPost({
      userId: 'alice',
      category: CATEGORIES.QUESTIONS,
      title: 'How to do X?',
      content: 'I need help'
    });

    const user = forum.forum.users['alice'];
    // First post awards POST_CREATED + BADGE_EARNED for FIRST_POST badge
    const expectedRep = REPUTATION_REWARDS.POST_CREATED + REPUTATION_REWARDS.BADGE_EARNED;
    assert(user.reputation === expectedRep, 'Reputation mismatch');
    assert(user.postCount === 1, 'Post count mismatch');
  });

  test('should award first post badge', () => {
    const forum = new CommunityForum();
    forum.createUser('alice', { name: 'Alice' });
    forum.createPost({
      userId: 'alice',
      category: CATEGORIES.QUESTIONS,
      title: 'First Post',
      content: 'My first post!'
    });

    const user = forum.forum.users['alice'];
    assert(user.badges.includes(BADGE_TYPES.FIRST_POST), 'First post badge not awarded');
  });

  test('should validate required post fields', () => {
    const forum = new CommunityForum();
    forum.createUser('alice', { name: 'Alice' });

    try {
      forum.createPost({
        userId: 'alice',
        category: CATEGORIES.QUESTIONS
        // Missing title and content
      });
      throw new Error('Should have thrown');
    } catch (e) {
      assert(e.message.includes('Missing required fields'), 'Wrong error');
    }
  });

  // Reply Tests
  test('should create a reply', () => {
    const forum = new CommunityForum();
    forum.createUser('alice', { name: 'Alice' });
    forum.createUser('bob', { name: 'Bob' });

    const post = forum.createPost({
      userId: 'alice',
      category: CATEGORIES.QUESTIONS,
      title: 'How?',
      content: 'Help!'
    });

    const updated = forum.createReply({
      postId: post.id,
      userId: 'bob',
      content: 'You can do it like this...'
    });

    assert(updated.replies.length === 1, 'Reply not added');
    assert(updated.replies[0].userId === 'bob', 'Reply user mismatch');
  });

  test('should award reputation for reply', () => {
    const forum = new CommunityForum();
    forum.createUser('alice', { name: 'Alice' });
    forum.createUser('bob', { name: 'Bob' });

    const post = forum.createPost({
      userId: 'alice',
      category: CATEGORIES.QUESTIONS,
      title: 'How?',
      content: 'Help!'
    });

    forum.createReply({
      postId: post.id,
      userId: 'bob',
      content: 'Answer'
    });

    const bob = forum.forum.users['bob'];
    assert(bob.reputation === REPUTATION_REWARDS.REPLY_CREATED, 'Reputation mismatch');
    assert(bob.replyCount === 1, 'Reply count mismatch');
  });

  // Voting Tests
  test('should upvote a post', () => {
    const forum = new CommunityForum();
    forum.createUser('alice', { name: 'Alice' });
    forum.createUser('bob', { name: 'Bob' });

    const post = forum.createPost({
      userId: 'alice',
      category: CATEGORIES.SKILLS_SHOWCASE,
      title: 'Skill',
      content: 'Cool!'
    });

    const updated = forum.upvotePost(post.id, 'bob');
    assert(updated.upvotes === 1, 'Upvote count mismatch');
    assert(updated.upvoters.includes('bob'), 'Voter not recorded');
  });

  test('should prevent double upvotes', () => {
    const forum = new CommunityForum();
    forum.createUser('alice', { name: 'Alice' });
    forum.createUser('bob', { name: 'Bob' });

    const post = forum.createPost({
      userId: 'alice',
      category: CATEGORIES.SKILLS_SHOWCASE,
      title: 'Skill',
      content: 'Cool!'
    });

    forum.upvotePost(post.id, 'bob');

    try {
      forum.upvotePost(post.id, 'bob');
      throw new Error('Should have thrown');
    } catch (e) {
      assert(e.message.includes('already upvoted'), 'Wrong error');
    }
  });

  test('should award reputation for post upvote', () => {
    const forum = new CommunityForum();
    forum.createUser('alice', { name: 'Alice' });
    forum.createUser('bob', { name: 'Bob' });

    const post = forum.createPost({
      userId: 'alice',
      category: CATEGORIES.SKILLS_SHOWCASE,
      title: 'Skill',
      content: 'Cool!'
    });

    const initialRep = forum.forum.users['alice'].reputation;
    forum.upvotePost(post.id, 'bob');

    const finalRep = forum.forum.users['alice'].reputation;
    assert(finalRep === initialRep + REPUTATION_REWARDS.POST_UPVOTED, 'Reputation mismatch');
  });

  test('should upvote a reply', () => {
    const forum = new CommunityForum();
    forum.createUser('alice', { name: 'Alice' });
    forum.createUser('bob', { name: 'Bob' });
    forum.createUser('charlie', { name: 'Charlie' });

    const post = forum.createPost({
      userId: 'alice',
      category: CATEGORIES.QUESTIONS,
      title: 'Q',
      content: '?'
    });

    forum.createReply({
      postId: post.id,
      userId: 'bob',
      content: 'Answer'
    });

    const updated = forum.upvoteReply(post.id, post.replies[0].id, 'charlie');
    assert(updated.replies[0].upvotes === 1, 'Upvote count mismatch');
  });

  // Acceptance Tests
  test('should accept a reply', () => {
    const forum = new CommunityForum();
    forum.createUser('alice', { name: 'Alice' });
    forum.createUser('bob', { name: 'Bob' });

    const post = forum.createPost({
      userId: 'alice',
      category: CATEGORIES.QUESTIONS,
      title: 'How?',
      content: 'Help!'
    });

    forum.createReply({
      postId: post.id,
      userId: 'bob',
      content: 'Answer'
    });

    const updated = forum.acceptReply(post.id, post.replies[0].id, 'alice');
    assert(updated.replies[0].accepted === true, 'Reply not marked accepted');
  });

  test('should only allow post author to accept replies', () => {
    const forum = new CommunityForum();
    forum.createUser('alice', { name: 'Alice' });
    forum.createUser('bob', { name: 'Bob' });
    forum.createUser('charlie', { name: 'Charlie' });

    const post = forum.createPost({
      userId: 'alice',
      category: CATEGORIES.QUESTIONS,
      title: 'Q',
      content: '?'
    });

    forum.createReply({
      postId: post.id,
      userId: 'bob',
      content: 'Answer'
    });

    try {
      forum.acceptReply(post.id, post.replies[0].id, 'charlie');
      throw new Error('Should have thrown');
    } catch (e) {
      assert(e.message.includes('Only post author'), 'Wrong error');
    }
  });

  test('should award reputation for accepted answer', () => {
    const forum = new CommunityForum();
    forum.createUser('alice', { name: 'Alice' });
    forum.createUser('bob', { name: 'Bob' });

    const post = forum.createPost({
      userId: 'alice',
      category: CATEGORIES.QUESTIONS,
      title: 'Q',
      content: '?'
    });

    forum.createReply({
      postId: post.id,
      userId: 'bob',
      content: 'Answer'
    });

    const beforeRep = forum.forum.users['bob'].reputation;
    forum.acceptReply(post.id, post.replies[0].id, 'alice');
    const afterRep = forum.forum.users['bob'].reputation;

    assert(afterRep === beforeRep + REPUTATION_REWARDS.REPLY_ACCEPTED, 'Reputation mismatch');
  });

  // Helpful Marking
  test('should mark post as helpful', () => {
    const forum = new CommunityForum();
    forum.createUser('alice', { name: 'Alice' });
    forum.createUser('bob', { name: 'Bob' });

    const post = forum.createPost({
      userId: 'alice',
      category: CATEGORIES.SKILLS_SHOWCASE,
      title: 'Skill',
      content: 'Cool!'
    });

    const updated = forum.markHelpful(post.id, 'bob');
    assert(updated.helpful === 1, 'Helpful count mismatch');
    assert(updated.helpfulMarkers.includes('bob'), 'Marker not recorded');
  });

  // Badge Tests
  test('should award helpful contributor badge', () => {
    const forum = new CommunityForum();
    forum.createUser('alice', { name: 'Alice' });
    forum.createUser('bob', { name: 'Bob' });

    const post = forum.createPost({
      userId: 'alice',
      category: CATEGORIES.QUESTIONS,
      title: 'Q',
      content: '?'
    });

    forum.createReply({
      postId: post.id,
      userId: 'bob',
      content: 'Answer'
    });

    // Simulate 50 upvotes
    for (let i = 0; i < 50; i++) {
      const testUserId = `voter${i}`;
      forum.getOrCreateUser(testUserId);
      forum.upvoteReply(post.id, post.replies[0].id, testUserId);
    }

    const bob = forum.forum.users['bob'];
    assert(bob.badges.includes(BADGE_TYPES.HELPFUL_CONTRIBUTOR), 'Badge not awarded');
  });

  test('should track badge in global index', () => {
    const forum = new CommunityForum();
    forum.createUser('alice', { name: 'Alice' });
    forum.createUser('bob', { name: 'Bob' });

    forum.createPost({
      userId: 'alice',
      category: CATEGORIES.QUESTIONS,
      title: 'Q',
      content: '?'
    });

    forum.awardBadge('bob', BADGE_TYPES.BUG_HUNTER, 'Bug Hunter');

    assert(forum.forum.badges[BADGE_TYPES.BUG_HUNTER], 'Badge not in index');
    assert(forum.forum.badges[BADGE_TYPES.BUG_HUNTER].holders.includes('bob'), 'User not in holders');
  });

  // Category and Search Tests
  test('should filter posts by category', () => {
    const forum = new CommunityForum();
    forum.createUser('alice', { name: 'Alice' });

    forum.createPost({
      userId: 'alice',
      category: CATEGORIES.QUESTIONS,
      title: 'Q1',
      content: '?'
    });

    forum.createPost({
      userId: 'alice',
      category: CATEGORIES.SKILLS_SHOWCASE,
      title: 'S1',
      content: 'Skill'
    });

    const questions = forum.getPostsByCategory(CATEGORIES.QUESTIONS);
    const skills = forum.getPostsByCategory(CATEGORIES.SKILLS_SHOWCASE);

    assert(questions.length === 1, 'Question count mismatch');
    assert(skills.length === 1, 'Skills count mismatch');
  });

  test('should search posts by title and tags', () => {
    const forum = new CommunityForum();
    forum.createUser('alice', { name: 'Alice' });

    forum.createPost({
      userId: 'alice',
      category: CATEGORIES.SKILLS_SHOWCASE,
      title: 'React Hooks Guide',
      content: 'How to use hooks',
      tags: ['react', 'hooks']
    });

    const results1 = forum.searchPosts('react');
    const results2 = forum.searchPosts('hooks');
    const results3 = forum.searchPosts('guide');

    assert(results1.length === 1, 'Search by tag failed');
    assert(results2.length === 1, 'Search by tag failed');
    assert(results3.length === 1, 'Search by title failed');
  });

  // Leaderboard Tests
  test('should generate leaderboard', () => {
    const forum = new CommunityForum();
    forum.createUser('alice', { name: 'Alice' });
    forum.createUser('bob', { name: 'Bob' });

    forum.createPost({
      userId: 'alice',
      category: CATEGORIES.QUESTIONS,
      title: 'Q',
      content: '?'
    });

    forum.createPost({
      userId: 'bob',
      category: CATEGORIES.QUESTIONS,
      title: 'Q2',
      content: '?'
    });

    const leaderboard = forum.getLeaderboard(10);
    assert(leaderboard.length === 2, 'Leaderboard length mismatch');
    assert(leaderboard[0].reputation >= leaderboard[1].reputation, 'Leaderboard not sorted');
  });

  test('should get user rank', () => {
    const forum = new CommunityForum();
    for (let i = 0; i < 5; i++) {
      const userId = `user${i}`;
      forum.createUser(userId, { name: `User ${i}` });
      forum.createPost({
        userId,
        category: CATEGORIES.QUESTIONS,
        title: `Q${i}`,
        content: '?'
      });
    }

    const rank = forum.getUserRank('user0');
    assert(rank > 0, 'User should have valid rank');
    assert(rank <= 5, 'User rank should be within bounds');
  });

  // Trending Tests
  test('should get trending posts', () => {
    const forum = new CommunityForum();
    forum.createUser('alice', { name: 'Alice' });
    forum.createUser('bob', { name: 'Bob' });

    const post1 = forum.createPost({
      userId: 'alice',
      category: CATEGORIES.SKILLS_SHOWCASE,
      title: 'Skill1',
      content: 'Content'
    });

    const post2 = forum.createPost({
      userId: 'bob',
      category: CATEGORIES.QUESTIONS,
      title: 'Q',
      content: '?'
    });

    forum.upvotePost(post1.id, 'bob');
    forum.recordView(post1.id);
    forum.recordView(post1.id);

    const trending = forum.getTrendingPosts(5);
    assert(trending.length > 0, 'Should have trending posts');
    assert(trending[0].id === post1.id, 'Top post should be most engaged');
  });

  // User Profile Tests
  test('should get user profile with stats', () => {
    const forum = new CommunityForum();
    forum.createUser('alice', { name: 'Alice' });
    forum.createUser('bob', { name: 'Bob' });

    const post = forum.createPost({
      userId: 'alice',
      category: CATEGORIES.SKILLS_SHOWCASE,
      title: 'Skill',
      content: 'Content'
    });

    forum.upvotePost(post.id, 'bob');

    const profile = forum.getUserProfile('alice');
    assert(profile.name === 'Alice', 'Name mismatch');
    assert(profile.stats.totalUpvotes === 1, 'Upvote count mismatch');
    assert(profile.stats.rank > 0, 'Should have rank');
  });

  test('should get user activity summary', () => {
    const forum = new CommunityForum();
    forum.createUser('alice', { name: 'Alice' });
    forum.createUser('bob', { name: 'Bob' });

    const post = forum.createPost({
      userId: 'alice',
      category: CATEGORIES.QUESTIONS,
      title: 'Q',
      content: '?'
    });

    forum.createReply({
      postId: post.id,
      userId: 'bob',
      content: 'Answer'
    });

    forum.acceptReply(post.id, post.replies[0].id, 'alice');

    const activity = forum.getUserActivity('bob');
    assert(activity.repliesCreated === 1, 'Reply count mismatch');
    assert(activity.acceptedAnswers === 1, 'Accepted count mismatch');
    assert(activity.reputation > 0, 'Should have reputation');
  });

  // Category Stats Tests
  test('should generate category stats', () => {
    const forum = new CommunityForum();
    forum.createUser('alice', { name: 'Alice' });

    forum.createPost({
      userId: 'alice',
      category: CATEGORIES.QUESTIONS,
      title: 'Q',
      content: '?'
    });

    const stats = forum.getCategoryStats();
    assert(stats[CATEGORIES.QUESTIONS].postCount === 1, 'Post count mismatch');
    assert(stats[CATEGORIES.QUESTIONS].replyCount === 0, 'Reply count mismatch');
  });

  // Persistence Tests
  test('should persist and load forum data', () => {
    let forum = new CommunityForum();
    forum.createUser('alice', { name: 'Alice' });
    forum.createPost({
      userId: 'alice',
      category: CATEGORIES.QUESTIONS,
      title: 'Q',
      content: '?'
    });

    forum = new CommunityForum();
    const posts = forum.forum.posts;
    assert(posts.length === 1, 'Post not persisted');
    assert(posts[0].title === 'Q', 'Post data corrupted');
  });

  test('should export forum data', () => {
    const forum = new CommunityForum();
    forum.createUser('alice', { name: 'Alice' });

    const exported = forum.export();
    assert(exported.schemaVersion, 'Schema missing');
    assert(exported.posts, 'Posts missing');
    assert(exported.users, 'Users missing');
    assert(exported.exportedAt, 'Export timestamp missing');
  });

  // Summary
  console.log(`\n${'='.repeat(50)}`);
  console.log(`Tests passed: ${passed}`);
  console.log(`Tests failed: ${failed}`);
  console.log(`Total: ${passed + failed}`);
  console.log(`${'='.repeat(50)}`);

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
