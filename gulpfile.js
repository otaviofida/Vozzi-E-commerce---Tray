const { src, dest, watch, series } = require("gulp");

// SCSS
const sass = require("gulp-sass")(require("sass"));
const cleanCSS = require("gulp-clean-css");
const autoprefixer = require("gulp-autoprefixer").default;

// JS
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");

// Utils
const rename = require("gulp-rename");

/**
 * SCSS → theme.min.css
 */
function styles() {
  return src("scss/main.scss")
    .pipe(
      sass({
        outputStyle: "expanded",
      }).on("error", sass.logError)
    )
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 2 versions"],
        cascade: false,
      })
    )
    .pipe(cleanCSS())
    .pipe(
      rename({
        basename: "theme",
        suffix: ".min",
      })
    )
    .pipe(dest("theme/css"));
}

/**
 * JS → theme.main.js
 */
function scripts() {
  return src("js/**/*.js")
    .pipe(concat("theme.min.js"))
    .pipe(uglify())
    .pipe(dest("theme/js"));
}

/**
 * Watch
 */
function watchFiles() {
  watch("scss/**/*.scss", styles);
  watch("js/**/*.js", scripts);
}

exports.build = series(styles, scripts);
exports.default = series(styles, scripts, watchFiles);
