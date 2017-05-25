// Base paths
var basePaths = {
	bower: './bower_components/',
	node: './node_modules/',
	dev: './src/'
};

// Auto reload Browser Sync if these files are changed
var browserSyncWatchFiles = [
	'./css/*.min.css',
	'./js/*.min.js',
	'./**/*.html'
];

// Browser sync options
var browserSyncOptions = {
	server: { baseDir: './' }
};

// Defining requirements
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var rename = require('gulp-rename');
var cssnano = require('gulp-cssnano');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var del = require('del');

//sass
gulp.task('sass', function () {
  var stream = gulp.src('./sass/*.scss')
	  .pipe(plumber())
	  .pipe(sass())
	  .pipe(gulp.dest('./css'))
	  .pipe(rename('style.css'))
  return stream;
});

//gulp watch
gulp.task('watch',function(){
	gulp.watch('./sass/**/*.scss', ['sass']);
	gulp.watch('./css/style.css',['cssnano']);
	gulp.watch([basePaths.dev + 'js/**/*.js','js/**/*.js','!js/scripts.js','!js/scripts.min.js'], ['scripts'])
});

//browser-sync
gulp.task('browser-sync', function() {
	browserSync.init(browserSyncWatchFiles,browserSyncOptions);
});

//watch + browsersync
gulp.task('watch-bs', ['browser-sync','watch','sass','cssnano','scripts'], function() { });

//minify css files
gulp.task('cssnano', function(){
	return gulp.src('./css/style.css')
	.pipe(sourcemaps.init({loadMaps: true}))
	.pipe(plumber())
	.pipe(rename({suffix: '.min'}))
	.pipe(cssnano({discardComments: {removeAll: true}}))
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest('./css/'))
});

//uglifies and concat all js into one file
gulp.task('scripts',function(){
	var scripts = [
		basePaths.dev + 'js/bootstrap4/bootstrap.js',
		basePaths.dev + 'js/custom.js'
	];
	gulp.src(scripts)
	.pipe(concat('scripts.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('./js/'));

	gulp.src(scripts)
	.pipe(concat('scripts.js'))
	.pipe(gulp.dest('./js/'))
});

// Deleting any file inside the /src folder
gulp.task('clean-source', function () {
  return del(['src/**/*',]);
});

//copy assets from node and bower
gulp.task('copy-assets', ['clean-source'], function() {
	//copy bootstrap js files
	var stream = gulp.src(basePaths.bower + 'bootstrap/dist/js/**/*.js')
	.pipe(gulp.dest(basePaths.dev + '/js/bootstrap4'));

	//copy bootstrap scss files
	gulp.src(basePaths.bower + 'bootstrap/scss/**/*.scss')
	.pipe(gulp.dest(basePaths.dev + '/sass/bootstrap4'));

	//copy fontawesome fonts
	gulp.src(basePaths.node + 'font-awesome/fonts/**/*.{ttf,woff,woff2,eof,svg}')
	.pipe(gulp.dest('./fonts'));

	//copy fontawesome scss
	gulp.src(basePaths.node + 'font-awesome/scss/*.scss')
	.pipe(gulp.dest(basePaths.dev + '/sass/fontawesome'));

	//copy jquery
	gulp.src(basePaths.node + 'jquery/dist/*.js')
	.pipe(gulp.dest(basePaths.dev + '/js'));
});