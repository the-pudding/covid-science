# Covid-Science

A look at 2020 through the lens of scientific collaboration and achievement.

## Getting started:

### Install libraries

`npm i`

### Set Mapbox token

1. Copy the token for your Mapbox account from www.mapbox.com

2. Create a `.env` file in the root directory of this repo.

3. In the `.env` file, create a new variable and paste your mapbox token like so

```
MAPBOX_TOKEN=asdfjassdjasfdjkldsfajasfjdsffdja
```

### Development

`npm run dev`

Open browser to `localhost:8080`

### Deploy
The site is hosted via github-pages in the repositories `docs` folder. To deploy and update to the site, run:

`sh deploy.sh`

This script will bundle the site using webpack, copy the resulting built site from the `dist` directory to the `docs` directory, and push a new update to github on the `dev` branch. 

## Project Info
