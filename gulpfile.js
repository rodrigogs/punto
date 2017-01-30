'use strict';

const gulp = require('gulp');
const Server = require('karma').Server;
const pkg = require('./package.json');
const plugins = require('gulp-load-plugins')();
const runSequence = require('run-sequence');
const del = require('del');
const stylish = require('jshint-stylish');

const jsdocConfig = require('./jsdoc-config.json');

const mainFiles = [
  'Punto.js'
];

gulp.task('init', () => {
  return plugins.bower();
});

gulp.task('build', done => {
  return runSequence('clean', 'build-raw', 'build-min', done);
});

gulp.task('build-raw', () => {
  return gulp.src(mainFiles)
    .pipe(plugins.concat('Punto.js'))
    .pipe(banner())
    .pipe(plugins.stripDebug())
    .pipe(gulp.dest('build'));
});

gulp.task('build-min', () => {
  return gulp.src(mainFiles)
    .pipe(plugins.uglify({
      preserveComments: 'some'
    }))
    .pipe(plugins.concat('Punto-min.js'))
    .pipe(plugins.stripDebug())
    .pipe(gulp.dest('build'));
});

gulp.task('clean', done => {
  del(['build']).then(() => {
    done();
  });
});

gulp.task('docs', cb => {
  gulp.src(['README.md', './*.js'], {read: false})
    .pipe(plugins.jsdoc3(jsdocConfig, cb));
});

gulp.task('format', () => {
  return gulp.src(['./*.js'])
    .pipe(plugins.esformatter())
    .pipe(gulp.dest('.'));
});

gulp.task('lint', () => {
  return gulp.src(['./*.js'])
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter(stylish))
    .pipe(plugins.jshint.reporter('fail'));
});

gulp.task('watch', ['build'], () => {
  gulp.watch(['./*.js'], ['build']);
});

gulp.task('test', done => {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }).start(done);
});

gulp.task('test-watch', done => {
  new Server({
    configFile: __dirname + '/karma.conf.js'
  }).start(done);
});

// Private helpers
// ===============

function banner() {
  let stamp = [
    '/**',
    ' * Punto.js - <%= pkg.description %>',
    ' * @author <%= pkg.author.name %> <<%= pkg.author.email %>>',
    ' * @version v<%= pkg.version %>',
    ' * @link https://github.com/Punto',
    ' * @license BSD-2-Clause',
    ' */',
    ''
  ].join('\n');

  return plugins.header(stamp, {
    pkg: pkg
  });
}
