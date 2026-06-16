# Figma-to-Code Bridge

## When to activate
Activate when the user provides a Figma URL and asks you to build a UI component. Invoked via `/figma-build`. Requires the Figma MCP server to be active.

## When NOT to use
Do not use if the user just provides an image. This requires actual JSON node data from Figma via MCP.

## Instructions
1. **Connect to Figma:** Use the `figma_get_file` or `figma_get_node` MCP tools to extract the design data for the provided URL.
2. **Analyze the Node Tree:** Read the JSON response carefully. Extract:
   - Layout structures (Auto Layout -> Flexbox).
   - Typography (Font families, weights, sizes).
   - Colors and Gradients.
   - Spacing (Padding, margins, gaps).
3. **Spawn the Builder:** You are the Orchestrator. Spawn the `frontend-engineer` agent. Pass it the extracted design tokens and instruct it to build a pixel-perfect React/Tailwind component.
4. **Verify:** Review the generated code. Ensure it perfectly matches the Figma layout properties.

## Example
User: `/figma-build Build this card: https://figma.com/file/...`
Claude: [Connects via MCP, extracts Auto Layout properties, spawns frontend-engineer]. The React component is ready and uses Tailwind Flexbox to match the Figma Auto Layout exactly.