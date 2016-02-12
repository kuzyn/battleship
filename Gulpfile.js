var gulp = require('gulp');
var browserSync = require('browser-sync');

// Proxy our app to make use of browserSync
gulp.task('browser-sync', function () {
  browserSync({
    proxy: 'http://localhost:3000/',
    port: 4000,
    browser: ['chromium-browser']
  });
});

//////////////////////////////////////
// Simple tasks to update our views //
//////////////////////////////////////

gulp.task('js',  function () {
  return gulp.src('./public/**/*.js')
    .pipe(browserSync.reload());
});

gulp.task('css', function () {
  return gulp.src('./public/**/*.css')
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('jade', function () {
  browserSync.reload();
});

gulp.task('bs-reload-delay', function () {
  setTimeout(function () {
    browserSync.reload({ stream: false });
  }, 800);
});

///////////////////////
// Our default task  //
///////////////////////

gulp.task('default', ['browser-sync'], function () {
  gulp.watch('./public/**/*.js',   ['js']);
  gulp.watch('./public/**/*.css',  ['css']);
  gulp.watch('./views/**/*.jade', ['jade']);
  gulp.watch(['./routes/**/*.js', './bin/www', './app.js'], ['bs-reload-delay']);
});
