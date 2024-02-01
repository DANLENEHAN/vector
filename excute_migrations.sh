#!/bin/bash
set -e

# Define paths
GRAU_PATH="../grau"
API_DOCS_PATH="$GRAU_PATH/docs/swagger.json"
API_OUTPUT_PATH="./src/services/api/swagger"
MIGRATIONS_PATH="./src/services/db"
VECTOR_REVISIONS_FILE="./src/services/db/VectorRevisions.ts"
ALEMBIC_PATH="$GRAU_PATH/alembic/versions/frontend"

# Check commands existence
type npx >/dev/null 2>&1 || { echo >&2 "npx is not installed. Aborting."; exit 1; }
type cp >/dev/null 2>&1 || { echo >&2 "cp is not installed. Aborting."; exit 1; }
type rm >/dev/null 2>&1 || { echo >&2 "rm is not installed. Aborting."; exit 1; }

generate_api() {
    echo "Starting API generation..."
    npx swagger-typescript-api -p $API_DOCS_PATH -o $API_OUTPUT_PATH --sort-types --sort-routes --enum-names-as-values --responses --axios --modular --single-http-client --debug && \
    echo "API generation completed successfully."
}

delete_current_migrations() {
    echo "Deleting current migrations..."
    rm -rf $MIGRATIONS_PATH/revisions/* && \
    if [ -f $VECTOR_REVISIONS_FILE ]; then
        rm $VECTOR_REVISIONS_FILE && \
        echo "VectorRevisions.ts file deleted."
    else
        echo "No VectorRevisions.ts file found."
    fi
    echo "Current migrations deleted successfully."
}

generate_new_migrations() {
    echo "Generating new migrations..."
    cp -r $ALEMBIC_PATH/revisions $MIGRATIONS_PATH && \
    cp $ALEMBIC_PATH/VectorRevisions.ts $VECTOR_REVISIONS_FILE && \
    echo "New migrations generated successfully."
}

run_precommits() {
    echo "Running PreCommits..."
    npx prettier --write $MIGRATIONS_PATH && \
    npx eslint --fix $MIGRATIONS_PATH && \
    npx prettier --write $API_OUTPUT_PATH && \
    npx eslint --fix $API_OUTPUT_PATH && \
    echo "PreCommits completed successfully."
}

# Execute functions
generate_api
delete_current_migrations
generate_new_migrations
run_precommits

echo "All operations completed successfully."