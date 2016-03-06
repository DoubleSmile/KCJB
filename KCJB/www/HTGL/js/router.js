/**
 * kcjb Module
 *
 * Description
 */


var app = angular.module('kcjb', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider
            .otherwise('/');
        $stateProvider
            .state('profile', {
                url: '/profile',
                templateUrl: 'profile.html',
                controller: function($scope, $http) {
                    $http.get('/api/profile/').success(function(data) {
                        $scope.user = data;
                    })
                    $scope.profileForm = function() {
                        $http.post('/api/profile', $scope.user)
                            .success(function(msg) {
                                if (msg.succ == 0) alert("提交成功");

                            })
                    };
                },
            })
            .state('spread', {
                url: '/spread',
                templateUrl: 'spread.html',
                controller: function($scope, $http) {
                    $http.get('res/spread.json').success(function(data) {
                        $scope.spread = data;
                    })
                }
            })
            .state('score', {
                url: '/score',
                templateUrl: 'score.html',
                controller: function($scope, $http) {
                    // $http.get('res/score.json').success(function(data) {
                    // })
                    // $scope.scoreForm = function() {
                    //     $http.post('profile.php', $scope.score)
                    //         .success(function() {
                    //             alert("提交成功");

                    //         })
                    // };



                }

            })
            .state('userlist', {
                url: '/userlist',
                templateUrl: 'userlist.html',
                controller: function($scope, $http) {
                    $("table").dataTable({
                        "ajax": '/api/user',
                        "columns": [{
                            "data": "id"
                        }, {
                            "data": "username"
                        }, {
                            "data": "nickname"
                        }, {
                            "data": "name"
                        }, {
                            "data": "group"
                        }, {
                            "data": "ip"
                        }, {
                            "data": "manager"
                        }, {
                            "data": "grant"
                        }, {
                            "data": "createTime"
                        }, {
                            "data": "button"
                        }]

                    })
                    $scope.userlistForm = function() {
                        var id = $("input[name='id']").val();
                        var username = $("input[name='username']").val();
                        var nickname = $("input[name='nickname']").val();
                        var name = $("input[name='name']").val();
                        var mobile = $("input[name='mobile']").val();
                        var qq = $("input[name='qq']").val();
                        var mail = $("input[name='mail']").val();
                        var group = $("input[name='group']").val();
                        var business = $("input[name='business']").val();
                        var score = $("input[name='score']").val();
                        var grant = $("input[name='state']:checked").val();
                        $http.post('/api/profile/', {
                                id: id,
                                username: username,
                                nickname: nickname,
                                name: name,
                                mobile: mobile,
                                qq: qq,
                                mail: mail,
                                group: group,
                                business: business,
                                grant: grant,
                                score:score
                            })
                            .success(function() {
                                alert("提交成功");

                            })
                    };
                }
            }).state('unuser', {
                url: '/unuser',
                templateUrl: 'unuser.html',
                controller: function($scope, $http) {
                    // $http.get('/api/user').success(function(data) {
                    //     $scope.spread = data;
                    // })
                }
            }).state('blacklist', {
                url: '/blacklist',
                templateUrl: 'blacklist.html',
                controller: function($scope, $http) {
                    $http.get('res/spread.json').success(function(data) {
                        $scope.spread = data;
                    })
                }
            }).state('warning', {
                url: '/warning',
                templateUrl: 'warning.html',
                controller: function($scope, $http) {
                    $http.get('res/spread.json').success(function(data) {
                        $scope.spread = data;
                    })
                }
            }).state('table', {
                url: '/table',
                templateUrl: 'table.html'
                    // controller: function($scope, $http) {
                    //     $http.get('res/spread.json').success(function(data) {
                    //         $scope.spread = data;
                    //     })
                    // }
            }).state('prosel', {
                url: '/prosel',
                templateUrl: 'prosel.html',
                controller: function($scope, $http) {
                    $http.get('res/spread.json').success(function(data) {
                        $scope.spread = data;
                    })
                }
            }).state('profix', {
                url: '/profix',
                templateUrl: 'profix.html',
                controller: function($scope, $http) {
                    $("table").dataTable({
                        'ajax': '/api/product',
                        'columns': [{
                            'data': "category"
                        }, {
                            'data': "name"
                        }, {
                            'data': "cost"
                        }, {
                            'data': "button"
                        }]
                    });
                    $scope.profixForm = function() {
                        var cost = $("input[name='cost']").val();
                        var benifit = $("input[name='benifit']").val();
                        var product = $("input[name='productname']").val();
                        var select = $("#selectt>option:selected").val();
                        $http.post('/api/product/' + select + '/' + product, {
                            cost: cost,
                            factor: benifit
                        }).success(function() {
                            alert("提交成功");

                        })
                    }


                }
            }).state('price', {
                url: '/price',
                templateUrl: 'price.html',
                controller: function($scope, $http) {
                    $http.get('res/spread.json').success(function(data) {
                        $scope.spread = data;
                    })
                }
            }).state('handan', {
                url: '/handan',
                templateUrl: 'handan.html',
                controller: function($scope, $http) {
                    $http.get('res/spread.json').success(function(data) {
                        $scope.spread = data;
                    })
                }
            })
    }
])
