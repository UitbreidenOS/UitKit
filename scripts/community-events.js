#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '..');
const EVENTS_DIR = path.join(REPO_ROOT, '.claude', 'community-events');
const REGISTRY_PATH = path.join(EVENTS_DIR, 'registry.json');
const ARCHIVE_DIR = path.join(EVENTS_DIR, 'archive');
const RECORDINGS_DIR = path.join(EVENTS_DIR, 'recordings');

// Color codes
const BOLD = '\x1b[1m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const BLUE = '\x1b[34m';
const MAGENTA = '\x1b[35m';
const CYAN = '\x1b[36m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';

// Initialize directories
function initializeDirs() {
  [EVENTS_DIR, ARCHIVE_DIR, RECORDINGS_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

// Load or create registry
function loadRegistry() {
  if (fs.existsSync(REGISTRY_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8'));
    } catch {
      return getEmptyRegistry();
    }
  }
  return getEmptyRegistry();
}

function getEmptyRegistry() {
  return {
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    events: [],
    series: {
      monthlyShowcase: [],
      quarterlyHackathon: [],
      expertWorkshops: [],
      amas: []
    },
    statistics: {
      totalEvents: 0,
      totalAttendees: 0,
      totalRecordings: 0,
      upcomingEvents: 0
    }
  };
}

function saveRegistry(registry) {
  registry.lastUpdated = new Date().toISOString();
  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2), 'utf-8');
}

// Create event
function createEvent(options) {
  const {
    name,
    type, // 'showcase', 'hackathon', 'workshop', 'ama'
    date,
    duration,
    format, // 'virtual', 'in-person', 'hybrid'
    location,
    description,
    speakers = [],
    maxAttendees = null,
    registrationUrl = null,
    recordingUrl = null
  } = options;

  const event = {
    id: generateId(),
    name,
    type,
    date,
    duration,
    format,
    location,
    description,
    speakers,
    maxAttendees,
    registrationUrl,
    recordingUrl,
    createdAt: new Date().toISOString(),
    status: 'scheduled',
    attendees: [],
    resources: {
      slides: [],
      notes: [],
      materials: []
    }
  };

  const registry = loadRegistry();
  registry.events.push(event);

  // Add to appropriate series
  switch (type) {
    case 'showcase':
      registry.series.monthlyShowcase.push(event.id);
      break;
    case 'hackathon':
      registry.series.quarterlyHackathon.push(event.id);
      break;
    case 'workshop':
      registry.series.expertWorkshops.push(event.id);
      break;
    case 'ama':
      registry.series.amas.push(event.id);
      break;
  }

  registry.statistics.totalEvents += 1;
  saveRegistry(registry);

  return event;
}

// Get event by ID
function getEvent(eventId) {
  const registry = loadRegistry();
  return registry.events.find(e => e.id === eventId);
}

// List events
function listEvents(filter = {}) {
  const registry = loadRegistry();
  let events = registry.events;

  if (filter.type) {
    events = events.filter(e => e.type === filter.type);
  }

  if (filter.format) {
    events = events.filter(e => e.format === filter.format);
  }

  if (filter.status) {
    events = events.filter(e => e.status === filter.status);
  }

  if (filter.upcoming) {
    const now = new Date();
    events = events.filter(e => new Date(e.date) > now);
  }

  return events.sort((a, b) => new Date(a.date) - new Date(b.date));
}

// Register attendee
function registerAttendee(eventId, attendeeInfo) {
  const registry = loadRegistry();
  const event = registry.events.find(e => e.id === eventId);

  if (!event) {
    throw new Error(`Event ${eventId} not found`);
  }

  if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
    throw new Error('Event is at maximum capacity');
  }

  const attendee = {
    id: generateId(),
    name: attendeeInfo.name,
    email: attendeeInfo.email,
    organization: attendeeInfo.organization || null,
    role: attendeeInfo.role || null,
    registeredAt: new Date().toISOString(),
    attended: false
  };

  event.attendees.push(attendee);
  registry.statistics.totalAttendees += 1;
  saveRegistry(registry);

  return attendee;
}

// Mark attendee as attended
function markAttended(eventId, attendeeId) {
  const registry = loadRegistry();
  const event = registry.events.find(e => e.id === eventId);

  if (!event) {
    throw new Error(`Event ${eventId} not found`);
  }

  const attendee = event.attendees.find(a => a.id === attendeeId);
  if (!attendee) {
    throw new Error(`Attendee ${attendeeId} not found`);
  }

  attendee.attended = true;
  saveRegistry(registry);

  return attendee;
}

// Add recording
function addRecording(eventId, recordingInfo) {
  const { url, title, platform = 'youtube', thumbnail = null } = recordingInfo;

  const registry = loadRegistry();
  const event = registry.events.find(e => e.id === eventId);

  if (!event) {
    throw new Error(`Event ${eventId} not found`);
  }

  const recording = {
    id: generateId(),
    url,
    title,
    platform,
    thumbnail,
    addedAt: new Date().toISOString(),
    views: 0
  };

  event.recordingUrl = url;
  event.resources.materials = event.resources.materials || [];
  event.resources.materials.push(recording);

  registry.statistics.totalRecordings += 1;

  // Create archive entry
  const archiveEntry = {
    eventId: event.id,
    eventName: event.name,
    eventType: event.type,
    date: event.date,
    recording,
    archivedAt: new Date().toISOString()
  };

  const archivePath = path.join(ARCHIVE_DIR, `${event.id}.json`);
  fs.writeFileSync(archivePath, JSON.stringify(archiveEntry, null, 2), 'utf-8');

  saveRegistry(registry);

  return recording;
}

// Update event status
function updateEventStatus(eventId, newStatus) {
  const registry = loadRegistry();
  const event = registry.events.find(e => e.id === eventId);

  if (!event) {
    throw new Error(`Event ${eventId} not found`);
  }

  const validStatuses = ['scheduled', 'ongoing', 'completed', 'cancelled', 'postponed'];
  if (!validStatuses.includes(newStatus)) {
    throw new Error(`Invalid status: ${newStatus}`);
  }

  event.status = newStatus;
  saveRegistry(registry);

  return event;
}

// Get statistics
function getStatistics() {
  const registry = loadRegistry();
  const events = registry.events;

  return {
    total: events.length,
    byType: {
      showcase: events.filter(e => e.type === 'showcase').length,
      hackathon: events.filter(e => e.type === 'hackathon').length,
      workshop: events.filter(e => e.type === 'workshop').length,
      ama: events.filter(e => e.type === 'ama').length
    },
    byFormat: {
      virtual: events.filter(e => e.format === 'virtual').length,
      inPerson: events.filter(e => e.format === 'in-person').length,
      hybrid: events.filter(e => e.format === 'hybrid').length
    },
    byStatus: {
      scheduled: events.filter(e => e.status === 'scheduled').length,
      ongoing: events.filter(e => e.status === 'ongoing').length,
      completed: events.filter(e => e.status === 'completed').length,
      cancelled: events.filter(e => e.status === 'cancelled').length
    },
    totalAttendees: registry.statistics.totalAttendees,
    totalRecordings: registry.statistics.totalRecordings,
    upcomingEvents: events.filter(e => new Date(e.date) > new Date()).length
  };
}

// Generate event report
function generateReport() {
  const registry = loadRegistry();
  const stats = getStatistics();

  let report = `# Community Events Report\n\n`;
  report += `**Generated:** ${new Date().toISOString()}\n\n`;

  report += `## Statistics\n\n`;
  report += `- **Total Events:** ${stats.total}\n`;
  report += `- **Total Attendees:** ${stats.totalAttendees}\n`;
  report += `- **Total Recordings Archived:** ${stats.totalRecordings}\n`;
  report += `- **Upcoming Events:** ${stats.upcomingEvents}\n\n`;

  report += `### Events by Type\n`;
  report += `- Monthly Skill Showcase: ${stats.byType.showcase}\n`;
  report += `- Quarterly Hackathon: ${stats.byType.hackathon}\n`;
  report += `- Expert Workshops: ${stats.byType.workshop}\n`;
  report += `- AMAs: ${stats.byType.ama}\n\n`;

  report += `### Events by Format\n`;
  report += `- Virtual: ${stats.byFormat.virtual}\n`;
  report += `- In-Person: ${stats.byFormat.inPerson}\n`;
  report += `- Hybrid: ${stats.byFormat.hybrid}\n\n`;

  report += `### Events by Status\n`;
  report += `- Scheduled: ${stats.byStatus.scheduled}\n`;
  report += `- Ongoing: ${stats.byStatus.ongoing}\n`;
  report += `- Completed: ${stats.byStatus.completed}\n`;
  report += `- Cancelled: ${stats.byStatus.cancelled}\n\n`;

  report += `## Upcoming Events\n\n`;
  const upcoming = listEvents({ upcoming: true });
  if (upcoming.length === 0) {
    report += `No upcoming events scheduled.\n\n`;
  } else {
    upcoming.forEach(event => {
      report += `### ${event.name}\n`;
      report += `- **Date:** ${event.date}\n`;
      report += `- **Type:** ${event.type}\n`;
      report += `- **Format:** ${event.format}\n`;
      if (event.location) report += `- **Location:** ${event.location}\n`;
      report += `- **Duration:** ${event.duration}\n`;
      report += `- **Registered Attendees:** ${event.attendees.length}${event.maxAttendees ? ` / ${event.maxAttendees}` : ''}\n`;
      if (event.speakers.length > 0) {
        report += `- **Speakers:** ${event.speakers.join(', ')}\n`;
      }
      report += `\n`;
    });
  }

  report += `## Recently Completed Events\n\n`;
  const completed = registry.events
    .filter(e => e.status === 'completed')
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  if (completed.length === 0) {
    report += `No completed events.\n\n`;
  } else {
    completed.forEach(event => {
      report += `### ${event.name}\n`;
      report += `- **Date:** ${event.date}\n`;
      report += `- **Attendees:** ${event.attendees.filter(a => a.attended).length} attended\n`;
      if (event.recordingUrl) {
        report += `- **Recording:** [View](${event.recordingUrl})\n`;
      }
      report += `\n`;
    });
  }

  report += `## Archived Recordings\n\n`;
  if (!fs.existsSync(ARCHIVE_DIR)) {
    report += `No archived recordings yet.\n`;
  } else {
    const files = fs.readdirSync(ARCHIVE_DIR).filter(f => f.endsWith('.json'));
    if (files.length === 0) {
      report += `No archived recordings yet.\n`;
    } else {
      files.forEach(file => {
        const archive = JSON.parse(fs.readFileSync(path.join(ARCHIVE_DIR, file), 'utf-8'));
        report += `- **${archive.eventName}** (${archive.eventType}) - [${archive.recording.platform}](${archive.recording.url})\n`;
      });
    }
  }

  return report;
}

// Generate calendar view
function generateCalendarView(monthOffset = 0) {
  const registry = loadRegistry();
  const now = new Date();
  const targetMonth = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);

  const monthName = targetMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  let calendar = `# Events Calendar - ${monthName}\n\n`;

  const monthEvents = registry.events.filter(e => {
    const eventDate = new Date(e.date);
    return eventDate.getMonth() === targetMonth.getMonth() &&
           eventDate.getFullYear() === targetMonth.getFullYear();
  });

  if (monthEvents.length === 0) {
    calendar += `No events scheduled for ${monthName}.\n`;
  } else {
    monthEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    monthEvents.forEach(event => {
      const eventDate = new Date(event.date);
      const dayOfMonth = eventDate.getDate();
      calendar += `## ${dayOfMonth} - ${event.name}\n`;
      calendar += `- **Type:** ${event.type}\n`;
      calendar += `- **Time:** ${event.date.split('T')[1] || 'TBD'}\n`;
      calendar += `- **Format:** ${event.format}\n`;
      if (event.location) calendar += `- **Location:** ${event.location}\n`;
      calendar += `\n`;
    });
  }

  return calendar;
}

// Utility function to generate ID
function generateId() {
  return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// CLI interface
function showHelp() {
  console.log(`
${BOLD}${CYAN}╔════════════════════════════════════════════════════════════════╗${RESET}
${BOLD}${CYAN}║           Community Events Manager for Claudient                ║${RESET}
${BOLD}${CYAN}╚════════════════════════════════════════════════════════════════╝${RESET}

${BOLD}USAGE${RESET}
  npx claudient community-events <command> [options]

${BOLD}COMMANDS${RESET}
  ${CYAN}create${RESET}              Create a new community event
  ${CYAN}list${RESET}                List upcoming or all events
  ${CYAN}get${RESET}                 Display event details
  ${CYAN}register${RESET}            Register attendee for an event
  ${CYAN}mark-attended${RESET}       Mark attendee as attended
  ${CYAN}record${RESET}              Add recording to completed event
  ${CYAN}status${RESET}              Update event status
  ${CYAN}report${RESET}              Generate community events report
  ${CYAN}calendar${RESET}            Show calendar view for specified month
  ${CYAN}stats${RESET}               Display statistics
  ${CYAN}help${RESET}                Show this help message

${BOLD}EXAMPLES${RESET}
  # Create monthly skill showcase
  npx claudient community-events create \\
    --name "June Skill Showcase" \\
    --type showcase \\
    --date "2026-06-28T18:00:00Z" \\
    --duration "90 minutes" \\
    --format virtual

  # List upcoming events
  npx claudient community-events list --upcoming

  # Add recording to event
  npx claudient community-events record <eventId> \\
    --url "https://youtube.com/..." \\
    --title "Recording Title"

  # Generate report
  npx claudient community-events report

${BOLD}EVENT TYPES${RESET}
  - showcase:    Monthly skill showcase
  - hackathon:   Quarterly hackathon competition
  - workshop:    Expert workshops
  - ama:         Ask Me Anything sessions

${BOLD}FORMATS${RESET}
  - virtual:     Online only
  - in-person:   Physical location
  - hybrid:      Both online and in-person
`);
}

async function main() {
  initializeDirs();

  const args = process.argv.slice(2);
  const command = args[0];

  try {
    switch (command) {
      case 'create': {
        console.log(`${CYAN}${BOLD}Creating new event...${RESET}`);
        // Parse arguments
        const opts = {};
        for (let i = 1; i < args.length; i++) {
          if (args[i].startsWith('--')) {
            const key = args[i].slice(2);
            const value = args[i + 1];
            opts[key] = value;
            i++;
          }
        }

        const event = createEvent({
          name: opts.name || 'Untitled Event',
          type: opts.type || 'showcase',
          date: opts.date || new Date().toISOString(),
          duration: opts.duration || '60 minutes',
          format: opts.format || 'virtual',
          location: opts.location || null,
          description: opts.description || 'Community event',
          speakers: opts.speakers ? opts.speakers.split(',') : [],
          maxAttendees: opts['max-attendees'] ? parseInt(opts['max-attendees']) : null,
          registrationUrl: opts['registration-url'] || null
        });

        console.log(`${GREEN}✔${RESET} Event created successfully!`);
        console.log(`${YELLOW}Event ID:${RESET} ${event.id}`);
        console.log(`${YELLOW}Name:${RESET} ${event.name}`);
        console.log(`${YELLOW}Date:${RESET} ${event.date}`);
        break;
      }

      case 'list': {
        const upcoming = args.includes('--upcoming');
        const events = listEvents({ upcoming });

        if (events.length === 0) {
          console.log(`${YELLOW}No events found.${RESET}`);
        } else {
          console.log(`\n${BOLD}${CYAN}═══════════════════════════════════════════════════════════${RESET}`);
          console.log(`${BOLD}Community Events${RESET}`);
          console.log(`${BOLD}${CYAN}═══════════════════════════════════════════════════════════${RESET}\n`);

          events.forEach((e, idx) => {
            const statusColor = e.status === 'completed' ? GREEN :
                              e.status === 'scheduled' ? CYAN :
                              e.status === 'cancelled' ? RED : YELLOW;
            console.log(`${idx + 1}. ${BOLD}${e.name}${RESET}`);
            console.log(`   ${DIM}ID: ${e.id}${RESET}`);
            console.log(`   Type: ${e.type} | Format: ${e.format} | Status: ${statusColor}${e.status}${RESET}`);
            console.log(`   Date: ${e.date} | Attendees: ${e.attendees.length}${e.maxAttendees ? ` / ${e.maxAttendees}` : ''}`);
            console.log();
          });
        }
        break;
      }

      case 'get': {
        const eventId = args[1];
        if (!eventId) {
          console.error(`${RED}Error: Event ID required${RESET}`);
          process.exit(1);
        }

        const event = getEvent(eventId);
        if (!event) {
          console.error(`${RED}Event not found: ${eventId}${RESET}`);
          process.exit(1);
        }

        console.log(`\n${BOLD}${event.name}${RESET}`);
        console.log(`${DIM}${event.id}${RESET}\n`);
        console.log(`Type: ${event.type}`);
        console.log(`Date: ${event.date}`);
        console.log(`Duration: ${event.duration}`);
        console.log(`Format: ${event.format}`);
        if (event.location) console.log(`Location: ${event.location}`);
        console.log(`Status: ${event.status}`);
        console.log(`Description: ${event.description}`);
        if (event.speakers.length > 0) console.log(`Speakers: ${event.speakers.join(', ')}`);
        console.log(`Attendees: ${event.attendees.length}${event.maxAttendees ? ` / ${event.maxAttendees}` : ''}`);
        if (event.recordingUrl) console.log(`Recording: ${event.recordingUrl}`);
        console.log();
        break;
      }

      case 'register': {
        const eventId = args[1];
        if (!eventId) {
          console.error(`${RED}Error: Event ID required${RESET}`);
          process.exit(1);
        }

        const opts = {};
        for (let i = 2; i < args.length; i++) {
          if (args[i].startsWith('--')) {
            const key = args[i].slice(2);
            opts[key] = args[i + 1];
            i++;
          }
        }

        const attendee = registerAttendee(eventId, {
          name: opts.name || 'Attendee',
          email: opts.email || '',
          organization: opts.organization || null,
          role: opts.role || null
        });

        console.log(`${GREEN}✔${RESET} Attendee registered successfully!`);
        console.log(`${YELLOW}Attendee ID:${RESET} ${attendee.id}`);
        console.log(`${YELLOW}Name:${RESET} ${attendee.name}`);
        break;
      }

      case 'record': {
        const eventId = args[1];
        if (!eventId) {
          console.error(`${RED}Error: Event ID required${RESET}`);
          process.exit(1);
        }

        const opts = {};
        for (let i = 2; i < args.length; i++) {
          if (args[i].startsWith('--')) {
            const key = args[i].slice(2);
            opts[key] = args[i + 1];
            i++;
          }
        }

        const recording = addRecording(eventId, {
          url: opts.url || '',
          title: opts.title || 'Event Recording',
          platform: opts.platform || 'youtube',
          thumbnail: opts.thumbnail || null
        });

        console.log(`${GREEN}✔${RESET} Recording archived successfully!`);
        console.log(`${YELLOW}Recording ID:${RESET} ${recording.id}`);
        console.log(`${YELLOW}Platform:${RESET} ${recording.platform}`);
        console.log(`${YELLOW}URL:${RESET} ${recording.url}`);
        break;
      }

      case 'status': {
        const eventId = args[1];
        const newStatus = args[2];

        if (!eventId || !newStatus) {
          console.error(`${RED}Error: Event ID and status required${RESET}`);
          process.exit(1);
        }

        const event = updateEventStatus(eventId, newStatus);
        console.log(`${GREEN}✔${RESET} Event status updated to: ${YELLOW}${event.status}${RESET}`);
        break;
      }

      case 'report': {
        const report = generateReport();
        console.log(report);

        const reportPath = path.join(EVENTS_DIR, 'report.md');
        fs.writeFileSync(reportPath, report, 'utf-8');
        console.log(`\n${GREEN}✔${RESET} Report saved to: ${YELLOW}${reportPath}${RESET}`);
        break;
      }

      case 'calendar': {
        const monthOffset = args[1] ? parseInt(args[1]) : 0;
        const calendar = generateCalendarView(monthOffset);
        console.log(calendar);
        break;
      }

      case 'stats': {
        const stats = getStatistics();
        console.log(`\n${BOLD}${CYAN}Community Events Statistics${RESET}\n`);
        console.log(`Total Events: ${YELLOW}${stats.total}${RESET}`);
        console.log(`Total Attendees: ${YELLOW}${stats.totalAttendees}${RESET}`);
        console.log(`Archived Recordings: ${YELLOW}${stats.totalRecordings}${RESET}`);
        console.log(`Upcoming Events: ${YELLOW}${stats.upcomingEvents}${RESET}\n`);

        console.log(`${BOLD}By Type${RESET}`);
        console.log(`  Showcases: ${stats.byType.showcase}`);
        console.log(`  Hackathons: ${stats.byType.hackathon}`);
        console.log(`  Workshops: ${stats.byType.workshop}`);
        console.log(`  AMAs: ${stats.byType.ama}\n`);

        console.log(`${BOLD}By Format${RESET}`);
        console.log(`  Virtual: ${stats.byFormat.virtual}`);
        console.log(`  In-Person: ${stats.byFormat.inPerson}`);
        console.log(`  Hybrid: ${stats.byFormat.hybrid}\n`);
        break;
      }

      case 'help':
      default:
        showHelp();
        break;
    }
  } catch (error) {
    console.error(`${RED}Error: ${error.message}${RESET}`);
    process.exit(1);
  }
}

main();
