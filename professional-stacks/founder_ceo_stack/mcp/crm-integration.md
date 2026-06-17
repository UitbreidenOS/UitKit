# MCP: CRM Integration

## Purpose
Manage and query investor pipeline, interactions, and follow-up tasks via integrated CRM interface.

## Tools

### crm.log_interaction
Log investor meeting, call, or email interaction.
```
crm.log_interaction({
  investor_name: string,
  fund: string,
  interaction_type: 'call' | 'email' | 'meeting',
  sentiment: 'positive' | 'neutral' | 'negative',
  notes: string,
  next_step: string,
  next_contact_date: date
})
```

### crm.get_investor_profile
Retrieve full history and profile for investor.
```
crm.get_investor_profile(investor_name)
→ { name, fund, check_size, stage_focus, geography, last_contact, interaction_history }
```

### crm.list_pipeline
List investors by stage.
```
crm.list_pipeline({ stage: 'warm_lead' | 'pitched' | 'term_sheet', limit: 20 })
```

## Configuration
```json
{
  "mcpServers": {
    "crm": {
      "command": "crm-server",
      "args": ["--api-key=$CRM_API_KEY"],
      "type": "stdio"
    }
  }
}
```

## Notes
- Requires CRM account and API credentials
- Enables automated investor tracking and follow-up reminders
- Integrates with weekly-digest and investor-outreach hooks

---
**Last Updated:** June 2026
