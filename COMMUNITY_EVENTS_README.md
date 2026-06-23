# Community Events Manager

A comprehensive event management system for Claudient community organizing — monthly skill showcases, quarterly hackathons, expert workshops, AMAs with the team, and virtual + in-person conference presence. All events support recording archival and automatic report generation.

## Quick Start

```bash
# View help
npm run community-events help

# Create an event
npm run community-events create \
  --name "June Skill Showcase" \
  --type showcase \
  --date "2026-06-28T18:00:00Z" \
  --duration "90 minutes" \
  --format virtual

# List upcoming events
npm run community-events list --upcoming

# Get event details
npm run community-events get <eventId>

# Register attendee
npm run community-events register <eventId> \
  --name "Alice Johnson" \
  --email "alice@example.com" \
  --organization "TechCorp" \
  --role "Engineer"

# Update event status
npm run community-events status <eventId> completed

# Add recording
npm run community-events record <eventId> \
  --url "https://youtube.com/..." \
  --title "Recording Title" \
  --platform youtube

# Generate report
npm run community-events report

# View statistics
npm run community-events stats

# View calendar
npm run community-events calendar [monthOffset]
```

## Features

### Event Management
- **Create events** with title, type, date, duration, format, location, and speaker list
- **Track attendees** with registration tracking and attended/no-show marking
- **Update status** through event lifecycle (scheduled → ongoing → completed)
- **Capacity management** with optional max attendee limits

### Event Types
1. **Showcase** (`showcase`) - Monthly skill showcase featuring community contributions
2. **Hackathon** (`hackathon`) - Quarterly hackathon competitions
3. **Workshop** (`workshop`) - Expert workshops on advanced topics
4. **AMA** (`ama`) - Ask Me Anything sessions with team and experts

### Event Formats
- **Virtual** - Online only (Zoom, Teams, YouTube Live)
- **In-Person** - Physical location only
- **Hybrid** - Both online and in-person simultaneously

### Recording & Archival
- **Add recordings** to completed events from YouTube, Vimeo, or other platforms
- **Automatic archival** with event metadata, platform, and thumbnail support
- **Archive directory** at `.claude/community-events/archive/` with indexed access

### Reporting
- **Generate comprehensive reports** with statistics, attendee counts, and recording links
- **Calendar views** for monthly event planning
- **Statistics dashboard** tracking event types, formats, and attendance trends
- **Auto-saved reports** to `.claude/community-events/report.md`

### Data Persistence
- **Registry system** at `.claude/community-events/registry.json` with full event history
- **Series tracking** for monthly/quarterly recurring events
- **Attendee data** with registration time, organization, and role
- **Resource management** for slides, notes, and supporting materials

## Commands

### `create` — Create a new event

```bash
npm run community-events create [options]
```

**Options:**
- `--name TEXT` - Event name (required)
- `--type TYPE` - Event type: showcase, hackathon, workshop, ama
- `--date ISO8601` - Event date/time (e.g., "2026-06-28T18:00:00Z")
- `--duration TEXT` - Duration (e.g., "90 minutes", "24 hours")
- `--format FORMAT` - virtual, in-person, or hybrid
- `--location TEXT` - Physical location (for in-person/hybrid)
- `--description TEXT` - Event description
- `--speakers TEXT` - Comma-separated speaker names
- `--max-attendees N` - Maximum capacity (optional)
- `--registration-url URL` - External registration link

**Example:**
```bash
npm run community-events create \
  --name "Advanced Claude Code Workshop" \
  --type workshop \
  --date "2026-07-10T14:00:00Z" \
  --duration "2 hours" \
  --format in-person \
  --location "Claude HQ, San Francisco" \
  --description "Deep dive into multi-agent systems" \
  --speakers "Alice Smith, Bob Johnson"
```

### `list` — List events

```bash
npm run community-events list [--upcoming]
```

**Options:**
- `--upcoming` - Show only upcoming events (default: show all)

**Output:**
- Event name, type, format, status
- Date and attendee count
- Event ID for reference

### `get` — Display event details

```bash
npm run community-events get <eventId>
```

**Shows:**
- Full event metadata
- Registered attendees
- Recording links
- Event status and lifecycle

### `register` — Register attendee

```bash
npm run community-events register <eventId> [options]
```

**Options:**
- `--name TEXT` - Attendee name
- `--email EMAIL` - Email address
- `--organization TEXT` - Company/organization
- `--role TEXT` - Job title/role

**Returns:**
- Unique attendee ID for tracking

**Example:**
```bash
npm run community-events register evt_1782120960613_68rmj7j7j \
  --name "Alice Johnson" \
  --email "alice@example.com" \
  --organization "TechCorp" \
  --role "Software Engineer"
```

### `mark-attended` — Mark attendee as attended

```bash
npm run community-events mark-attended <eventId> <attendeeId>
```

Tracks actual event participation for reporting.

### `record` — Add recording to event

```bash
npm run community-events record <eventId> [options]
```

**Options:**
- `--url URL` - Recording URL (YouTube, Vimeo, etc.)
- `--title TEXT` - Recording title
- `--platform PLATFORM` - youtube, vimeo, custom (default: youtube)
- `--thumbnail URL` - Thumbnail image URL

**Example:**
```bash
npm run community-events record evt_1782120960613_68rmj7j7j \
  --url "https://www.youtube.com/watch?v=skillShowcase2026" \
  --title "June Skill Showcase - Full Recording" \
  --platform youtube
```

**Archival:**
- Recording automatically saved to `.claude/community-events/archive/`
- Indexed in registry with event metadata
- Accessible via `report` command

### `status` — Update event status

```bash
npm run community-events status <eventId> <newStatus>
```

**Valid statuses:**
- `scheduled` - Event planned
- `ongoing` - Event in progress
- `completed` - Event finished
- `cancelled` - Event cancelled
- `postponed` - Event postponed

**Example:**
```bash
npm run community-events status evt_1782120960613_68rmj7j7j completed
```

### `report` — Generate community events report

```bash
npm run community-events report
```

**Generates:**
- Statistics (total events, attendees, recordings)
- Events breakdown by type, format, and status
- Upcoming events list
- Recently completed events with recordings
- Archived recordings index

**Output:**
- Console display
- Auto-saved to `.claude/community-events/report.md`

**Sample Report Sections:**
```
# Community Events Report

## Statistics
- **Total Events:** 4
- **Total Attendees:** 24
- **Total Recordings Archived:** 3
- **Upcoming Events:** 2

### Events by Type
- Monthly Skill Showcase: 1
- Quarterly Hackathon: 1
- Expert Workshops: 2
- AMAs: 1

## Upcoming Events
### Founder AMA - Building with Claude Code
- **Date:** 2026-06-25T19:00:00Z
- **Format:** virtual
- **Registered Attendees:** 15

## Recently Completed Events
### June Skill Showcase
- **Date:** 2026-06-28T18:00:00Z
- **Attendees:** 22 attended
- **Recording:** [View](https://youtube.com/...)

## Archived Recordings
- **June Skill Showcase** (showcase) - [youtube](https://youtube.com/...)
```

### `calendar` — Show calendar view

```bash
npm run community-events calendar [monthOffset]
```

**Options:**
- `monthOffset` - Month offset from current (0=this month, 1=next month, -1=last month)

**Shows:**
- Calendar grid with events by date
- Event type, format, and attendance

### `stats` — Display statistics

```bash
npm run community-events stats
```

**Shows:**
- Total events count
- Events by type and format
- Events by status
- Attendee and recording statistics
- Upcoming events count

## Data Storage

### Registry Structure
```
.claude/community-events/
├── registry.json          # Master registry with all events
├── archive/               # Archived recordings metadata
│   ├── evt_123.json
│   ├── evt_456.json
│   └── ...
├── recordings/            # Recording metadata and links
│   └── ...
└── report.md              # Latest generated report
```

### Event Object
```json
{
  "id": "evt_1782120960613_68rmj7j7j",
  "name": "June Skill Showcase",
  "type": "showcase",
  "date": "2026-06-28T18:00:00Z",
  "duration": "90 minutes",
  "format": "virtual",
  "location": null,
  "description": "Showcase latest Claude Code skills",
  "speakers": ["Alice Smith", "Bob Johnson"],
  "maxAttendees": null,
  "registrationUrl": null,
  "recordingUrl": "https://youtube.com/watch?v=...",
  "status": "completed",
  "attendees": [
    {
      "id": "evt_1782121048472_gzzyswbjk",
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "organization": "TechCorp",
      "role": "Engineer",
      "registeredAt": "2026-06-22T09:37:28.472Z",
      "attended": true
    }
  ],
  "resources": {
    "slides": [],
    "notes": [],
    "materials": [
      {
        "id": "evt_1782121123145_l2u7557uu",
        "url": "https://youtube.com/watch?v=...",
        "title": "June Skill Showcase - Highlights",
        "platform": "youtube",
        "addedAt": "2026-06-22T09:38:43.145Z",
        "views": 0
      }
    ]
  }
}
```

### Registry.json Structure
```json
{
  "version": "1.0.0",
  "createdAt": "2026-06-22T09:36:00.614Z",
  "lastUpdated": "2026-06-22T09:38:43.146Z",
  "events": [...],
  "series": {
    "monthlyShowcase": ["evt_123", "evt_456"],
    "quarterlyHackathon": ["evt_789"],
    "expertWorkshops": ["evt_012"],
    "amas": ["evt_345"]
  },
  "statistics": {
    "totalEvents": 4,
    "totalAttendees": 24,
    "totalRecordings": 3,
    "upcomingEvents": 2
  }
}
```

## Workflows

### Monthly Skill Showcase Workflow
1. **Create event** 2-3 weeks in advance
2. **Invite speakers** and add to event
3. **Promote** via channels and email
4. **Register attendees** as they sign up
5. **Run event** and mark status as `ongoing`
6. **Mark attendees** as attended/no-show
7. **Record event** and add to registry
8. **Mark complete** and archive recording
9. **Generate report** for metrics

### Quarterly Hackathon Workflow
1. **Plan hackathon** theme and schedule
2. **Create event** with 200+ capacity
3. **Set up registration** with external form (if needed)
4. **Import attendees** via registration URLs
5. **Coordinate with team** on judging and prizes
6. **Run event** (mark `ongoing`)
7. **Record keynotes/demos** during event
8. **Mark completed** and archive recordings
9. **Generate report** with attendance stats

### Expert Workshop Workflow
1. **Identify expert** and topic
2. **Schedule** workshop (typically 90-120 min)
3. **Create in-person event** at HQ or conference
4. **Set capacity** limits if needed
5. **Registration opens** 2-3 weeks before
6. **Send reminders** to registered attendees
7. **Record session** for archive
8. **Update status** as completed
9. **Archive recording** with slides/materials
10. **Generate metrics** report

### AMA Workflow
1. **Select expert/founder** for AMA
2. **Create virtual event** (60 min standard)
3. **Promote** to community
4. **Collect pre-event questions** via channels
5. **Run AMA** (mark `ongoing`)
6. **Record** for archive
7. **Mark complete** and archive
8. **Share recording** with timestamps for key Q&As

## Integration

### CLI Integration
```bash
# Add to package.json
npm run community-events create --name "Event Name" ...
npm run community-events list --upcoming
npm run community-events report
```

### Programmatic Access
The script can be extended with JavaScript APIs:

```javascript
const {
  createEvent,
  registerAttendee,
  addRecording,
  updateEventStatus,
  generateReport
} = require('./scripts/community-events.js');
```

### Automation Ideas
- **Cron job** to send reminder emails from `registry.json`
- **Weekly sync** to calendar systems (Google Calendar, Outlook)
- **Discord bot** for event registration and updates
- **Email notifications** on event status changes
- **Slack integration** for automated announcements

## Examples

### Create Full Monthly Showcase
```bash
npm run community-events create \
  --name "July 2026 Claude Code Skill Showcase" \
  --type showcase \
  --date "2026-07-28T18:00:00Z" \
  --duration "90 minutes" \
  --format virtual \
  --description "Community members showcase new skills and automation patterns" \
  --speakers "Alice Smith,Bob Johnson,Carol White"
```

### Quarterly Hackathon Setup
```bash
npm run community-events create \
  --name "Q3 2026 Claude Code Hackathon" \
  --type hackathon \
  --date "2026-08-15T10:00:00Z" \
  --duration "24 hours" \
  --format hybrid \
  --location "San Francisco HQ + Online" \
  --max-attendees 300 \
  --description "24-hour coding challenge: build the best Claude Code agent"
```

### Workshop at Conference
```bash
npm run community-events create \
  --name "Advanced Multi-Agent Systems Workshop" \
  --type workshop \
  --date "2026-09-20T14:00:00Z" \
  --duration "120 minutes" \
  --format in-person \
  --location "Cloud Native Conf 2026, Seattle" \
  --speakers "Dr. Alex Chen" \
  --registration-url "https://cloudnativeconf.com/workshops"
```

## Statistics & Reporting

### View Quick Stats
```bash
npm run community-events stats
```

### Generate Detailed Report
```bash
npm run community-events report
# Saves to .claude/community-events/report.md
```

### View Calendar
```bash
# Current month
npm run community-events calendar

# Next month
npm run community-events calendar 1

# Previous month
npm run community-events calendar -1
```

## Troubleshooting

### Registry Corruption
If registry becomes corrupted:
```bash
# Backup current registry
cp .claude/community-events/registry.json .claude/community-events/registry.backup.json

# Check registry format
node -e "console.log(JSON.parse(require('fs').readFileSync('.claude/community-events/registry.json')))"
```

### Missing Events
Registry is automatically loaded/created on first run. If events disappear:
1. Check `.claude/community-events/registry.json` exists
2. Verify file permissions: `chmod 644 .claude/community-events/registry.json`
3. Review `.claude/community-events/archive/` for archived events

### Recording Links Not Saving
Ensure platform is specified when adding recordings:
```bash
npm run community-events record <eventId> \
  --url "https://youtube.com/watch?v=xyz" \
  --title "Event Recording" \
  --platform youtube
```

## Extension Points

### Add Custom Metadata
Extend the event object structure in `community-events.js` to track:
- Sponsorship info
- Partnerships
- Feedback/survey links
- Post-event action items
- Revenue/sponsorship metrics

### Email Integration
Add email module to:
- Send registration confirmations
- Reminder emails 1 week before
- Thank you emails post-event
- Recording links to attendees

### Analytics Dashboard
Build dashboard to visualize:
- Attendance trends
- Event type performance
- Geographic distribution
- Most popular speakers
- Recording view counts

### Conference Integration
Connect to conference platforms:
- Auto-sync speaker profiles
- Pull attendance data
- Update speaker schedules
- Track sessions across events

## License

Part of Claudient — follows project license (AGPL-3.0-or-later AND CC-BY-SA-4.0)

## Support

For issues, feature requests, or questions:
- Check registry data: `.claude/community-events/registry.json`
- Review recent report: `.claude/community-events/report.md`
- Run stats for diagnostics: `npm run community-events stats`
