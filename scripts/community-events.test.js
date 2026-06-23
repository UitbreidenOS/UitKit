#!/usr/bin/env node

/**
 * Community Events Manager - Integration Test
 * Tests core functionality: event creation, registration, recording, and reporting
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '..');
const EVENTS_DIR = path.join(REPO_ROOT, '.claude', 'community-events');
const REGISTRY_PATH = path.join(EVENTS_DIR, 'registry.json');

const BOLD = '\x1b[1m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const RESET = '\x1b[0m';

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (!condition) {
    console.log(`${RED}✗ FAIL${RESET}: ${message}`);
    testsFailed++;
    return false;
  } else {
    console.log(`${GREEN}✓ PASS${RESET}: ${message}`);
    testsPassed++;
    return true;
  }
}

function runCmd(cmd) {
  try {
    const output = execSync(cmd, {
      cwd: REPO_ROOT,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    return { success: true, output };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function getRegistry() {
  if (fs.existsSync(REGISTRY_PATH)) {
    return JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8'));
  }
  return null;
}

async function test1_EventCreation() {
  console.log(`\n${CYAN}Test 1: Event Creation${RESET}`);

  const result = runCmd(
    `node scripts/community-events.js create \
    --name "Integration Test Event" \
    --type showcase \
    --date "2026-06-28T18:00:00Z" \
    --duration "90 minutes" \
    --format virtual`
  );

  assert(result.success, 'Event creation command succeeds');
  assert(result.output.includes('Event created successfully'), 'Success message displayed');
  assert(result.output.includes('Event ID:'), 'Event ID returned');
  assert(result.output.includes('Integration Test Event'), 'Event name in output');

  const registry = getRegistry();
  assert(registry !== null, 'Registry file created');
  assert(registry.events.length > 0, 'Event stored in registry');
  assert(registry.events[0].name === 'Integration Test Event', 'Event name matches');

  return registry.events[0].id;
}

async function test2_EventListing() {
  console.log(`\n${CYAN}Test 2: Event Listing${RESET}`);

  const result = runCmd('node scripts/community-events.js list');

  assert(result.success, 'List command succeeds');
  assert(result.output.includes('Community Events'), 'Header displayed');
  assert(result.output.includes('Integration Test Event'), 'Created event listed');
}

async function test3_EventTypes() {
  console.log(`\n${CYAN}Test 3: Event Type Distribution${RESET}`);

  // Create various event types
  const types = ['hackathon', 'workshop', 'ama'];
  for (const type of types) {
    runCmd(
      `node scripts/community-events.js create \
      --name "${type} Test" \
      --type ${type} \
      --date "2026-07-15T10:00:00Z" \
      --duration "60 minutes" \
      --format virtual`
    );
  }

  const registry = getRegistry();
  const eventTypes = registry.events.map(e => e.type);
  assert(eventTypes.includes('showcase'), 'Showcase event type present');
  assert(eventTypes.includes('hackathon'), 'Hackathon event type present');
  assert(eventTypes.includes('workshop'), 'Workshop event type present');
  assert(eventTypes.includes('ama'), 'AMA event type present');
}

async function test4_EventFormats() {
  console.log(`\n${CYAN}Test 4: Event Format Support${RESET}`);

  const formats = ['in-person', 'hybrid'];
  for (const format of formats) {
    runCmd(
      `node scripts/community-events.js create \
      --name "${format} event" \
      --type workshop \
      --date "2026-07-20T14:00:00Z" \
      --duration "120 minutes" \
      --format ${format}`
    );
  }

  const registry = getRegistry();
  const eventFormats = registry.events.map(e => e.format);
  assert(eventFormats.includes('virtual'), 'Virtual format present');
  assert(eventFormats.includes('in-person'), 'In-person format present');
  assert(eventFormats.includes('hybrid'), 'Hybrid format present');
}

async function test5_AttendeeRegistration(eventId) {
  console.log(`\n${CYAN}Test 5: Attendee Registration${RESET}`);

  const result = runCmd(
    `node scripts/community-events.js register ${eventId} \
    --name "Test Attendee" \
    --email "test@example.com" \
    --organization "Test Corp" \
    --role "Engineer"`
  );

  assert(result.success, 'Attendee registration succeeds');
  assert(result.output.includes('registered successfully'), 'Registration success message');

  const registry = getRegistry();
  const event = registry.events.find(e => e.id === eventId);
  assert(event && event.attendees.length > 0, 'Attendee stored in registry');
  assert(event.attendees[0].name === 'Test Attendee', 'Attendee name matches');
}

async function test6_StatusManagement(eventId) {
  console.log(`\n${CYAN}Test 6: Event Status Management${RESET}`);

  // Update to ongoing
  let result = runCmd(`node scripts/community-events.js status ${eventId} ongoing`);
  assert(result.success, 'Status update to ongoing succeeds');

  // Update to completed
  result = runCmd(`node scripts/community-events.js status ${eventId} completed`);
  assert(result.success, 'Status update to completed succeeds');

  const registry = getRegistry();
  const event = registry.events.find(e => e.id === eventId);
  assert(event.status === 'completed', 'Event status updated in registry');
}

async function test7_RecordingArchival(eventId) {
  console.log(`\n${CYAN}Test 7: Recording Archival${RESET}`);

  const result = runCmd(
    `node scripts/community-events.js record ${eventId} \
    --url "https://www.youtube.com/watch?v=testRec123" \
    --title "Test Recording" \
    --platform youtube`
  );

  assert(result.success, 'Recording archival succeeds');
  assert(result.output.includes('Recording archived successfully'), 'Archival success message');

  const registry = getRegistry();
  const event = registry.events.find(e => e.id === eventId);
  assert(event.recordingUrl !== null, 'Recording URL stored');
  assert(event.resources.materials.length > 0, 'Recording in materials');

  // Check archive file
  const archiveDir = path.join(EVENTS_DIR, 'archive');
  const archiveExists = fs.existsSync(archiveDir);
  assert(archiveExists, 'Archive directory created');

  const archiveFiles = fs.readdirSync(archiveDir);
  assert(archiveFiles.length > 0, 'Archive file saved');
}

async function test8_ReportGeneration() {
  console.log(`\n${CYAN}Test 8: Report Generation${RESET}`);

  const result = runCmd('node scripts/community-events.js report');

  assert(result.success, 'Report generation succeeds');
  assert(result.output.includes('Community Events Report'), 'Report title present');
  assert(result.output.includes('Statistics'), 'Statistics section present');
  assert(result.output.includes('Events by Type'), 'Type breakdown present');

  // Check report file
  const reportPath = path.join(EVENTS_DIR, 'report.md');
  const reportExists = fs.existsSync(reportPath);
  assert(reportExists, 'Report file saved to disk');

  const reportContent = fs.readFileSync(reportPath, 'utf-8');
  assert(reportContent.length > 0, 'Report file has content');
  assert(reportContent.includes('Total Events'), 'Report includes statistics');
}

async function test9_CalendarView() {
  console.log(`\n${CYAN}Test 9: Calendar View${RESET}`);

  const result = runCmd('node scripts/community-events.js calendar 0');

  assert(result.success, 'Calendar view succeeds');
  assert(result.output.includes('Events Calendar'), 'Calendar title present');
}

async function test10_Statistics() {
  console.log(`\n${CYAN}Test 10: Statistics Dashboard${RESET}`);

  const result = runCmd('node scripts/community-events.js stats');

  assert(result.success, 'Statistics command succeeds');
  assert(result.output.includes('Community Events Statistics'), 'Stats title present');
  assert(result.output.includes('Total Events:'), 'Total events displayed');
  assert(result.output.includes('By Type'), 'Type breakdown present');
  assert(result.output.includes('By Format'), 'Format breakdown present');

  const registry = getRegistry();
  assert(registry.statistics.totalEvents > 0, 'Event count tracked');
}

async function test11_SeriesTracking() {
  console.log(`\n${CYAN}Test 11: Series Tracking${RESET}`);

  const registry = getRegistry();

  assert(registry.series !== undefined, 'Series object exists');
  assert(Array.isArray(registry.series.monthlyShowcase), 'Monthly showcase series tracked');
  assert(Array.isArray(registry.series.quarterlyHackathon), 'Quarterly hackathon series tracked');
  assert(Array.isArray(registry.series.expertWorkshops), 'Expert workshops series tracked');
  assert(Array.isArray(registry.series.amas), 'AMAs series tracked');
}

async function test12_DataPersistence() {
  console.log(`\n${CYAN}Test 12: Data Persistence${RESET}`);

  const registry1 = getRegistry();
  const eventCount1 = registry1.events.length;

  // List events (should load registry without creating new events)
  runCmd('node scripts/community-events.js list');

  const registry2 = getRegistry();
  const eventCount2 = registry2.events.length;

  assert(eventCount1 === eventCount2, 'Event count unchanged after reload');
  assert(registry2.lastUpdated !== undefined, 'Last updated timestamp present');
}

async function runAllTests() {
  console.log(`${BOLD}${CYAN}═══════════════════════════════════════════════════════════${RESET}`);
  console.log(`${BOLD}${CYAN}  Community Events Manager - Integration Tests${RESET}`);
  console.log(`${BOLD}${CYAN}═══════════════════════════════════════════════════════════${RESET}`);

  try {
    const eventId = await test1_EventCreation();
    await test2_EventListing();
    await test3_EventTypes();
    await test4_EventFormats();
    await test5_AttendeeRegistration(eventId);
    await test6_StatusManagement(eventId);
    await test7_RecordingArchival(eventId);
    await test8_ReportGeneration();
    await test9_CalendarView();
    await test10_Statistics();
    await test11_SeriesTracking();
    await test12_DataPersistence();

    console.log(`\n${BOLD}${CYAN}═══════════════════════════════════════════════════════════${RESET}`);
    console.log(`${BOLD}Test Results${RESET}`);
    console.log(`${BOLD}${CYAN}═══════════════════════════════════════════════════════════${RESET}`);
    console.log(`${GREEN}Passed: ${testsPassed}${RESET}`);
    console.log(`${RED}Failed: ${testsFailed}${RESET}`);
    console.log(`Total:  ${testsPassed + testsFailed}\n`);

    if (testsFailed === 0) {
      console.log(`${GREEN}${BOLD}✓ All integration tests passed!${RESET}\n`);
      process.exit(0);
    } else {
      console.log(`${RED}${BOLD}✗ ${testsFailed} test(s) failed${RESET}\n`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`${RED}Test execution error: ${error.message}${RESET}`);
    process.exit(1);
  }
}

runAllTests();
