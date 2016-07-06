import gulp from 'gulp';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import eslint from 'gulp-eslint';
import exorcist from 'exorcist';
import browserSync from 'browser-sync';
import watchify from 'watchify';
import babelify from 'babelify';
import uglify from 'gulp-uglify';
import ifElse from 'gulp-if-else';

const sync = browserSync.create();

// Input file is src/app.js
// watchify: Update any source file and your browserify bundle will be recompiled on the spot.
watchify.args.debug = true;
var bundler = browserify('src/app.js', watchify.args);

// Babel transform
bundler.transform(babelify.configure({
  sourceMapRelative: 'src'
}));

//bundle.js.map (source map?) is needed so that in debugging you see which src file causes the error.
// the alternative is to have a huge bundle.js and try to debug that file -> not good.

// On updates recompile
bundler.on('update', bundle);

//the bundle function
function bundle(prod) {
  return bundler.bundle()
    .on('error', function(error){
      console.error( '\nError: ', error.message, '\n');
      this.emit('end');
    })
    .pipe(exorcist('public/assets/bundle.js.map'))
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(ifElse(prod, uglify))
    .pipe(gulp.dest('public/assets/'));
}

//default task is to transpile
gulp.task('default', ['transpile']);

//run lint task and then bundle
gulp.task('transpile', ['lint'], () => bundle(false));

// lint helps in finding bugs in compile stage, instead of finding them live on the browser.
// most useful when npm start is running so you see errors right after edits
// take the files defined in gulp.src, run eslint on them and output possible errors.
gulp.task('lint', () => {
    return gulp.src(['src/**/*.js', 'gulpfile.babel.js'])
      .pipe(eslint())
      .pipe(eslint.format());
});

//use proxy if there is another server (such as a Rails server running at localhost:3000)
//apparently BrowserSync will run on another port, like 3001.
// after transpile, initialize browsersync
gulp.task('serve', ['transpile'], () => sync.init({ proxy: 'http://localhost:3000', logLevel: "debug"}));

// after transpile, reload the browser
gulp.task('js-watch', ['transpile'], () => sync.reload());

// after serve, do the following:
// run js-watch if any source files change
// reload if public/styles changes or public/index.html changes
gulp.task('watch', ['serve'], () => {
  gulp.watch('src/**/*', ['js-watch']);
  gulp.watch('public/styles/*', sync.reload);
  gulp.watch('public/index.html', sync.reload);
});

//in prod, only bundle
gulp.task('production-build', () => bundle(true));
