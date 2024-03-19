#!/bin/bash
set -e

# Define paths
GRAU_PATH="../grau"
API_DOCS_PATH="$GRAU_PATH/docs/swagger.json"
API_OUTPUT_PATH="./src/services/api/swagger"
MIGRATIONS_PATH="./src/services/db/alembic"
VECTOR_REVISIONS_FILE="./src/services/db/alembic/VectorRevisions.ts"
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

delete_vector_revisions_file() {
    echo "Deleting VectorRevisions.ts file..."
    rm -f $VECTOR_REVISIONS_FILE && \
    echo "VectorRevisions.ts file deleted."
}

copy_new_migrations_only() {
    echo "Copying new migrations..."
    mkdir -p $MIGRATIONS_PATH/revisions
    for file in $ALEMBIC_PATH/revisions/*; do
        filename=$(basename "$file")
        if [ ! -f "$MIGRATIONS_PATH/revisions/$filename" ]; then
            cp "$file" "$MIGRATIONS_PATH/revisions/"
            echo "Copied new file: $filename"
        else
            echo "File already exists, skipping: $filename"
        fi
    done
    echo "New migrations copied successfully."
}

copy_vector_revisions() {
    echo "Copying VectorRevisions.ts..."
    cp $ALEMBIC_PATH/VectorRevisions.ts $VECTOR_REVISIONS_FILE && \
    echo "VectorRevisions.ts copied."
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
delete_vector_revisions_file
copy_new_migrations_only
copy_vector_revisions
run_precommits

echo "All operations completed successfully."
