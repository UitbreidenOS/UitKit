# Command: lineage-trace

Traces data lineage from source to final output.

## Usage

```
/lineage-trace <table_name> [--depth N] [--direction upstream|downstream]
```

## Options

- `--depth`: Recursion depth (default: 3)
- `--direction`: upstream or downstream (default: upstream)

## Example

```
/lineage-trace fact_sales --direction downstream --depth 2
```
