let gulp = require("gulp");
let sass = require("gulp-sass");
let concat = require("gulp-concat");
let cleanCSS = require("gulp-clean-css");
let gls = require("gulp-live-server");

gulp.task("sass", function() {
  gulp
    .src("sass/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("./css/"));
});

gulp.task("minify-css", () => {
  return gulp
    .src("css/**/*.css")
    .pipe(
      cleanCSS({ debug: true }, details => {
        console.log(`${details.name}: ${details.stats.originalSize}`);
        console.log(`${details.name}: ${details.stats.minifiedSize}`);
      })
    )
    .pipe(concat("dist/min.css"))
    .pipe(gulp.dest("./"));
});

//Watch task
gulp.task("default", function() {
  gulp.watch("sass/**/*.scss", ["sass"]);
  gulp.watch("css/**/*.css", ["minify-css"]);
});

gulp.task("serve", function() {
  //1. serve with default settings
  var server = gls.static(["dist"], process.env.PORT || 3000); //equals to gls.static('public', 3000);
  server.start();

  //use gulp.watch to trigger server actions(notify, start or stop)
  gulp.watch("sass/**/*.scss", ["sass"], function(file) {
    server.notify.apply(server, [file]);
  });
  gulp.watch("css/**/*.css", ["minify-css"], function(file) {
    server.notify.apply(server, [file]);
  });
});
