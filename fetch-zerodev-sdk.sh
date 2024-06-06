# fetch_subdirectory.sh
REPO_URL="https://github.com/bleapapp/zerodev-sdk.git"
BLEAP_MAIN_BRANCH="bleap-main"
TEMP_FILE="temporary-folder-to-delete"
TARGET_DIR="external-dep/zerodev-sdk"

# Remove existing target directory if it exists
rm -rf $TARGET_DIR
rm -rf $TEMP_FILE

# Clone the repository
git clone -b $BLEAP_MAIN_BRANCH $REPO_URL $TEMP_FILE

# Yan install & build
cd $TEMP_FILE || exit && yarn install && yarn build

# Move all files to node_modules/
cd .. && mkdir -p $TARGET_DIR/ && mv $TEMP_FILE/* $TARGET_DIR/

# Clean up
rm -rf $TEMP_FILE

# Install the dependency
yarn install --check-files

# Delete node_modules of external-app
#rm -r -f external-dep/zerodev-sdk/node_modules
