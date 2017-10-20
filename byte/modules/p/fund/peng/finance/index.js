/**=========================================================
 * 基金-七天理财详情
 =========================================================*/
(function () {
    'use strict';

    angular
        .module(ApplicationConfiguration.applicationModuleName)
        .controller('p.fund.peng.finance', MainController);

    MainController.$inject = ['$scope', '$timeout', 'BtUtilService', 'configVo'];
    function MainController($scope, $timeout, BtUtilService, configVo) {

        activate();

        BtUtilService
            .post(configVo.BTServerPath.Test_Query_Pages,{schemeId:configVo.btParams.id,businStatus:"1"})
            .then(function(jsonData){
                $scope.rowDatas = jsonData.data;
            });

        ////////////////
        //初始化方法开始
        function activate() {

            // 指定图表的配置项和数据
            var option = {
                title: {
                    text: '七天年化走势图'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data:['七天年化收益率']
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['2017-07-17', '2017-07-18', '2017-07-19', '2017-07-20', '2017-07-21', '2017-07-22', '2017-07-23']
                },
                yAxis: {
                    type: 'value',
                    scale: true,
                    axisLabel: {
                        formatter: '{value} %'
                    },
                    splitLine: {
                        show: false
                    }
                },
                series: [
                    {
                        name: '七天年化收益率',
                        type: 'line',
                        data: [11, 11, 15, 13, 12, 13, 10],
                        markPoint: {
                            data: [
                                { type: 'max', name: '最大值' },
                                { type: 'min', name: '最小值' }
                            ]
                        },
                        markLine: {
                            data: [
                                { type: 'average', name: '平均值' }
                            ]
                        }
                    },
                ]
            };

            $timeout(function () {
                // 基于准备好的dom，初始化echarts实例
                var myChart = echarts.init(document.getElementById('main'));

                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
            }, 10);


        } // 初始化结束
    }

})();
