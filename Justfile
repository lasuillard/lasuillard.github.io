_default:
    just --list

# Install deps and tools
install:
    npm install
    npm exec -- playwright install --with-deps chromium

# Update deps and tools
update:
    npm update
    pre-commit autoupdate

alias up := update

# =============================================================================
# Development
# =============================================================================

# Run all checks
ci: (format "yes") lint test e2e

# Autoformat code
[arg("check", long="check", value="yes")]
format check="no":
    npm run {{ if check == "yes" { "fmt:check" } else { "fmt" } }}

alias fmt := format

# Run all linters
lint:
    npm run lint
    npm run check

# Run all tests
test:
    npm run test -- --update

# Run end-to-end tests
e2e:
    npm run build
    PLAYWRIGHT_HTML_OPEN='on-failure' npm run e2e -- --update-snapshots

# Apply autofixes
fix:
    npm run lint:fix
    npm run fmt

# Build extension
build:
    npm run build

# Run development server
run:
    npm run dev

# Preview the website
preview:
    npm run build
    npm run preview

alias pre := preview

# =============================================================================
# Utility
# =============================================================================

# Remove temporary files
clean:
    rm --recursive --force \
        coverage/ \
        junit.xml \
        .svelte-kit/ \
        build/ \
        .tmp/ \
        playwright-report/
    find . -path '*.log*' -delete
