var args = require('yargs').argv,
  path = require('path'),
  gulp = require('gulp'),
  $ = require('gulp-load-plugins')(),
  gulpsync = $.sync(gulp),
  browserSync = require('browser-sync'),
  reload = browserSync.reload,
  del = require('del'),
  karmaServer = require('karma').Server,
  protractor = $.protractor.protractor,
  webdriver = $.protractor.webdriver,
  express = require('express');

// 生产环节模式
var isProduction = false;
// 是否用map映射关系
var useSourceMaps = false;

// 切换为sass模式.
// 例子:
//    gulp --usesass
var useSass = false;

// 插件配置
var vendor = {
  // 核心框架
  base: {
      source: require('./vendor.base.json'),
      js: 'base.js',
      css: 'base.css'
  },
  // 第三方插件
  app: {
      source: require('./vendor.json'),
      dest: '../vendor'
  }
};

// 主要的目录配置
var paths = {
  app: '../app/',
  styles: 'less/',
  scripts: 'js/',
}

// 来源信息
var source = {
  scripts: [paths.scripts + '*.*'],
  styles: {
      app: [paths.styles + '*.*'],
      watch: [paths.styles + '**/*']
  }
};

// 生产环境目录配置
var build = {
  scripts: paths.app + 'js',
  styles: paths.app + 'css'
};

var cssnanoOpts = {
  safe: true,
  discardUnused: false, // no remove @font-face
  reduceIdents: false // no change on @keyframes names
}

// 核心框架构建
gulp.task('vendor:base', function() {
  log('打包核心框架base.js');

  var jsFilter = $.filter('**/*.js', {
      restore: true
  });
  var cssFilter = $.filter('**/*.css', {
      restore: true
  });

  return gulp.src(vendor.base.source)
      .pipe($.expectFile(vendor.base.source))
      .pipe(jsFilter)
          .pipe($.concat(vendor.base.js))
          .pipe($.if(isProduction, $.uglify()))
          .pipe(gulp.dest(build.scripts))
      .pipe(jsFilter.restore)
      .pipe(cssFilter)
          .pipe($.concat(vendor.base.css))
          .pipe($.if(isProduction, $.cssnano(cssnanoOpts)))
          .pipe(gulp.dest(build.styles))
      .pipe(cssFilter.restore)
      ;
});

// app.js
gulp.task('scripts:app', function() {
  log('打包合并app.js');
  // Minify and copy all JavaScript (except vendor scripts)
  return gulp.src(source.scripts)
      .pipe($.jsvalidate())
      .on('error', handleError)
      .pipe($.if(useSourceMaps, $.sourcemaps.init()))
      .pipe($.concat('app.js'))
      .pipe($.ngAnnotate())
      .on('error', handleError)
      .pipe($.if(isProduction, $.uglify({
          preserveComments: 'some'
      })))
      .on('error', handleError)
      .pipe($.if(useSourceMaps, $.sourcemaps.write()))
      .pipe(gulp.dest(build.scripts))
      .pipe(reload({
          stream: true
      }));
});

// APP LESS
gulp.task('styles:app', function() {
  log('开始打包合并app.css');
  return gulp.src(source.styles.app)
      .pipe($.if(useSourceMaps, $.sourcemaps.init()))
      .pipe(useSass ? $.sass() : $.less())
      .on('error', handleError)
      .pipe($.if(isProduction, $.cssnano(cssnanoOpts)))
      .pipe($.if(useSourceMaps, $.sourcemaps.write()))
      .pipe(gulp.dest(build.styles))
      .pipe(reload({
          stream: true
      }));
});

//---------------
// 实时刷新
//---------------
gulp.task('watch',function(){
  log('监听原代码改动情况');
  gulp.watch(source.scripts,['scripts:app']);
  gulp.watch(source.styles.watch, ['styles:app']);

});

gulp.task('browsersync', function () {
  log('开启浏览器同步刷新');

  browserSync({
    notify: false,
    port: 3010,
    server: {
      baseDir: '..'
    }
  });
});

//开始服务器
gulp.task('serve',gulpsync.sync([
  'default',
  'browsersync'
]),done);

//默认任务就是开启监听器
gulp.task('default',gulpsync.sync([
  'watch'
]));

/////////////////////

function done() {
  log('************');
  log('* 环境已经启动成功..');
  log('************');
}

// 日志
function log(msg) {
  $.util.log($.util.colors.blue(msg));
}

// 错误处理
function handleError(err) {
  log(err.toString());
  this.emit('end');
}
