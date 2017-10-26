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
var useSass = args.usesass;

// 主要的目录配置
var paths = {
  app: '../app/',
  markup: 'jade/',
  styles: 'less/',
  scripts: 'js/',
  cache: 'templates/'
}

if (useSass) {
  log('切换到sass模式');
  paths.styles = 'sass/';
}

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

// 来源信息
var source = {
  scripts: [paths.scripts + 'config.js', paths.scripts + 'init.js',
  // 核心模块
  paths.scripts + 'core/*.module.js',
  paths.scripts + 'core/**/*.js',
  paths.scripts + 'lazyload/*.module.js',
  paths.scripts + 'lazyload/**/*.js',
  paths.scripts + 'routes/*.module.js',
  paths.scripts + 'routes/**/*.js'
  ],
  templates: {
    jade: [paths.markup + '**/*.*'],
    cache: [paths.cache + '**/*.*']
  },
  styles: {
    app: [paths.styles + '*.*'],
    themes: [paths.styles + 'themes/*'],
    watch: [paths.styles + '**/*',
    '!' + paths.styles + 'frame/*',
    '!' + paths.styles + 'themes/*']
  }
};

// 生产环境目录配置
var build = {
  scripts: paths.app + 'js',
  styles: paths.app + 'css',
  templates: {
    jade: paths.app
  }
};

// 打包工具配置
var prettifyOpts = {
  indent_char: ' ',
  indent_size: 3,
  unformatted: ['a', 'sub', 'sup', 'b', 'i', 'u', 'pre', 'code']
};

var vendorUglifyOpts = {
  mangle: {
    except: ['$super'] // rickshaw requires this
  }
};

var tplCacheOptions = {
  root: 'gou',
  filename: 'templates.js',
  //standalone: true,
  module: 'app.core'
};

var injectOptions = {
  name: 'templates',
  transform: function (filepath) {
    return 'script(src=\'' +
      filepath.substr(filepath.indexOf('app')) +
      '\')';
  }
}

var cssnanoOpts = {
  safe: true,
  discardUnused: false, // no remove @font-face
  reduceIdents: false // no change on @keyframes names
}

// app.js
gulp.task('scripts:app', function () {
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

// 核心框架构建
gulp.task('vendor:base', function () {
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

// APP LESS
gulp.task('styles:app', function () {
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

// 视图文件
gulp.task('templates:jade', function () {
  log('生成视图文件.. ');

  return gulp.src(source.templates.jade)
    .pipe($.if(!isProduction, $.changed(build.templates.jade, {
      extension: '.html'
    })))
    .pipe($.pug())
    .on('error', handleError)
    .pipe($.htmlPrettify(prettifyOpts))
    .pipe(gulp.dest(build.templates.jade))
    .pipe(reload({
      stream: true
    }));
});

// 需要缓存的模板文件
gulp.task('templates:cache', function () {
  log('缓存模板页面..');

  return gulp.src(source.templates.cache)
    .pipe($.angularTemplatecache(tplCacheOptions))
    .pipe($.if(isProduction, $.uglify()))
    .pipe(gulp.dest(build.scripts))
    .pipe(reload({
      stream: true
    }));
});

//---------------
// 实时刷新
//---------------
gulp.task('watch', function () {
  log('监听原代码改动情况');
  gulp.watch(source.scripts, ['scripts:app']);
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
gulp.task('serve', gulpsync.sync([
  'default',
  'browsersync'
]), done);

//默认任务就是开启监听器
gulp.task('default', gulpsync.sync([
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
