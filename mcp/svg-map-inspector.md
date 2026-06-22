# MCP: SVG Map Inspector

Inspect, query, and manipulate SVG map files directly from Claude Code. Parse geographic data, extract layer information, analyze coordinates, generate map queries, and programmatically modify SVG elements without leaving the terminal.

## Why you need this

Working with SVG maps typically requires external tools and manual inspection. With SVG Map Inspector MCP:
- Claude reads SVG structure and geographic metadata without opening a viewer
- Extract coordinate data, feature properties, and layer hierarchy programmatically
- Generate queries to find specific geographic regions, features, or intersections
- Validate map structure, coordinate systems, and spatial relationships
- Modify maps by updating styles, adding annotations, or filtering features
- Compare different map versions and detect structural changes

## Installation

```bash
npm install -g @mcp/svg-map-inspector
```

## Configuration

Add to `~/.claude.json` or project `.claude/mcp.json`:

```json
{
  "mcpServers": {
    "svg-map-inspector": {
      "command": "npx",
      "args": ["@mcp/svg-map-inspector"],
      "env": {
        "SVG_MAP_MAX_FILE_SIZE": "50",
        "SVG_MAP_CACHE_DIR": "/tmp/svg-map-cache"
      }
    }
  }
}
```

## Key tools

- `parse_svg_map` — load and parse an SVG file, return full DOM structure with all attributes
- `get_layers` — extract all layer groups, paths, and polygons with their properties and hierarchy
- `query_features` — search features by name, ID, class, or custom attributes
- `get_coordinates` — extract and normalize coordinate data from path elements, convert between formats (lat/lon, pixel, SVG units)
- `find_intersections` — identify overlapping or adjacent features based on bounding boxes and coordinate ranges
- `analyze_bounds` — calculate bounding box for individual features or the entire map
- `get_metadata` — extract SVG document metadata, viewBox, coordinate system info, and comments
- `validate_structure` — check map integrity, detect missing required attributes, validate coordinate formats
- `export_features` — convert features to GeoJSON, TopoJSON, or CSV formats
- `update_element` — modify SVG element attributes (colors, opacity, styles, custom properties)
- `filter_features` — create a new SVG containing only features matching specified criteria
- `add_annotations` — programmatically add text, markers, or highlights to the map

## Usage examples

```
Parse the map at maps/regions.svg and extract all administrative boundaries
as separate features with their coordinate ranges and properties.
```

```
Load the world map file and find all features that intersect or overlap
with the geographic bounding box [40.7°N, 74.0°W, 40.8°N, 73.9°W].
```

```
Validate the SVG map structure in data/survey-map.svg — check that all
paths have required ID attributes, coordinate formats are consistent,
and layers are properly nested.
```

```
Extract the city layer from the map, convert all features to GeoJSON,
and save the output so it can be imported into a web mapping library.
```

```
Compare two versions of the map (v1.svg and v2.svg) and list which
features were added, removed, or had properties changed.
```

```
Highlight all features with population > 100,000 by adding a red
stroke to the SVG and export the modified map.
```

```
Query all features in the "parks" layer that have area > 1000 square
units, then generate a summary report with coordinates and properties.
```

## Authentication

No API key required. The tool operates on local SVG files. For remote files:
- Use Playwright MCP to download and cache them first
- Or provide local file paths to pre-downloaded SVG assets

## Tips

**File size limits:** Large maps (>50 MB) may cause memory issues. Set `SVG_MAP_MAX_FILE_SIZE` to your needs or split large maps into tiles.

**Coordinate systems:** SVG maps can use different coordinate systems (pixel units, lat/lon, arbitrary scales). Always ask the tool to identify the coordinate system before performing geospatial calculations.

**Performance with complex maps:** For maps with thousands of features, use `filter_features` first to reduce the working set, then query the filtered subset.

**GeoJSON export:** Export features to GeoJSON when you need to feed them into mapping libraries like Leaflet, Mapbox, or OpenLayers without re-parsing.

**Batch modifications:** Chain `query_features`, `filter_features`, and `update_element` to apply bulk style or property changes across many features at once.

**Validation workflow:** Always run `validate_structure` on new map files before using them for analysis or modification — it catches missing coordinate data and structural inconsistencies early.

---
