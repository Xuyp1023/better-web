/**=========================================================
 * Module: constants.js
 * Define constants to inject across the application
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.lazyload')
        .constant('APP_MEDIAQUERY', {
          'desktopLG':             1200,
          'desktop':                992,
          'tablet':                 768,
          'mobile':                 480
        })
        .constant('APP_REQUIRES', {
          // jQuery based and standalone scripts
          scripts: {
            //很漂亮的时间选择控件
            'flatpickr':          ['vendor/flatpickr/dist/flatpickr.min.css',
                                   'vendor/flatpickr/dist/flatpickr.min.js'],
            //97的时间选择控件
            'wdatePicker':        ['vendor/My97DatePicker/4.8-beta4/WdatePicker.js'],
            //下拉的字典选择
            'btDict':{
              files:              ['vendor/tools/dicTool.js',
                                   '../p/generate/lib/BTDictData.js'],
              serie:true
            },
            //动画效果的css
            'animate':            ['vendor/animate.css/animate.min.css'],
            'jquery':             ['vendor/jquery/jquery.js'],
            //spin效果的css
            'whirl':              ['vendor/whirl/dist/whirl.min.css'],
            'spinkit':            ['vendor/spinkit/css/spinkit.css'],
            //与spin效果类似
            'loaders.css':        ['vendor/loaders.css/loaders.css'],
            'chrome-tabs':        ['vendor/chrome-tabs/chrome-tabs.css'],
            'pdf':                ['vendor/pdfmake/build/pdfmake.min.js',
                                   'vendor/pdfmake/build/vfs_fonts.js'],
            'CSV-JS':             ['master/bower_components/CSV-JS/csv.js'],
            'flatdoc':            ['vendor/flatdoc/legacy.js',
                                   'vendor/flatdoc/flatdoc.js',
                                   'vendor/flatdoc/theme-white/style.css'],
            'codemirror':         ['vendor/codemirror/lib/codemirror.js',
                                   'vendor/codemirror/lib/codemirror.css'],
            // modes for common web files
            'codemirror-modes-web': ['vendor/codemirror/mode/javascript/javascript.js',
                                     'vendor/codemirror/mode/xml/xml.js',
                                     'vendor/codemirror/mode/htmlmixed/htmlmixed.js',
                                     'vendor/codemirror/mode/css/css.js'],
            //模板引擎
            'templates':          ['vendor/templates/art-template.js'],
            //css兼容
            'modernizr':          ['vendor/modernizr/modernizr.custom.js'],
            //百度图表
            'echarts':       ['vendor/echarts/dist/echarts.common.min.js']
          },
          // Angular based script (use the right module name)
          modules: [
            {name: 'angularBootstrapNavTree',           files: ['vendor/angular-bootstrap-nav-tree/dist/abn_tree_directive.js',
                                                                'vendor/angular-bootstrap-nav-tree/dist/abn_tree.css']},
            {name: 'angularFileUpload',                 files: ['vendor/angular-file-upload/dist/angular-file-upload.js']},
            {name: 'bootstrap',                         files: ['vendor/bootstrap/dist/js/ui-bootstrap-tpls.min.js']},
            {name: 'ngImgCrop',                         files: ['vendor/ng-img-crop/compile/unminified/ng-img-crop.js',
                                                                'vendor/ng-img-crop/compile/unminified/ng-img-crop.css']},
            {name: 'ngWig',                             files: ['vendor/ngWig/dist/ng-wig.min.js'] },
            {name: 'ui.grid',                           files: ['vendor/angular-ui-grid/ui-grid.min.css',
                                                                'vendor/angular-ui-grid/ui-grid.min.js']},
            {name: 'ui.codemirror',                     files: ['vendor/angular-ui-codemirror/ui-codemirror.js']},
            {name: 'toaster',                           files: ['vendor/angularjs-toaster/toaster.min.js',
                                                                'vendor/angularjs-toaster/toaster.min.css']},
            {name: 'ueditor',                           files: ['vendor/angular-ueditor/ueditor.config.js',
                                                                'vendor/angular-ueditor/ueditor.all.js',
                                                                'vendor/angular-ueditor/angular-ueditor.js']},
            {name: 'ngDialog',                          files: ['vendor/ngDialog/js/ngDialog.min.js',
                                                                'vendor/ngDialog/css/ngDialog.min.css',
                                                                'vendor/ngDialog/css/ngDialog-theme-default.min.css',
                                                                'vendor/ngDialog/css/ngDialog-theme-plain.css',
                                                                'vendor/ngDialog/css/ngDialog-custom-width.css']},
            {name: 'ui.select',                         files: ['vendor/angular-ui-select/dist/select.js',
                                                                'vendor/angular-ui-select/dist/select.css']},
            {name: 'ngTable',                           files: ['vendor/ng-table/dist/ng-table.min.js',
                                                                'vendor/ng-table/dist/ng-table.min.css']},
            {name: 'ngTableExport',                     files: ['vendor/ng-table-export/ng-table-export.js']},
            {name: 'htmlSortable',                      files: ['vendor/html.sortable/dist/html.sortable.js',
                                                                'vendor/html.sortable/dist/html.sortable.angular.js']},
            {name: 'dragular',                          files: ['vendor/dragular/dist/dragular.min.css',
                                                                'vendor/dragular/dist/dragular.min.js']},
            {name: 'oitozero.ngSweetAlert',             files: ['vendor/sweetalert/dist/sweetalert.css',
                                                                'vendor/sweetalert/dist/sweetalert.min.js',
                                                                'vendor/angular-sweetalert/SweetAlert.js']},
            {name: 'mes',                               files: ['modules/mes/public/js/mes.module.js',
                                                                'modules/mes/public/js/mes.controller.js',
                                                                'modules/mes/public/js/bill.service.js',
                                                                'modules/mes/public/js/bill.controller.js',
                                                                'modules/mes/public/js/query.controller.js']},
            {name: 'tabs',                              files: ['app/modules/mes/public/tabs/controllers/tabs.controller.js',
                                                                'app/modules/mes/public/tabs/services/tabs.provider.js',
                                                                'app/modules/mes/public/tabs/services/tabs.service.js']},
            {name: 'docs1',                              files: ['app/modules/mes/public/tabs/controllers/tabs.controller.js',
                                                                'app/modules/mes/public/tabs/services/tabs.provider.js',
                                                                'app/modules/mes/public/tabs/services/tabs.service.js']}

          ]
        })
      ;

})();