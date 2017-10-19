/*
sass grunt构建
@author binhg
*/
module.exports = function(grunt) {

    grunt.initConfig({

        //Read the package.json (optional)
        pkg: grunt.file.readJSON('package.json'),

        // Metadata.
        meta: {
            basePath: './scf2/',
            wechatPath:'./wechat/',
            pPath:'./p/',
            srcPath: './scf2/sass/',
            deployPath: './scf2/css/'
        },

        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                '* Copyright (c) <%= grunt.template.today("yyyy") %> ',

        // Task configuration.
        sass: {
            dist: {
                options:{
                    loadPath:'<%= meta.srcPath %>',
                    style: 'nested',
                    sourcemap:'none'
                },
                files:[{
                        expand: true,
                        cwd: '<%= meta.srcPath %>',
                        src: ['**/*.scss'],
                        dest: '<%= meta.deployPath %>',
                        ext: '.css'
                }] 
            }
        },
        watch: {
            scripts: {
                files: [
                    '<%= meta.srcPath %>/**/*.scss'
                ],
                tasks: ['compass:dist']
            },
            wechat:{
                files: [
                    '<%= meta.wechatPath %>/**/*.scss'
                ],
                tasks: ['compass:wechat']
            },
            psass:{
                files: [
                    '<%= meta.pPath %>/**/*.scss'
                ],
                tasks: ['compass:psass']
            }

        },
        //scf2 wechat compass设置
        compass:{
            dist: {                   
                  options: {
                    basePath:'<%= meta.basePath %>',           
                    config: '<%= meta.basePath %>config.rb'
                  }
            },
            wechat: {                   
                  options: {
                    basePath:'<%= meta.wechatPath %>',           
                    config: '<%= meta.wechatPath %>config.rb'
                  }
            },
            psass: {                   
                  options: {
                    basePath:'<%= meta.pPath %>',           
                    config: '<%= meta.pPath %>config.rb'
                  }
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task.
    grunt.registerTask('default', ['watch:scripts']);
    //p分支监听
    grunt.registerTask('psass',['watch:psass']);
    //监听wechatsass变化
    grunt.registerTask('wechat', ['watch:wechat']);
};