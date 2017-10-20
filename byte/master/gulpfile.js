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

// angular模板js
// 例子:
//    gulp --usecache
var useCache = args.usecache;

// ignore everything that begins with underscore
var hidden_files = '**/_*.*';
var ignored_files = '!' + hidden_files;

// 主要的目录配置
var paths = {
    app: '../app/',
    markup: 'jade/',
    styles: 'less/',
    scripts: 'js/'
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
    scripts: [paths.scripts + 'config.js',paths.scripts + 'init.js',
        // 核心模块
        paths.scripts + 'core/*.module.js',
        paths.scripts + 'core/**/*.js',
        paths.scripts + 'lazyload/*.module.js',
        paths.scripts + 'lazyload/**/*.js',
        paths.scripts + 'routes/*.module.js',
        paths.scripts + 'routes/**/*.js',
        // 自定义模块
        paths.scripts + 'custom/**/*.module.js',
        paths.scripts + 'custom/**/*.js'
    ],
    templates: {
        index: [paths.markup + 'index.*'],
        views: [paths.markup + '**/*.*', '!' + paths.markup + 'index.*']
    },
    styles: {
        app: [paths.styles + '*.*'
        , '!' + paths.styles + 'frame.less'
        ],
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
        index: '../',
        views: paths.app,
        cache: paths.app + 'js/' + 'templates.js',
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
    root: 'app',
    filename: 'templates.js',
    //standalone: true,
    module: 'app.core',
    base: function(file) {
        return file.path.split('jade')[1];
    }
};

var injectOptions = {
    name: 'templates',
    transform: function(filepath) {
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
gulp.task('scripts:app', function() {
    log('打包合并app1.js');
    // Minify and copy all JavaScript (except vendor scripts)
    return gulp.src(source.scripts)
        .pipe($.jsvalidate())
        .on('error', handleError)
        .pipe($.if(useSourceMaps, $.sourcemaps.init()))
        .pipe($.concat('app1.js'))
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

// 插件任务
gulp.task('vendor', gulpsync.sync(['vendor:base', 'vendor:app']));

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

// 打包第三方插件
gulp.task('vendor:app', function() {
    log('打包第三方插件到vendor目录');

    var jsFilter = $.filter('**/*.js', {
        restore: true
    });
    var cssFilter = $.filter('**/*.css', {
        restore: true
    });

    return gulp.src(vendor.app.source, {
            base: 'bower_components'
        })
        .pipe($.expectFile(vendor.app.source))
        .pipe(jsFilter)
        .pipe($.if(isProduction, $.uglify(vendorUglifyOpts)))
        .pipe(jsFilter.restore)
        .pipe(cssFilter)
        .pipe($.if(isProduction, $.cssnano(cssnanoOpts)))
        .pipe(cssFilter.restore)
        .pipe(gulp.dest(vendor.app.dest));

});

// frame
gulp.task('frame', gulpsync.sync([
    'browsersync',
    'frame:watch'
]),done);
// frame 监听
gulp.task('frame:watch',function(){
    log('开启frame.less的监听');
    gulp.watch([paths.styles + 'frame/*'], ['frame:css']);
});

// frame项目只能修改less,js为一个文件不能修改
gulp.task('frame:css', function() {
    log('frame.css');
    return gulp.src([paths.styles + 'frame.less'])
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

// APP LESS
gulp.task('styles:app', function() {
    log('开始打包合并app1.css');
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

// APP RTL
gulp.task('styles:app:rtl', function() {
    log('Building application RTL styles..');
    return gulp.src(source.styles.app)
        .pipe($.if(useSourceMaps, $.sourcemaps.init()))
        .pipe(useSass ? $.sass() : $.less())
        .on('error', handleError)
        .pipe($.rtlcss()) /* RTL Magic ! */
        .pipe($.if(isProduction, $.cssnano(cssnanoOpts)))
        .pipe($.if(useSourceMaps, $.sourcemaps.write()))
        .pipe($.rename(function(path) {
            path.basename += "-rtl";
            return path;
        }))
        .pipe(gulp.dest(build.styles))
        .pipe(reload({
            stream: true
        }));
});

// LESS THEMES
gulp.task('styles:themes', function() {
    log('Building application theme styles..');
    return gulp.src(source.styles.themes)
        .pipe(useSass ? $.sass() : $.less())
        .on('error', handleError)
        .pipe(gulp.dest(build.styles))
        .pipe(reload({
            stream: true
        }));
});

// JADE
gulp.task('templates:index', ['templates:views'], function() {
    log('Building index..');

    var tplscript = gulp.src(build.templates.cache, {
        read: false
    });
    return gulp.src(source.templates.index)
        .pipe($.if(useCache, $.inject(tplscript, injectOptions))) // inject the templates.js into index
        .pipe($.pug())
        .on('error', handleError)
        .pipe($.htmlPrettify(prettifyOpts))
        .pipe(gulp.dest(build.templates.index))
        .pipe(reload({
            stream: true
        }));
});

// JADE
gulp.task('templates:views', function() {
    log('Building views.. ' + (useCache ? 'using cache' : ''));

    if (useCache) {

        return gulp.src(source.templates.views)
            .pipe($.pug())
            .on('error', handleError)
            .pipe($.angularTemplatecache(tplCacheOptions))
            .pipe($.if(isProduction, $.uglify({
                preserveComments: 'some'
            })))
            .pipe(gulp.dest(build.scripts))
            .pipe(reload({
                stream: true
            }));
    } else {

        return gulp.src(source.templates.views)
            .pipe($.if(!isProduction, $.changed(build.templates.views, {
                extension: '.html'
            })))
            .pipe($.pug())
            .on('error', handleError)
            .pipe($.htmlPrettify(prettifyOpts))
            .pipe(gulp.dest(build.templates.views))
            .pipe(reload({
                stream: true
            }));
    }
});

//---------------
// 实时刷新
//---------------
gulp.task('watch',function(){
    log('监听原代码改动情况');
    gulp.watch(source.scripts,['scripts:app']);
    gulp.watch(source.styles.watch, ['styles:app']);

});

gulp.task('browsersync',function(){
    log('开启浏览器同步刷新');

    browserSync({
        notify: false,
        port: 3010,
        server: {
            baseDir: '..'
        }
    });

});

// 效验 javascript
gulp.task('lint', function() {
    return gulp
        .src(source.scripts)
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', {
            verbose: true
        }))
        .pipe($.jshint.reporter('fail'));
});

// Remove all files from the build paths
gulp.task('clean', function(done) {
    var delconfig = [].concat(
        build.styles,
        build.scripts,
        build.templates.index + 'index.html',
        build.templates.views + 'views',
        build.templates.views + 'pages',
        vendor.app.dest
    );

    log('Cleaning: ' + $.util.colors.blue(delconfig));
    // force: clean files outside current directory
    del(delconfig, {
        force: true
    }).then(function() { done(); });
});

//---------------
// MAIN TASKS
//---------------

// build for production (minify)
gulp.task('build', gulpsync.sync([
    'prod',
    'vendor',
    'assets'
]));

gulp.task('prod', function() {
    log('Starting production build...');
    isProduction = true;
});

//开始服务器
gulp.task('serve',gulpsync.sync([
    'default',
    'browsersync'
]),done);

// Server for production
gulp.task('serve-prod', gulpsync.sync([
    'build',
    'browsersync'
]), done);

// build with sourcemaps (no minify)
gulp.task('sourcemaps', ['usesources', 'default']);
gulp.task('usesources', function() {
    useSourceMaps = true;
});

//默认任务就是开启监听器
gulp.task('default',gulpsync.sync([
    'watch'
]));

gulp.task('assets', [
    'scripts:app',
    'styles:app',
    'styles:app:rtl',
    'styles:themes',
    'templates:index',
    'templates:views'
]);

/// 开启测试任务

gulp.task('test:unit', function(done) {
    startKarmaTests(true, done);
});

gulp.task('webdriver', webdriver);
gulp.task('test:e2e', ['webdriver'], function(cb) {

    var testFiles = gulp.src('test/e2e/**/*.js');

    testServer({
        port: '4444',
        dir: './app/'
    }).then(function(server) {
        testFiles.pipe(protractor({
            configFile: 'tests/protractor.conf.js',
        })).on('error', function(err) {
            // Make sure failed tests cause gulp to exit non-zero
            throw err;
        }).on('end', function() {
            server.close(cb)
        });
    });

});

gulp.task('test', ['test:unit', 'test:e2e'])

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

function testServer(params) {

    var app = express();

    app.use(express.static(params.dir));

    return new Promise(function(res, rej) {
        var server = app.listen(params.port, function() {
            res(server)
        });
    });
}

function startKarmaTests(singleRun, done) {

    var excludeFiles = [];

    var server = new karmaServer({
        configFile: __dirname + '/tests/karma.conf.js',
        exclude: excludeFiles,
        singleRun: !!singleRun
    }, karmaCompleted);

    server.start();

    ////////////////

    function karmaCompleted(karmaResult) {
        log('Karma completed');

        if (karmaResult === 1) {
            done('\n********************************'+
                 '\nkarma: tests failed with code ' + karmaResult +
                 '\n********************************');
        } else {
            done();
        }
    }
}