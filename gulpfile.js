const gulp = require('gulp');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const reload = browserSync.reload;

gulp.task('css', () => {
  const postcss = require('gulp-postcss');
  const cssnano = require('gulp-cssnano');

  return gulp.src('app/styles/**/*.css')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(postcss([require('precss')(), require('autoprefixer')({ browsers: 'last 2 versions, > 5%' })]))
    .pipe(concat('styles.css'))
    .pipe(cssnano())
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('dist/styles/'))
    .pipe(reload({stream: true}));
});

gulp.task('scripts', () => {
  const minify = require('gulp-babel-minify');
  const rename = require('gulp-rename');

  gulp.src([
    'app/scripts/jquery-3.2.1.js',
    'app/scripts/scrollto.js',
    'app/scripts/waypoints.js',
    'app/scripts/relax.js',
    'app/scripts/main.js'])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat('temp.js'))
    .pipe(minify())
    .pipe(rename('app.min.js'))
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(reload({stream: true}));
});

gulp.task('html', () => {
  const htmlReplace = require('gulp-html-replace')
  gulp.src('app/**/*.html')
  .pipe(htmlReplace({
    'js': '<script src="scripts/app.min.js" defer></script>',
    'css': '<link rel="stylesheet" href="styles/styles.css">',
  }))
  .pipe(gulp.dest('dist'))
  .pipe(reload({stream: true}));
})

gulp.task('assets:cleanfolder', (cb) => {
  const del = require('del');
  return del([
    'dist/assets/**',
  ], cb)
})

gulp.task('assets:copy', ['assets:cleanfolder'], () => {
  return gulp.src(['app/assets/**/*', '!app/assets/psd/'])
    .pipe(gulp.dest('dist/assets'))
})

gulp.task('browser-sync', () => {
  browserSync ({
    server: {
      baseDir: './dist'
    }
  })
})

gulp.task('watch', () => {
  gulp.watch('app/scripts/**/*.js', ['scripts']);
  gulp.watch('app/styles/**/*css', ['css']);
  gulp.watch('app/**/*.html', ['html']);
  gulp.watch('app/assets/**/*', ['assets:copy'])
})

gulp.task('default', ['scripts', 'css', 'html', 'assets:copy', 'browser-sync', 'watch']);