# remove existing dist/docs folders
rm -rf dist
rm -rf docs

# bundle
npm run build

# copy to docs folder
cp -r dist/ docs

# push to github
git add *
git commit -m "deployed"
git push origin dev