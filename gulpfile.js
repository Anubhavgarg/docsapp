var gulp = require('gulp');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var nodemon = require('gulp-nodemon');

var runTimestamp = Math.round(Date.now() / 1000);

gulp.task('default', function (done) {
    done();
});

gulp.task('serve',function(done) {
    runSequence('default', 'nodemon', function() {
        done();
    });
});

gulp.task('nodemon', function (cb) {

    var started = false;

    return nodemon({
        script: './bin/www',
        exec: 'node --inspect --debug=5735'
    }).on('start', function () {
        // to avoid nodemon being started multiple times
        // thanks @matthisk
        if (!started) {
            cb();
            started = true;
        }
    });
});

function onError(err) {
    gutil.log(err);
    this.emit('end');
}