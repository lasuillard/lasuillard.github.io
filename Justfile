_default:
    just --list

# Install deps and tools
install:
    yarn install
    yarn exec -- playwright install --with-deps chromium

# Update deps and tools
update:
    yarn upgrade
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
    yarn run {{ if check == "yes" { "fmt:check" } else { "fmt" } }}

alias fmt := format

# Run all linters
lint:
    yarn run lint
    yarn run check

# Run all tests
test:
    yarn run test

# Run end-to-end tests
e2e:
    yarn run build
    yarn run e2e --update-snapshots || (yarn exec playwright show-report && exit 1)

# Apply autofixes
fix:
    yarn run lint:fix
    yarn run fmt

# Build extension
build:
    yarn run build

# Run development server
run:
    yarn run dev

# Preview the website
preview:
    yarn run build
    yarn run preview

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
