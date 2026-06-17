# Command: validate-data

Runs data quality checks on a dataset.

## Usage

```
/validate-data <table_name> [--schema] [--nulls] [--duplicates]
```

## Flags

- `--schema`: Validate column types
- `--nulls`: Check for unexpected nulls
- `--duplicates`: Check for duplicate rows

## Example

```
/validate-data orders --schema --nulls
```
