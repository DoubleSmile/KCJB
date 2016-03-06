/**
 * app Module
 *
 * Description
 */
// var __info;
var gg_id;
angular.module('app', [])
    .controller('day', ['$scope', '$http', function($scope, $http) {
        $("#getday").unbind('click').click(function(event) {
            $http.get('/api/stat/d').success(function(data) {
                $scope.items = data.data;
            });
            $scope.choose = function(id) {
                gg_id = id;
                $("#modaltable1").DataTable().destroy();
                $("#modaltable1").dataTable({
                    "ajax": '/api/bill/' + gg_id,
                    "columns": [{
                        "data": "id"
                    }, {
                        "data": "from"
                    }, {
                        "data": "product"
                    }, {
                        "data": "type"
                    }, {
                        "data": "openPrice"
                    }, {
                        "data": "createTime"
                    }, {
                        "data": "checkUpPrice"
                    }, {
                        "data": "checkLowPrice"
                    }, {
                        "data": "finnishPrice"
                    }, {
                        "data": "finnishTime"
                    }, {
                        "data": "benefit"
                    }, {
                        "data": "state"
                    }],
                    "retrieve": true,
                    // "paging" : false,
                    "order": [
                        [0, "desc"]
                    ]

                });
            }
        });
    }]).controller('week', ['$scope', '$http', function($scope, $http) {
        $("#getweek").unbind('click').click(function(event) {
            $http.get('/api/stat/w').success(function(data) {
                $scope.items = data.data;
            });
            $scope.choose = function(id) {
                gg_id = id;
                $("#modaltable1").DataTable().destroy();
                $("#modaltable1").dataTable({
                    "ajax": '/api/bill/' + gg_id,
                    "columns": [{
                        "data": "id"
                    }, {
                        "data": "from"
                    }, {
                        "data": "product"
                    }, {
                        "data": "type"
                    }, {
                        "data": "openPrice"
                    }, {
                        "data": "createTime"
                    }, {
                        "data": "checkUpPrice"
                    }, {
                        "data": "checkLowPrice"
                    }, {
                        "data": "finnishPrice"
                    }, {
                        "data": "finnishTime"
                    }, {
                        "data": "benefit"
                    }, {
                        "data": "state"
                    }],
                    "retrieve": true,
                    // "paging" : false,
                    "order": [
                        [0, "desc"]
                    ]

                });
            }
        });
    }]).controller('lastweek', ['$scope', '$http', function($scope, $http) {
        $("#getlastweek").unbind('click').click(function(event) {
            $http.get('/api/stat/l').success(function(data) {
                $scope.items = data.data;
            });
            $scope.choose = function(id) {
                gg_id = id;
                $("#modaltable1").DataTable().destroy();
                $("#modaltable1").dataTable({
                    "ajax": '/api/bill/' + gg_id,
                    "columns": [{
                        "data": "id"
                    }, {
                        "data": "from"
                    }, {
                        "data": "product"
                    }, {
                        "data": "type"
                    }, {
                        "data": "openPrice"
                    }, {
                        "data": "createTime"
                    }, {
                        "data": "checkUpPrice"
                    }, {
                        "data": "checkLowPrice"
                    }, {
                        "data": "finnishPrice"
                    }, {
                        "data": "finnishTime"
                    }, {
                        "data": "benefit"
                    }, {
                        "data": "state"
                    }],
                    "retrieve": true,
                    // "paging" : false,
                    "order": [
                        [0, "desc"]
                    ]

                });
            }
        });
    }]).controller('month', ['$scope', '$http', function($scope, $http) {
        $("#getmonth").unbind('click').click(function(event) {
            $http.get('/api/stat/m').success(function(data) {
                $scope.items = data.data;
            });
            $scope.choose = function(id) {
                gg_id = id;
                $("#modaltable1").DataTable().destroy();
                $("#modaltable1").dataTable({
                    "ajax": '/api/bill/' + gg_id,
                    "columns": [{
                        "data": "id"
                    }, {
                        "data": "from"
                    }, {
                        "data": "product"
                    }, {
                        "data": "type"
                    }, {
                        "data": "openPrice"
                    }, {
                        "data": "createTime"
                    }, {
                        "data": "checkUpPrice"
                    }, {
                        "data": "checkLowPrice"
                    }, {
                        "data": "finnishPrice"
                    }, {
                        "data": "finnishTime"
                    }, {
                        "data": "benefit"
                    }, {
                        "data": "state"
                    }],
                    "retrieve": true,
                    // "paging" : false,
                    "order": [
                        [0, "desc"]
                    ]

                });
            }
        });
    }]).controller('all', ['$scope', '$http', function($scope, $http) {
        $("#getall").unbind('click').click(function(event) {
            $http.get('/api/stat/a').success(function(data) {
                $scope.items = data.data;
            });
            $scope.choose = function(id) {
                gg_id = id;
                $("#modaltable1").DataTable().destroy();
                $("#modaltable1").dataTable({
                    "ajax": '/api/bill/' + gg_id,
                    "columns": [{
                        "data": "id"
                    }, {
                        "data": "from"
                    }, {
                        "data": "product"
                    }, {
                        "data": "type"
                    }, {
                        "data": "openPrice"
                    }, {
                        "data": "createTime"
                    }, {
                        "data": "checkUpPrice"
                    }, {
                        "data": "checkLowPrice"
                    }, {
                        "data": "finnishPrice"
                    }, {
                        "data": "finnishTime"
                    }, {
                        "data": "benefit"
                    }, {
                        "data": "state"
                    }],
                    "retrieve": true,
                    // "paging" : false,
                    "order": [
                        [0, "desc"]
                    ]

                });
            }
        });
    }]).controller('login', ['$scope', '$http', function($scope, $http) {
        $scope.loginForm = function() {
            $http.post('/api/login', $scope.user)
                .success(function(data) {
                    // alert("提交成功");
                    // 跳转
                    // alert(data.msg);
                    if (data.succ == 0) {
                        window.location.href = "/index.html";
                    } else {
                        alert(data.msg);
                    }

                })
        }


    }]).controller('logup', ['$scope', '$http', function($scope, $http) {
        $scope.logupForm = function() {
            $http.post('/api/regist', $scope.user)
                .success(function(data) {
                    if (data.succ == 0) {
                        alert("注册成功，点击确定后进入房间！");
                        window.location.href = "/index.html";
                    } else {
                        alert(data.msg);
                    }

                })
        }

    }]).controller('change_pass', ['$scope', '$http', function($scope, $http) {
        $scope.changeForm = function() {
            $http.post('/api/change_pass', $scope.change)
                .success(function(data) {
                    alert(data.msg);
                })
        }

    }])
    // .controller('info', ['$scope','$http', function($scope, $http) {
    //     $http.get('/api/info').success(function(data){
    //  if (data.succ!==0) {
    //      window.location.href='/login.html';
    //  } else {
    //      __info = data;
    //      $("#userddd").text(data.display);
    //  }
    //     })
    // }])
