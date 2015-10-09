# Gulp Front End task generator

## Why?

Most projects define the same gulp tasks on every project - why not share those tasks instead?

With a minimal amount of configuration - most tasks can be reused in small or big projects.

## Quick start

install to project

```bash
npm install --save-dev "micnigh/gulp-frontend-tasks"
```

Generate some tasks

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

gulp.task("build:js", [
  "build:js:app",
]);

gulp.task("watch:js", [
  "watch:js:app",
]);
```

See examples for usage inside projects

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

### spritesheet:less

```javascript
gft.generateTask("spritesheet:less", {
  taskName: "app",
  src: "client/sprites/*.png",
  dest: distPath + "/css/",
  destFileName: "spritesheet_",
  lessSpriteFile: "client/css/src/shared/sprites.less",
  watch: [
    "client/sprites/*.png",
  ],
});
```

## TODO

- Add karma task
- Add scss task
- Organize dependencies
- Publish to NPM
- Come up with a better name
