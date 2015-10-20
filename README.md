# gulp-front-end-tasks

A collection of common front end gulp tasks.

## Install

```bash
npm install --save-dev "micnigh/gulp-frontend-tasks"
```

## Usage

`gulpfile.js`
```javascript
var gulp = require("gulp");
var gft = require("gulp-frontend-tasks")(gulp);

var libs = [
  "underscore",
  "es5-shim/es5-shim",
  "es5-shim/es5-sham",
];

// generate `build:js:app` and `watch:js:app` tasks
// all `.js` files in `client/js/src/` will be added
// as an entry subtask to `build:js:app`
// assume `libs` are added somewhere else on the page
gft.generateTask("js", {
  taskName: "app",
  entries: [
    "client/js/src/*.js",
  ],
  dest: distPath + "/js/",
  includes: [
    "client/js",
  ],
  browserify: {
    externals: libs,
  },
  watch: [
    "client/js/src/*.js",
  ],
});

// once generated, we can refer to them like normal gulp tasks
gulp.task("build:js", [
  "build:js:app",
]);

gulp.task("watch:js", [
  "watch:js:app",
]);
```

See examples projects for complete gulp scripts

## Why?

Most projects define the same gulp tasks on every project - why not share those tasks instead?

With a minimal amount of configuration most tasks can be reused for small or big projects.

## Example projects

[boilerplate-gulp-generic](https://github.com/micnigh/boilerplate-gulp-generic)

[yet-another-isomorphic-blog](https://github.com/micnigh/yet-another-isomorphic-blog)

## API Examples

### js

```javascript

var libs = [
  "underscore",
  "es5-shim/es5-shim",
  "es5-shim/es5-sham",
];

gft.generateTask("js", {
  taskName: "lib",
  entries: [
    "client/js/libs/entry.js",
  ],
  includes: [
    "client/js/libs",
  ],
  dest: distPath + "/js/",
  destFileName: "lib.js",
  browserify: {
    requires: libs,
  },
  watch: [
    "client/js/libs/entry.js",
  ],
});

gft.generateTask("js", {
  taskName: "app",
  entries: [
    "client/js/src/*.js",
  ],
  dest: distPath + "/js/",
  includes: [
    "client/js",
  ],
  browserify: {
    externals: libs,
  },
  watch: [
    "client/js/src/*.js",
  ],
  // reload browsersync instance after each build
  // browsersync: browsersyncInstance,
});
```

### css:scss

```javascript
gft.generateTask("css:scss", {
  taskName: "app",
  entries: [
    "client/css/src/*.scss",
  ],
  includes: [
    "client/css/src/",
    "node_modules/",
  ],
  dest: distPath + "/css/",
  watch: [
    "client/css/src/**/*.scss",
    "!client/css/src/shared/sprites.*",
  ],
  dependsOn: [
    "build:spritesheet:app",
  ],
  // reload browsersync instance after each build
  // browsersync: browsersyncInstance,
});
```

### css:less

```javascript
gft.generateTask("css:less", {
  taskName: "app",
  entries: [
    "client/css/src/*.less",
  ],
  includes: [
    "client/css/src/",
    "node_modules/",
  ],
  dest: distPath + "/css/",
  watch: [
    "client/css/src/**/*.less",
    "!client/css/src/shared/sprites.less",
  ],
  // add a task dependency
  dependsOn: [
    "build:spritesheet:less:app",
  ],
  // reload browsersync instance after each build
  // browsersync: browsersyncInstance,
});
```

### spritesheet

```javascript
gft.generateTask("spritesheet", {
  taskName: "app",
  src: "client/sprites/*.png",
  dest: distPath + "/css/",
  destFileName: "spritesheet_",
  spriteCSSFile: "client/css/src/shared/sprites.scss",
  buildCSSTask: "build:css:scss:app",
  watch: [
    "client/sprites/*.png",
  ],
});
```

## TODO

- Come up with a better name
- Publish to NPM
