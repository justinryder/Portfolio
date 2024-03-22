Portfolio
=========
My portfolio website, built using a custom build-time handlebars gulp templating task.

View it live at [justin-ryder.com](https://www.justin-ryder.com/)

Compiled output is committed to the repo at `app/` to easily compare before/after.

The gulp task will read all handlebars templates and find matching data in the json folder. Each json file feeds data into the handlebars templates to generate the resulting static html page.

## Building

Install dependencies with `npm i` then build the site with `npm run build`

## Serving the site

`npm serve` will start a local server on port 3000 that serves all files in the `app/` folder using the `forever` package to automatically restart if it crashes

`npm stop` will stop the server and `forever`
