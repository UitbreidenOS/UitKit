#!/bin/bash

set -euo pipefail

################################################################################
# install-cursor.sh — Install Claudient skills and rules into a Cursor project
#
# Usage:
#   ./install-cursor.sh [target_dir] [--dry-run]
#   target_dir defaults to current directory
#   --dry-run shows what would be installed without doing it
################################################################################

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
TARGET_DIR="${1:-.}"
DRY_RUN=false
SKILL_COUNT=0
RULE_COUNT=0

# Parse optional flags
for arg in "$@"; do
  case "$arg" in
    --dry-run)
      DRY_RUN=true
      ;;
  esac
done

################################################################################
# find_claudient_dir — Locate the Claudient installation
################################################################################
find_claudient_dir() {
  # If this script is being run from the Claudient repo itself
  if [[ -d "$(dirname "$0")/../skills" ]]; then
    echo "$(cd "$(dirname "$0")/.." && pwd)"
    return 0
  fi

  # Check common installation locations
  local locations=(
    "$HOME/.claudient"
    "$HOME/node_modules/claudient"
    "$PWD/node_modules/claudient"
  )

  for loc in "${locations[@]}"; do
    if [[ -d "$loc/skills" ]]; then
      echo "$loc"
      return 0
    fi
  done

  return 1
}

################################################################################
# error — Print error message and exit
################################################################################
error() {
  printf "%bERROR: %s%b\n" "$RED" "$1" "$NC" >&2
  exit 1
}

################################################################################
# info — Print info message
################################################################################
info() {
  printf "%b%s%b\n" "$BLUE" "$1" "$NC"
}

################################################################################
# success — Print success message
################################################################################
success() {
  printf "%b%s%b\n" "$GREEN" "$1" "$NC"
}

################################################################################
# warning — Print warning message
################################################################################
warning() {
  printf "%b%s%b\n" "$YELLOW" "$1" "$NC"
}

################################################################################
# validate_target_dir — Check target directory validity
################################################################################
validate_target_dir() {
  if [[ ! -d "$TARGET_DIR" ]]; then
    error "Target directory does not exist: $TARGET_DIR"
  fi

  # Normalize path
  TARGET_DIR="$(cd "$TARGET_DIR" && pwd)"
}

################################################################################
# create_cursor_dirs — Ensure .cursor/rules directory exists
################################################################################
create_cursor_dirs() {
  local cursor_rules_dir="$TARGET_DIR/.cursor/rules"

  if [[ "$DRY_RUN" == true ]]; then
    info "[DRY-RUN] Would create directory: $cursor_rules_dir"
    return 0
  fi

  if [[ ! -d "$cursor_rules_dir" ]]; then
    mkdir -p "$cursor_rules_dir" || error "Failed to create $cursor_rules_dir"
    success "Created directory: $cursor_rules_dir"
  fi
}

################################################################################
# copy_skills — Copy skills from Claudient skills/ directory
################################################################################
copy_skills() {
  local CLAUDIENT_DIR="$1"
  local SKILLS_DIR="$CLAUDIENT_DIR/skills"
  local CURSOR_RULES_DIR="$TARGET_DIR/.cursor/rules"

  if [[ ! -d "$SKILLS_DIR" ]]; then
    warning "Skills directory not found: $SKILLS_DIR"
    return 1
  fi

  info "Scanning skills directory..."

  # Find all .md files in skills/, organized by category subdirectory
  while IFS= read -r filepath; do
    # Extract category (first subdirectory under skills/)
    local relative="${filepath#$SKILLS_DIR/}"
    local category="${relative%%/*}"
    local filename="$(basename "$filepath")"

    # Skip non-.md files and path with spaces in category (translation dirs)
    if [[ "$category" == "fr" || "$category" == "de" || "$category" == "es" || "$category" == "nl" ]]; then
      continue
    fi

    # Create prefixed filename: skill-category--skillname.md
    local target_filename="skill-${category}--${filename}"
    local target_path="$CURSOR_RULES_DIR/$target_filename"

    if [[ "$DRY_RUN" == true ]]; then
      info "[DRY-RUN] Would copy: skills/$category/$filename → .cursor/rules/$target_filename"
    else
      cp "$filepath" "$target_path" || error "Failed to copy $filepath"
      success "Copied: .cursor/rules/$target_filename"
    fi

    ((SKILL_COUNT++))
  done < <(find "$SKILLS_DIR" -maxdepth 2 -type f -name "*.md" ! -path "*/fr/*" ! -path "*/de/*" ! -path "*/es/*" ! -path "*/nl/*")
}

################################################################################
# copy_rules — Copy rules from rules/common and rules/language-specific
################################################################################
copy_rules() {
  local CLAUDIENT_DIR="$1"
  local RULES_DIR="$CLAUDIENT_DIR/rules"
  local CURSOR_RULES_DIR="$TARGET_DIR/.cursor/rules"

  if [[ ! -d "$RULES_DIR" ]]; then
    warning "Rules directory not found: $RULES_DIR"
    return 1
  fi

  info "Scanning rules directory..."

  # Copy from rules/common/
  local common_dir="$RULES_DIR/common"
  if [[ -d "$common_dir" ]]; then
    while IFS= read -r filepath; do
      local filename="$(basename "$filepath")"
      local target_filename="rule-common--${filename}"
      local target_path="$CURSOR_RULES_DIR/$target_filename"

      if [[ "$DRY_RUN" == true ]]; then
        info "[DRY-RUN] Would copy: rules/common/$filename → .cursor/rules/$target_filename"
      else
        cp "$filepath" "$target_path" || error "Failed to copy $filepath"
        success "Copied: .cursor/rules/$target_filename"
      fi

      ((RULE_COUNT++))
    done < <(find "$common_dir" -maxdepth 1 -type f -name "*.md")
  fi

  # Copy from rules/language-specific/
  local lang_dir="$RULES_DIR/language-specific"
  if [[ -d "$lang_dir" ]]; then
    while IFS= read -r filepath; do
      local filename="$(basename "$filepath")"
      local target_filename="rule-language--${filename}"
      local target_path="$CURSOR_RULES_DIR/$target_filename"

      if [[ "$DRY_RUN" == true ]]; then
        info "[DRY-RUN] Would copy: rules/language-specific/$filename → .cursor/rules/$target_filename"
      else
        cp "$filepath" "$target_path" || error "Failed to copy $filepath"
        success "Copied: .cursor/rules/$target_filename"
      fi

      ((RULE_COUNT++))
    done < <(find "$lang_dir" -maxdepth 1 -type f -name "*.md")
  fi
}

################################################################################
# print_summary — Print installation summary
################################################################################
print_summary() {
  printf "\n"
  printf "%b========================================%b\n" "$BLUE" "$NC"
  printf "%b  Installation Summary%b\n" "$BLUE" "$NC"
  printf "%b========================================%b\n" "$BLUE" "$NC"

  if [[ "$DRY_RUN" == true ]]; then
    printf "%b[DRY-RUN]%b\n" "$YELLOW" "$NC"
  fi

  printf "Target directory:  %s\n" "$TARGET_DIR"
  printf "Rules directory:   .cursor/rules/\n"
  printf "\nContent copied:\n"
  printf "  • Skills:        %d files\n" "$SKILL_COUNT"
  printf "  • Rules:         %d files\n" "$RULE_COUNT"
  printf "  • Total:         %d files\n" "$((SKILL_COUNT + RULE_COUNT))"

  if [[ "$DRY_RUN" == false ]] && [[ $((SKILL_COUNT + RULE_COUNT)) -gt 0 ]]; then
    printf "\n%bNext steps:%b\n" "$GREEN" "$NC"
    printf "  1. Review files in %s/.cursor/rules/\n" "$TARGET_DIR"
    printf "  2. Commit to your Cursor project\n"
    printf "  3. Restart Cursor for rules to take effect\n"
  fi

  printf "\n"
}

################################################################################
# Main script execution
################################################################################
main() {
  info "Claudient → Cursor Installer v1.0"
  printf "\n"

  # Validate target directory
  validate_target_dir

  # Find Claudient installation
  CLAUDIENT_DIR=""
  if ! CLAUDIENT_DIR=$(find_claudient_dir); then
    error "Could not locate Claudient installation. Install via: npm install claudient"
  fi

  info "Found Claudient at: $CLAUDIENT_DIR"
  printf "\n"

  # Create cursor directories
  create_cursor_dirs

  # Copy skills and rules
  copy_skills "$CLAUDIENT_DIR" || warning "No skills were copied"
  copy_rules "$CLAUDIENT_DIR" || warning "No rules were copied"

  # Print summary
  print_summary

  if [[ "$DRY_RUN" == false ]]; then
    if [[ $((SKILL_COUNT + RULE_COUNT)) -eq 0 ]]; then
      warning "No files were installed. Check your Claudient installation."
      exit 1
    fi
    success "Installation complete!"
  else
    success "[DRY-RUN] No files were modified"
  fi
}

main
