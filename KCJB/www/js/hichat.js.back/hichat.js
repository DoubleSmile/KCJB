var __users = [];
var __info;
var __idx = [];
var chat;
var index;
var billId;
var subscribed_id;

window.onresize = function() {
    $("#resize").height(document.documentElement.clientHeight - 490 + 'px');
    $("#userh").height(document.documentElement.clientHeight - 300 + 'px');
    // $("#wrap").height(document.documentElement.clientHeight-260+'px');
    $("#home1").height(document.documentElement.clientHeight - 208 + 'px');
    $("#minh").height(document.documentElement.clientHeight - 202 + 'px');
    var height = $("#home1").height() * 0.75;
    $("#historyMsg").css('height', height);
    var oBox = document.getElementById('home1');
    var oTop = document.getElementById('historyMsg');
    var oBottom = document.getElementById('historyMsg1');
    var oLine = document.getElementById('line');
    oLine.onmousedown = function(e) {
        var disX = (e || event).clientX;
        var disY = (e || event).clientY;
        oLine.top = oLine.offsetTop;
        document.onmousemove = function(e) {
            var iT = oLine.top + ((e || event).clientY - disY);
            var e = e || window.event,
                tarnameb = e.target || e.srcElement;
            var maxT = oBox.clientHeight - oLine.offsetHeight;
            oLine.style.margin = 0;
            iT < 0 && (iT = 0);
            iT > maxT && (iT = maxT);
            oLine.style.top = oTop.style.height = iT + "px";
            oBottom.style.height = oBox.clientHeight - iT + "px";

            return false
        };
        document.onmouseup = function() {
            document.onmousemove = null;
            document.onmouseup = null;
            oLine.releaseCapture && oLine.releaseCapture()
        };
        oLine.setCapture && oLine.setCapture();
        return false
    };
}
window.onload = function() {
    $("#resize").height(document.documentElement.clientHeight - 490 + 'px');
    $("#userh").height(document.documentElement.clientHeight - 300 + 'px');
    $("#home1").height(document.documentElement.clientHeight - 208 + 'px');
    $("#minh").height(document.documentElement.clientHeight - 202 + 'px');
    // $("#wrap").height(document.documentElement.clientHeight-260+'px');
    var height = $("#home1").height() * 0.75;
    $("#historyMsg").css('height', height);
    $("#historyMsg1").css('height', height / 3);
    $("#messageInput").focus();
    var oBox = document.getElementById('home1');
    var oTop = document.getElementById('historyMsg');
    var oBottom = document.getElementById('historyMsg1');
    var oLine = document.getElementById('line');
    oLine.onmousedown = function(e) {
        var disX = (e || event).clientX;
        var disY = (e || event).clientY;
        oLine.top = oLine.offsetTop;
        document.onmousemove = function(e) {
            var iT = oLine.top + ((e || event).clientY - disY);
            var e = e || window.event,
                tarnameb = e.target || e.srcElement;
            var maxT = oBox.clientHeight - oLine.offsetHeight;
            oLine.style.margin = 0;
            iT < 0 && (iT = 0);
            iT > maxT && (iT = maxT);
            oLine.style.top = oTop.style.height = iT + "px";
            oBottom.style.height = oBox.clientHeight - iT + "px";

            return false
        };
        document.onmouseup = function() {
            document.onmousemove = null;
            document.onmouseup = null;
            oLine.releaseCapture && oLine.releaseCapture()
        };
        oLine.setCapture && oLine.setCapture();
        return false
    };
    var flag = false;
    //if(flag)
    $.ajax({
        type:'GET',
        url : '/api/info',
        success : function(data){
            console.log("data", data);
            if(data.succ !== 0)
            {
               $.ajax({
                    url: '/api/login',
                    type: 'POST',
                    dataType: 'json',
                })
                .done(function(msg) {
                    console.log("success", msg);
                    if (msg.succ == 0) {
                        flag = true;
                        console.log("msg",flag);
                        window.location.href = "/";
                        // return;
                    }
                }); 
            }
            else
            {
                
                flag = true;
                console.log("data", flag);
                //window.location.href = "/";
                return;
            }
        }
    });
    //if(flag)
    $.ajax({
        type: 'GET',
        url: '/api/info',
        // async:true,
        success: function(data) {
            if (data.succ !== 0) {
                //window.reload();
                window.location.href = '/index.html';
                return;
                //data = guest_request();
            //if (document.cookie.length == 0)
             // {
                //data = guest_request();
                }
        // }
            //console.log("success", data);
            __info = data;
            $("#userddd").html(__info.display);
            $(".dropdown-menu").append('<li><a>积分 ' + data.score + '</a></li>');
            if (__info.group == 0) {
                $(".dropdown-menu").find('li').eq('0').remove();
                $(".dropdown-menu").find('li').eq('0').remove();
                $(".dropdown-menu").find('li').eq('0').remove();
            };
            if (__info.group == 100) {
                //                $(".dropdown-menu").append('<li class="divider"></li><li><a href="/htgl/admin.html">后台管理中心</a></li>')

                $(".dropdown-menu").append("<li id='power'><a>全屏蔽</a></li>");
                // $("#sendBtn").after("<button class='btn btn-primary pull-right btn-sm' style='margin-left:2px;margin-right:2px;' id='power'>全屏蔽</button>");
            }
            if (__info.group >= 92) {
                $(".dropdown-menu").append('<li class="divider"></li><li><a href="/htgl/admin.html">后台管理中心</a></li>');
            }
            if (__info.group >= 95) {
                $("#sendBtn").after("<span class='pull-right' style='color:#fff;'>行情到大厅</span><input type='checkbox' name = 'lobby' class='pull-right'>");
                $("#sendBtn").after("<button class='btn btn-primary pull-right btn-sm' style='margin-left:2px;margin-right:2px;' id='ding'>行情提醒</button>");
                $("#sendBtn").after("<button class='btn btn-primary pull-right btn-sm' style='margin-left:2px;margin-right:2px;' id='callbill' data-toggle='modal' data-target='#myModal'>喊单</button>");
                $("#callbill").unbind('click').click(function(event) {
                    $.ajax({
                            url: '/api/category',
                            type: 'GET',
                            dataType: 'json',

                        })
                        .done(function(data) {
                            $("#pro").find('input').remove();
                            $("#pro").find('span').remove();

                            for (var i = 0; i < data.length; i++) {
                                $("#pro").append("<input type='radio' name='pro' value=''><span></span>");
                                $("input[name='pro']").next('span').eq(i).text(data[i].name);
                                $("input[name='pro']").eq(i).val(data[i].name).text(data[i].name);
                            }

                            $("input[name='pro']").click(function(event) {
                                for (var i = 0; i < data.length; i++) {
                                    if (data[i].name == $(this).val()) {
                                        index = i;
                                    }

                                };
                                $("#billtype").find('input').remove();
                                $("#billtype").find('span').remove();
                                for (var j = 0; j < data[index].products.length; j++) {

                                    $("#billtype").append("<input type='radio' name='billtype' value='" + data[index].products[j] + "'><span>" + data[index].products[j] + "</span>");
                                    // $("input[name='billtype']").next('span').eq(j).text(data[index].products[j]);
                                    // $("input[name='billtype']").eq(j).val(data[index].products[j]);
                                };
                            });



                        });

                });
            };
            /*
            if (__info.group >= 90 && __info.group < 95) {
                $("#sendBtn").after("<button class='btn btn-primary pull-right' id='ding'>行情提醒</button>")
            };
        */
            if (__info.group >= 50 && __info.group <= 89) {
                $("#sendBtn").after("<button class='btn btn-primary pull-right' id='question'>提问</button>");
            }
            $.ajax({
                    url: '/api/suscribe',
                    type: 'GET',
                    dataType: 'json',

                })
                .done(function(data) {
                    for (var i = 0; i < data.length; i++) {
                        $("#subscribed").append("<input type='radio' name='long' value=" + data[i].name + "><span>" + data[i].name + "天(" + data[i].score + "积分)</span>");

                    };
                });
            $.ajax({
                url: '/api/history',
                dataType: 'json'
            }).done(function(msg) {
                for (var i = 0; i < msg.length; i++) {
                    if (msg[i].pass) {
                        var from = msg[i].from_display;
                        var to = msg[i].to_display;
                        var color = "#fff";
                        // var to = __users[msg[i].to_idx].display||'大家';
                        var a = msg[i].createTime;
                        var msg1 = msg[i].context;
                        var date = moment(a).format('HH:mm:ss');
                        if (isAdminstrator(from))
                            $("#historyMsg").append("<p><span style='background-color:#505050;color:#fff;padding:3px 5px 3px 5px;margin-right:5px;border-radius: 5px;'>" + date + "</span><span style='padding:3px 5px 3px 5px;background-color:#66cc66;color:#fff;border-radius: 5px;font-size:12px;'>" + from + "</span> 对 <span  style='padding:3px 5px 3px 5px;background-color:#66cc66;color:#fff;border-radius: 5px;font-size:12px;'>" + to + "</span> ：<span style='padding:3px 5px 3px 5px;background-color:" + color + ";font-size:12px;border-radius: 5px; color:#FF0000;'>" + msg1 + "</span></p>");
                        else
                            $("#historyMsg").append("<p><span style='background-color:#505050;color:#fff;padding:3px 5px 3px 5px;margin-right:5px;border-radius: 5px;'>" + date + "</span><span style='padding:3px 5px 3px 5px;background-color:#66cc66;color:#fff;border-radius: 5px;font-size:12px;'>" + from + "</span> 对 <span  style='padding:3px 5px 3px 5px;background-color:#66cc66;color:#fff;border-radius: 5px;font-size:12px;'>" + to + "</span> ：<span style='padding:3px 5px 3px 5px;background-color:" + color + ";font-size:12px;border-radius: 5px;'>" + msg1 + "</span></p>");
                        document.getElementById('historyMsg').scrollTop = document.getElementById('historyMsg').scrollHeight;

                    } else if (__info.group >= 90) {
                        var from = msg[i].from_display;
                        var to = msg[i].to_display;
                        var color = '#fff';
                        // var to = __users[msg[i].to_idx].display||'大家';
                        var a = msg[i].createTime;
                        var msg1 = msg[i].context;
                        var date = moment(a).format('HH:mm:ss');
                        $("#historyMsg").append("<p><span style='background-color:#505050;color:#fff;padding:3px 5px 3px 5px;margin-right:5px;border-radius: 5px;'>" + date + "</span><span style='padding:3px 5px 3px 5px;background-color:#66cc66;color:#fff;border-radius: 5px;font-size:14px;'>" + from + "</span> 对 <span  style='padding:3px 5px 3px 5px;background-color:#66cc66;color:#fff;border-radius: 5px;font-size:14px;'>" + to + "</span> ：<span style='padding:3px 5px 3px 5px;background-color:" + color + ";font-size:14px;border-radius: 5px;'>" + msg1 + "</span></p>");
                        document.getElementById('historyMsg').scrollTop = document.getElementById('historyMsg').scrollHeight;

                    }
                };
            });
            $.ajax({
                url: '/api/bill/history',
                dataType: 'json'
            }).done(function(data) {
                for (var i = 0; i < data.length; i++) {
                    if (!data[i].finnishTime) data[i].finnishTime = data[i].createTime;
                    //var date = data[i].finnishTime.split(' ')[1];
                    var preDate = data[i].finnishTime;
                    var date = String(moment(preDate).format('YYYY-MM-DD HH:mm'));
                    //var endDate = data[i].finnishTime.split(' ')[1];
                    var from = data[i].from;
                    var product = data[i].product;
                    // var moreless = data[i].moreless ? '做多' : '做空';
                    // var hang = data[i].hang ? '挂单' : '现金';
                    var type = data[i].type;
                    var type_format = /空/.test(type) ? '空单' : '多单';
                    var operation = data[i].state;
                    var checkUpPrice = data[i].checkUpPrice;
                    var checkLowPrice = data[i].checkLowPrice;
                    var finnishPrice = data[i].finnishPrice;
                    var openPrice = data[i].openPrice;
                    // var lobby = data[i].lobby;
                    var reason = data[i].reason;
                    var id = data[i].id;
                    var word, fword;
                    if (data[i].type === 'speaker') {

                        $("#home").append("<p style='font-size:12px;'><span style='font-size:12px;color:#A73CC2'>【" + from + "】</span>建议，【<span style='font-size:12px;color:blue;'>行情提醒</span>】" + date + "<br><span style='font-size:12px;'>" + reason + "</span><br><span style='font-size:6px;color:grey;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
                        document.getElementById('home').scrollTop = document.getElementById('home').scrollHeight;
                        document.getElementById('resize').scrollTop = document.getElementById('resize').scrollHeight;
                        continue;
                    }

                    if (finnishPrice == checkUpPrice) {
                        word = "止盈平仓";
                        fword = "止盈减仓";
                    } else if (finnishPrice == checkLowPrice) {
                        word = "止损平仓";
                        fword = "止损减仓";
                    }
                    if (operation === '开仓') {
                        $("#home").append("<p style='font-size:12px;'><span style='font-size:12px;color:#A73CC2;'>【" + from + "】</span>建议，【单号】：" + id + "<span style='font-weight:600;font-size:14px;color:red;'>" + "&nbsp&nbsp" + type + "&nbsp&nbsp" + "</span>" + date + "<br><span style='font-size:14px;font-weight:600;'>" + product + "&nbsp&nbsp" + "</span>" + "【开仓价】:<span style='font-size:14px;color:red;font-weight:600;'>" + openPrice + "</span>，建议【止盈价】：<span style='font-size:14px;color:red;font-weight:600;'>" + checkUpPrice + "</span>，建议【止损价】：<span style='color:red;font-weight:600;font-size:14px;'>" + checkLowPrice + "</span><br><span style='font-size:6px;color:grey;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
                        document.getElementById('home').scrollTop = document.getElementById('home').scrollHeight;
                        document.getElementById('resize').scrollTop = document.getElementById('resize').scrollHeight;
                    }
                    if (operation === '增仓') {
                        $("#home").append("<p style='font-size:12px;'><span style='font-size:14px;color:#A73CC2;'>【" + from + "】</span>建议，【单号】：" + id + "<span style='font-weight:600;font-size:14px;color:red;'>" + "&nbsp&nbsp" + type + "&nbsp&nbsp" + "</span>，" + date + "<br><span style='font-size:14px;font-weight:600;'>" + product + "&nbsp&nbsp" + "</span>" + "【增仓价】:<span style='font-size:14px;color:red;font-weight:600;'>" + openPrice + "</span>，建议【止盈价】：<span style='font-size:14px;color:red;font-weight:600;'>" + checkUpPrice + "</span>，建议【止损价】：<span style='color:red;font-weight:600;font-size:14px;'>" + checkLowPrice + "</span><br><span style='font-size:6px;color:grey;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
                        document.getElementById('home').scrollTop = document.getElementById('home').scrollHeight;
                        document.getElementById('resize').scrollTop = document.getElementById('resize').scrollHeight;
                    }
                    if (operation === '减仓') {
                        //$("#home").append("<p style='font-size:14px;'><span style='font-size:14px;color:#A73CC2;'>【" + from + "】</span>建议，【单号】：" + id + "<span style='font-weight:600;font-size:16px;color:red;'>" +"&nbsp&nbsp"+ type +"&nbsp&nbsp"+ "</span>，" + date + "<br><span style='font-size:16px;font-weight:600;'>" + product +"&nbsp&nbsp"+ "</span>" + "【减仓价】:<span style='font-size:16px;color:red;font-weight:600;'>" + openPrice + "</span>，建议【止盈价】：<span style='font-size:16px;color:red;font-weight:600;'>" + checkUpPrice + "</span>，建议【止损价】：<span style='color:red;font-weight:600;font-size:16px;'>" + checkLowPrice + "</span><br><span style='font-size:6px;color:grey;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
                        $("#home").append("<p style='font-size:12px;'><span style='font-size:12px;color:#A73CC2;'>【" + from + "】</span>建议，【单号】：" + id + "<span style='font-weight:600;font-size:14px;color:red;'>" + "&nbsp&nbsp" + fword + "&nbsp&nbsp" + type_format + "</span>，" + date + "<br><span style='font-size:14px;font-weight:600;'>" + product + "&nbsp&nbsp" + "</span>" + "建议【减仓价】:<span style='font-size:14px;color:red;font-weight:600;'>" + finnishPrice + "</span><br><span style='font-size:6px;color:grey;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
                        document.getElementById('home').scrollTop = document.getElementById('home').scrollHeight;
                        document.getElementById('resize').scrollTop = document.getElementById('resize').scrollHeight;
                    }
                    if (operation === '平仓') {
                        $("#home").append("<p style='font-size:12px;'><span style='font-size:12px;color:#A73CC2;'>【" + from + "】</span>建议，【单号】：" + id + "<span style='font-weight:600;font-size:14px;color:red;'>" + "&nbsp&nbsp" + word + "&nbsp&nbsp" + type_format + "</span>，" + date + "<br><span style='font-size:14px;font-weight:600;'>" + product + "&nbsp&nbsp" + "</span>" + "建议【平仓价】:<span style='font-size:14px;color:red;font-weight:600;'>" + finnishPrice + "</span><br><span style='font-size:6px;color:grey;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
                        document.getElementById('home').scrollTop = document.getElementById('home').scrollHeight;
                        document.getElementById('resize').scrollTop = document.getElementById('resize').scrollHeight;
                    }
                    if (operation === '挂单') {
                        $("#home").append("<p style='font-size:12px;'><span style='font-size:12px;color:#A73CC2;'>【" + from + "】</span>建议，【单号】：" + id + "<span style='font-weight:600;font-size:14px;color:red;'>" + "&nbsp&nbsp" + type + "&nbsp&nbsp" + "</span>，" + date + "<br><span style='font-size:14px;font-weight:600;'>" + product + "&nbsp&nbsp" + "</span>" + "【开仓价】:<span style='font-size:14px;color:red;font-weight:600;'>" + openPrice + "</span>，建议【止盈价】：<span style='font-size:14px;color:red;font-weight:600;'>" + checkUpPrice + "</span>，建议【止损价】：<span style='color:red;font-weight:600;font-size:14px;'>" + checkLowPrice + "</span><br><span style='font-size:6px;color:grey;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
                        document.getElementById('home').scrollTop = document.getElementById('home').scrollHeight;
                        document.getElementById('resize').scrollTop = document.getElementById('resize').scrollHeight;
                    }
                    if (operation === '挂单成交') {
                        $("#home").append("<p style='font-size:12px;'><span style='font-size:12px;color:#A73CC2;'>【" + from + "】</span>建议，【单号】：" + id + "<span style='font-weight:600;font-size:14px;color:red;'>&nbsp&nbsp挂单成交</span>，" + date + "<br><span style='font-size:14px;font-weight:600;'>" + product + "&nbsp&nbsp" + "</span>建议" + type + "【开仓价】:<span style='font-size:14px;color:red;font-weight:600;'>" + openPrice + "</span>，建议【止盈价】：<span style='font-size:14px;color:red;font-weight:600;'>" + checkUpPrice + "</span>，建议【止损价】：<span style='color:red;font-weight:600;font-size:14px;'>" + checkLowPrice + "</span><br><span style='font-size:6px;color:grey;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
                        document.getElementById('home').scrollTop = document.getElementById('home').scrollHeight;
                        document.getElementById('resize').scrollTop = document.getElementById('resize').scrollHeight;
                    }
                    if (operation === '撤单') {
                        $("#home").append("<p style='font-size:12px;'><span style='font-size:12px;color:#A73CC2;'>【" + from + "】</span>建议，【单号】：" + id + "<span style='font-weight:600;font-size:14px;color:red;'></span>，" + date + "<br><span style='font-size:14px;font-weight:600;'>" + product + "&nbsp&nbsp" + "</span>【撤单】：撤单理由" + reason + "<br /><span style='font-size:6px;color:grey;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
                        document.getElementById('home').scrollTop = document.getElementById('home').scrollHeight;
                        document.getElementById('resize').scrollTop = document.getElementById('resize').scrollHeight;
                    }
                };
            })
            var hichat = new HiChat();
            hichat.init();

        }
    });

};

function isAdminstrator(from) {
    if (String(from) === "天囊投资-小喆" || String(from) === "天囊投资-咚咚" || String(from) === "天囊投资-吴老师" || String(from) === "天囊投资-小瑾" || String(from) === "天囊投资-屠老师" || String(from) === "天囊投资-张老师" || String(from) === "天囊投资-隆老师")
        return true;
    else
        return false;
}

function chatTo(id, name) {
    chat = id;
    $("#schat").text(name);
}

function schatTo(id, name) {
    $("#schat").text(name);
    chat = id;
}

function banmsg(id, name) {
    $.ajax({
            url: '/api/profile',
            type: 'POST',
            dataType: 'json',
            data: {
                grant: '-2',
                id: id
            }, //屏蔽消息
        })
        .done(function() {});

}

function banspeak(id, name) {

    $.ajax({
            url: '/api/profile',
            type: 'POST',
            dataType: 'json',
            data: {
                grant: '-3',
                id: id
            }, //禁言
        })
        .done(function() {});
}

function sendgift(id, name) {
    $("#giftto").val(name);

}

function opera_finnish() {

    $("#pingcang").css('display', 'block');
    $("#zengcang").css('display', 'none');
    $("#jiancang").css('display', 'none');
    $("#deal").css('display', 'none');
    $("#chedan").css('display', 'none');

}

function opera_add() {

    $("#pingcang").css('display', 'none');
    $("#jiancang").css('display', 'none');
    $("#deal").css('display', 'none');
    $("#chedan").css('display', 'none');

    $("#zengcang").css('display', 'block');

}

function opera_reduce() {
    $("#jiancang").css('display', 'block');
    $("#pingcang").css('display', 'none');
    $("#zengcang").css('display', 'none');
    $("#deal").css('display', 'none');
    $("#chedan").css('display', 'none');

}

function opera_deal() {
    $("#deal").css('display', 'block');
    $("#pingcang").css('display', 'none');
    $("#jiancang").css('display', 'none');
    $("#zengcang").css('display', 'none');
    $("#chedan").css('display', 'none');

}

function opera_cancel() {
    $("#chedan").css('display', 'block');
    $("#pingcang").css('display', 'none');
    $("#jiancang").css('display', 'none');
    $("#zengcang").css('display', 'none');
    $("#deal").css('display', 'none');

}

$("#sendgiftto").unbind('click').click(function(event) {
    var to = $("input[name='sendto']").val();
    var cost = $("input[name='cost']").val();
    var bypass = $("input[name='bypass']").val();
    $.ajax({
            url: '/path/to/file',
            type: 'POST',
            dataType: 'json',
            data: {
                to: to,
                cost: cost,
                bypass: bypass
            }
        })
        .done(function() {});

});
$("#dingyue").unbind('click').click(function(event) {
    var howlong = $("input[name='long']:checked").val();
    $.ajax({
            url: '/api/send/' + gg_id,
            type: 'POST',
            dataType: 'json',
            data: {
                type: 'suscribe',
                name: howlong
            },
        })
        .done(function(data) {
            if (data.succ === 0) alert("您已订阅成功！");
            else alert(data.msg);
            window.location.href = "/index.html";
        });

});
$('#billtable>tbody').on('click', '.btn-warning', function(e) {
    var that = this;
    $("#chedan_submit").unbind('click').click(function(event) {
        $("#chedan").css('display', 'none');
        var reason = $("input[name='reason']").val();
        var id = $(that).attr('id');
        $.ajax({
            url: '/api/bill/' + id,
            type: 'POST',
            dataType: 'json',
            data: {
                operation: "cancel",
                reason: reason
            },
        }).done(function() {
            var table = $('#billtable').DataTable();
            table.row($(that).parents('tr')).remove().draw(false);

        });

    });



});
$("#billtable>tbody").on('click', 'tr', function(event) {
    // event.preventDefault();
    $("input[name='checkUpPrice']").val($(this)[0].cells[6].innerHTML);
    $("input[name='checkLowPrice']").val($(this)[0].cells[7].innerHTML);
    $("input[name='openPrice']").val($(this)[0].cells[4].innerHTML);
    billId = $(this)[0].cells[0].innerHTML;
});

$('#billtable>tbody').on('click', '.btn-danger', function(e) {
    // e.preventDefault();
    var that = this;
    $("#ping_checkUp").unbind('click').click(function(event) {
        var checkUpPrice = $("input[name='checkUpPrice']").val();
        $("#pingcang").css('display', 'none');
        $.ajax({
                url: '/api/bill/' + billId,
                type: 'POST',
                dataType: 'json',
                data: {
                    operation: 'finnish',
                    checkUpPrice: checkUpPrice,
                    id: billId
                },
            })
            .done(function(data) {
                if (data.succ == 0) {
                    var table = $('#billtable').DataTable();
                    table.row($(that).parents('tr')).remove().draw(false);
                }
            });

    });
    $("#ping_checkLow").unbind('click').click(function(event) {
        $("#pingcang").css('display', 'none');

        var checkLowPrice = $("input[name='checkLowPrice']").val();
        $.ajax({
                url: '/api/bill/' + billId,
                type: 'POST',
                dataType: 'json',
                data: {
                    operation: 'finnish',
                    checkLowPrice: checkLowPrice,
                    id: billId
                },
            })
            .done(function(data) {
                if (data.succ == 0) {
                    var table = $('#billtable').DataTable();
                    table.row($(that).parents('tr')).remove().draw(false);
                }
            });

    });

});
$("#billtable>tbody").on('click', '.sub', function(event) {
    var that = this;
    $("#jian_checkUp").unbind('click').click(function(event) {
        $("#jiancang").css('display', 'none');

        var checkUpPrice = $("input[name='checkUpPrice']").val();
        $.ajax({
                url: '/api/bill/' + billId,
                type: 'POST',
                dataType: 'json',
                data: {
                    operation: 'reduce',
                    checkUpPrice: checkUpPrice,
                    id: billId
                },
            })
            .done(function(data) {
                if (data.succ == 0) {
                    var table = $('#billtable').DataTable();
                    table.row($(that).parents('tr')).remove().draw(false);
                }

            });

    });
    $("#jian_checkLow").unbind('click').click(function(event) {
        $("#jiancang").css('display', 'none');

        var checkLowPrice = $("input[name='checkLowPrice']").val();
        $.ajax({
                url: '/api/bill/' + billId,
                type: 'POST',
                dataType: 'json',
                data: {
                    operation: 'reduce',
                    checkLowPrice: checkLowPrice,
                    id: billId
                },
            })
            .done(function(data) {
                if (data.succ == 0) {
                    var table = $('#billtable').DataTable();
                    table.row($(that).parents('tr')).remove().draw(false);
                }
            });

    });

});
$("#billtable>tbody").on('click', '.add', function(event) {
    var that = this;
    $("#zeng_submit").unbind('click').click(function(event) {
        $("#zengcang").css('display', 'none');

        var openPrice = $("input[name='openPrice']").val();
        var checkLowPrice = $("input[name='checkLowPrice']").val();

        var checkUpPrice = $("input[name='checkUpPrice']").val();

        $.ajax({
                url: '/api/bill/' + billId,
                type: 'POST',
                dataType: 'json',
                data: {
                    operation: 'add',
                    openPrice: openPrice,
                    checkUpPrice: checkUpPrice,
                    checkLowPrice: checkLowPrice,
                    id: billId
                },
            })
            .done(function(data) {
                if (data.succ == 0) {
                    var table = $('#billtable').DataTable();
                    table.row.add(data).draw();
                }

            });

    });


});
$("#billtable>tbody").on('click', '.deal', function(event) {
    var that = this;
    $("#deal_submit").unbind('click').click(function(event) {
        $("#deal").css('display', 'none');

        var openPrice = $("input[name='openPrice']").val();
        var checkLowPrice = $("input[name='checkLowPrice']").val();
        var checkUpPrice = $("input[name='checkUpPrice']").val();
        $.ajax({
                url: '/api/bill/' + billId,
                type: 'POST',
                dataType: 'json',
                data: {
                    operation: 'deal',
                    openPrice: openPrice,
                    checkLowPrice: checkLowPrice || 0,
                    checkUpPrice: checkUpPrice || 0,
                    id: billId
                },
            })
            .done(function(data) {
                if (data.succ == 0) {

                    var table = $('#billtable').DataTable();
                    table.row($(that).parents('tr')).remove().draw(false);
                    table.row.add(data).draw();
                }
            });

    });

});


$("#cancel").click(function(event) {
    $("#pingcang").css('display', 'none');
});
$("#cancel_add").click(function(event) {
    $("#zengcang").css('display', 'none');
});
$("#cancel_sub").click(function(event) {
    $("#jiancang").css('display', 'none');
});
$("#cancel_cancel").click(function(event) {
    $("#chedan").css('display', 'none');
});
$("#cancel_deal").click(function(event) {
    $("#deal").css('display', 'none');
});
$("#schat").click(function(event) {
    $(this).text('所有人');
    chat = null;
});
var HiChat = function() {
    this.socket = null;
};
HiChat.prototype = {
    init: function() {
        var that = this;
        this.socket = io.connect();
        this.socket.on('who', function() {
            that.socket.emit('who', __info);

        });
        // this.socket.on('refresh', function() {
        //     window.location.reload();
        // })
        this.socket.on('passed', function(x) {
            $('#pass_btn' + x).hide();
        });
        this.socket.on('login', function(user) {
            __users.push(user);
            //update index
            var i;
            for (i = 0; i < __idx.length; ++i) {
                if (user.group > __users[__idx[i]].group) break;
            }
            __idx.splice(i, -1, __idx.length);

            /*
            var index;
            for (var i = 0; i < __users.length; i++) {
                if(user.group>=__users[i].group)
                    index = i;
                break;
            };
            __users.splice(index,-1,user);
            */
            var color = user.group >= 90 ? "#FF0000" : "#FFF";
            if (i == 0) $("#userdd").find('li').eq(0).before("<li style='padding-top:5px;padding-bottom:5px;margin-left:10px;'><a onclick='chatTo(" + user.id + "," + '"' + user.display + '"' + ")' ><img src='img/admin.png'><span style='color:" + color + ";'>" + user.display + "</span></a></li>");
            else $("#userdd").find('li').eq(i - 1).after("<li style='padding-top:5px;padding-bottom:5px;margin-left:10px;'><a onclick='chatTo(" + user.id + "," + '"' + user.display + '"' + ")' ><img src='img/admin.png'><span style='color:" + color + ";'>" + user.display + "</span></a></li>");
            $("#status").text(__users.length);

        });
        this.socket.on('room', function(alluser) {
            $("#userdd").find('li').remove();
            __users = alluser;
            __idx = [];
            for (var i = 0; i < __users.length; i++) {
                __idx.push(i);
            }
            __idx.sort(function(a, b) {
                return __users[b].group - __users[a].group
            });
            //__users.sort(function(a,b){return b.group-a.group;})
            for (var t = 0; t < __users.length; t++) {
                i = __idx[t];
                var color = __users[i].group >= 90 ? "#FF0000" : "#FFF";
                $("#userdd").append("<li style='padding-top:5px;padding-bottom:5px;margin-left:10px;'><a onclick='chatTo(" + __users[i].id + "," + '"' + __users[i].display + '"' + ")'  ><img src='img/admin.png'><span style='color:" + color + ";'>" + __users[i].display + "</span></a></li>");
            };

        });
        /*
        this.socket.on('connect', function() {
            __users = [];
        });
        this.socket.on('disconnect', function() {
            __users = [];
        });*/
        this.socket.on('logout', function(idx) {
            __users.splice(idx, 1);
            var x = __idx.indexOf(idx);
            $("#userdd").find('li').eq(x).remove();
            $("#status").text(__users.length);
            __idx.splice(x, 1);
            for (i = 0; i < __idx.length; ++i) {
                if (__idx[i] > idx) __idx[i]--;
            }
        });
        this.socket.on('kick', function() {
            $.ajax({
                    url: '/api/logout',
                    type: 'POST',
                    dataType: 'json',

                })
                .done(function() {
                    window.location.href = "/login.html";
                });

        });
        // this.socket.on('newMsg', function(user, msg, color) {
        //     that._displayNewMsg(user, msg, color);
        // });
        // this.socket.on('newImg', function(user, img, color) {
        //     that._displayImage(user, img, color);
        // });

        $("#bill").click(function(event) {
            var category = $("input[name='pro']:checked").val();
            var product = $("input[name='billtype']:checked").val();
            var type = $("input[name='kaicang']:checked").val();

            var openPrice = $("#openPrice").val().trim() || '';
            var checkUpPrice = $("#checkUpPrice").val().trim() || '';
            var checkLowPrice = $("#checkLowPrice").val().trim() || '';
            var createTime = new Date();
            var lobby = $("input[name='send']:checked").length === 2;
            var bill = {
                //id:
                from: __info.id,
                category: category,
                product: product,
                lobby: lobby, //附送大厅,
                // moreless: /more/.test(type), //现价买多
                // hang:/hang/.test(type),
                type: type,
                openPrice: openPrice,
                checkUpPrice: checkUpPrice,
                checkLowPrice: checkLowPrice,
                operation: 'open', //open,
                createTime: createTime
            }
            $.ajax({
                    url: '/api/bill',
                    type: 'POST',
                    dataType: 'json',
                    data: bill,
                })
                .done(function(data) {
                    $("input[name='pro']:checked").attr('checked', '');;
                    $("input[name='billtype']:checked").attr('checked', '');;
                    $("input[name='kaicang']:checked").attr('checked', '');;

                    $("#openPrice").val(' ');
                    $("#checkUpPrice").val(' ');
                    $("#checkLowPrice").val(' ');
                    $("#billtable").DataTable().row.add(data).draw();

                });


            // that.socket.emit('bill', bill);
        });
        this.socket.on('bill', function(data) {

            if (data.succ == 0) {
                if (data.msg) {

                } else {
                    if (!data.finnishTime) data.finnishTime = data.createTime;
                    var date = data.finnishTime.split(' ')[1];
                    //var endDate = data[i].finnishTime.split(' ')[1];
                    var from = data.from;
                    var product = data.product;
                    // var moreless = data.moreless ? '做多' : '做空';
                    // var hang = data.hang ? '挂单' : '现金';
                    var type = data.type;
                    var type_format = /空/.test(type) ? '空单' : '多单';
                    var operation = data.state;
                    var checkUpPrice = data.checkUpPrice;
                    var checkLowPrice = data.checkLowPrice;
                    var finnishPrice = data.finnishPrice;
                    var openPrice = data.openPrice;
                    // var lobby = data.lobby;
                    var reason = data.reason;
                    var id = data.id;
                    var word, fword;
                    if (finnishPrice == checkUpPrice) {
                        word = "止盈平仓";
                        fword = "止盈减仓";
                    } else if (finnishPrice == checkLowPrice) {
                        word = "止损平仓";
                        fword = "止损减仓";
                    }
                    if (operation === '开仓') {
                        //$("#home").append("<p style='font-size:14px;'><span style='font-size:14px;color:#A73CC2;'>【" + from + "】</span>建议，【单号】：" + id + "，<span style='font-weight:600;font-size:14px;color:red;'>" + type + "</span>" + date + "<br><span style='font-weight:600;'>" + product + "</span>" + "，【开仓价】:<span style='color:red;'>" + openPrice + "</span>，建议【止盈价】：<span style='color:red;'>" + checkUpPrice + "</span>，建议【止损价】：<span style='color:red;'>" + checkLowPrice + "</span><br><span style='font-size:8px;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
                        $("#home").append("<p style='font-size:12px;'><span style='font-size:12px;color:#A73CC2;'>【" + from + "】</span>建议，【单号】：" + id + "<span style='font-weight:600;font-size:14px;color:red;'>" + "&nbsp&nbsp" + type + "&nbsp&nbsp" + "</span>" + date + "<br><span style='font-size:14px;font-weight:600;'>" + product + "&nbsp&nbsp" + "</span>" + "【开仓价】:<span style='font-size:14px;color:red;font-weight:600;'>" + openPrice + "</span>，建议【止盈价】：<span style='font-size:14px;color:red;font-weight:600;'>" + checkUpPrice + "</span>，建议【止损价】：<span style='color:red;font-weight:600;font-size:16px;'>" + checkLowPrice + "</span><br><span style='font-size:6px;color:grey;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
                        document.getElementById('home').scrollTop = document.getElementById('home').scrollHeight;
                        document.getElementById('resize').scrollTop = document.getElementById('resize').scrollHeight;
                        $("audio").attr('src', 'img/handan.mp3');
                        $("marquee").html("【喊单提醒】" + date + "【" + from + "】发布：【单号】：" + id + "，建议" + product + "&nbsp&nbsp" + type + "&nbsp&nbsp" + "，【开仓价】:" + openPrice + "，【止盈价】：" + checkUpPrice + "，【止损价】：" + checkLowPrice + "(以上建议仅供参考，投资有风险，操作需谨慎)");
                    }
                    if (operation === '增仓') {
                        //$("#home").append("<p style='font-size:14px;'><span style='font-size:14px;color:#A73CC2;'>【" + from + "】</span>建议，【单号】：" + id + "，<span style='font-weight:600;font-size:14px;color:red;'>" + type + "</span>，" + date + "<br><span style='font-weight:600;'>" + product + "</span>" + "，【增仓价】:<span style='color:red;'>" + openPrice + "</span>，建议【止盈价】：<span style='color:red;'>" + checkUpPrice + "</span>，建议【止损价】：<span style='color:red;'>" + checkLowPrice + "</span><br><span style='font-size:8px;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
                        $("#home").append("<p style='font-size:12px;'><span style='font-size:12px;color:#A73CC2;'>【" + from + "】</span>建议，【单号】：" + id + "<span style='font-weight:600;font-size:14px;color:red;'>" + "&nbsp&nbsp" + type + "&nbsp&nbsp" + "</span>，" + date + "<br><span style='font-size:14px;font-weight:600;'>" + product + "&nbsp&nbsp" + "</span>" + "【增仓价】:<span style='font-size:14px;color:red;font-weight:600;'>" + openPrice + "</span>，建议【止盈价】：<span style='font-size:14px;color:red;font-weight:600;'>" + checkUpPrice + "</span>，建议【止损价】：<span style='color:red;font-weight:600;font-size:14px;'>" + checkLowPrice + "</span><br><span style='font-size:6px;color:grey;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
                        document.getElementById('home').scrollTop = document.getElementById('home').scrollHeight;
                        document.getElementById('resize').scrollTop = document.getElementById('resize').scrollHeight;
                        $("audio").attr('src', 'img/handan.mp3');
                        $("marquee").html("【喊单提醒】" + date + "【" + from + "】发布：【单号】：" + id + "，建议" + product + "&nbsp&nbsp" + type + "&nbsp&nbsp" + "，【增仓价】:" + openPrice + "，【止盈价】：" + checkUpPrice + "，【止损价】：" + checkLowPrice + "(以上建议仅供参考，投资有风险，操作需谨慎)");
                    }
                    if (operation === '减仓') {
                        //$("#home").append("<p style='font-size:14px;'><span style='font-size:14px;color:#A73CC2;'>【" + from + "】</span>建议，【单号】：" + id + "，<span style='font-weight:600;font-size:14px;color:red;'>" + type + "</span>，" + date + "<br><span style='font-weight:600;'>" + product + "</span>" + "，【减仓价】:<span style='color:red;'>" + openPrice + "</span>，建议【止盈价】：<span style='color:red;'>" + checkUpPrice + "</span>，建议【止损价】：<span style='color:red;'>" + checkLowPrice + "</span><br><span style='font-size:8px;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
                        //$("#home").append("<p style='font-size:14px;'><span style='font-size:14px;color:#A73CC2;'>【" + from + "】</span>建议，【单号】：" + id + "<span style='font-weight:600;font-size:16px;color:red;'>" +"&nbsp&nbsp"+ type +"&nbsp&nbsp"+ "</span>，" + date + "<br><span style='font-size:16px;font-weight:600;'>" + product +"&nbsp&nbsp"+ "</span>" + "【减仓价】:<span style='font-size:16px;color:red;font-weight:600;'>" + openPrice + "</span>，建议【止盈价】：<span style='font-size:16px;color:red;font-weight:600;'>" + checkUpPrice + "</span>，建议【止损价】：<span style='color:red;font-weight:600;font-size:16px;'>" + checkLowPrice + "</span><br><span style='font-size:6px;color:grey;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
                        $("#home").append("<p style='font-size:12px;'><span style='font-size:12px;color:#A73CC2;'>【" + from + "】</span>建议，【单号】：" + id + "<span style='font-weight:600;font-size:14px;color:red;'>" + "&nbsp&nbsp" + fword + "&nbsp&nbsp" + type_format + "</span>，" + date + "<br><span style='font-size:14px;font-weight:600;'>" + product + "&nbsp&nbsp" + "</span>" + "建议【减仓价】:<span style='font-size:14px;color:red;font-weight:600;'>" + finnishPrice + "</span><br><span style='font-size:6px;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
                        document.getElementById('home').scrollTop = document.getElementById('home').scrollHeight;
                        document.getElementById('resize').scrollTop = document.getElementById('resize').scrollHeight;
                        $("audio").attr('src', 'img/handan.mp3');
                        $("marquee").html("【喊单提醒】" + date + "【" + from + "】发布：【单号】：" + id + "，建议" + product + "&nbsp&nbsp" + type + "&nbsp&nbsp" + "，【减仓价】:" + openPrice + "，【止盈价】：" + checkUpPrice + "，【止损价】：" + checkLowPrice + "(以上建议仅供参考，投资有风险，操作需谨慎)");
                    }
                    if (operation === '平仓') {
                        //$("#home").append("<p style='font-size:14px;'><span style='font-size:14px;color:#A73CC2;'>【" + from + "】</span>建议，【单号】：" + id + "，<span style='font-weight:600;font-size:14px;color:red;'>" + word + type_format + "</span>，" + date + "<br><span style='font-weight:600;'>" + product + "</span>" + "，建议【平仓价】:<span style='color:red;'>" + finnishPrice + "</span><br><span style='font-size:8px;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
                        $("#home").append("<p style='font-size:12px;'><span style='font-size:12px;color:#A73CC2;'>【" + from + "】</span>建议，【单号】：" + id + "<span style='font-weight:600;font-size:14px;color:red;'>" + "&nbsp&nbsp" + word + "&nbsp&nbsp" + type_format + "</span>，" + date + "<br><span style='font-size:14px;font-weight:600;'>" + product + "&nbsp&nbsp" + "</span>" + "建议【平仓价】:<span style='font-size:14px;color:red;font-weight:600;'>" + finnishPrice + "</span><br><span style='font-size:6px;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
                        document.getElementById('home').scrollTop = document.getElementById('home').scrollHeight;
                        document.getElementById('resize').scrollTop = document.getElementById('resize').scrollHeight;
                        $("audio").attr('src', 'img/handan.mp3');
                        $("marquee").html("【喊单提醒】" + date + "【" + from + "】发布：【单号】：" + id + "，建议" + product + "&nbsp&nbsp" + type + "&nbsp&nbsp" + "，【平仓价】:" + finnishPrice + "(以上建议仅供参考，投资有风险，操作需谨慎)");
                    }
                    if (operation === '挂单') {
                        //$("#home").append("<p style='font-size:14px;'><span style='font-size:14px;color:#A73CC2;'>【" + from + "】</span>建议，【单号】：" + id + "，<span style='font-weight:600;font-size:14px;color:red;'>" + type + "</span>，" + date + "<br><span style='font-weight:600;'>" + product + "</span>" + "，【开仓价】:<span style='color:red;'>" + openPrice + "</span>，建议【止盈价】：<span style='color:red;'>" + checkUpPrice + "</span>，建议【止损价】：<span style='color:red;'>" + checkLowPrice + "</span><br><span style='font-size:8px;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
                        $("#home").append("<p style='font-size:12px;'><span style='font-size:12px;color:#A73CC2;'>【" + from + "】</span>建议，【单号】：" + id + "<span style='font-weight:600;font-size:14px;color:red;'>" + "&nbsp&nbsp" + type + "&nbsp&nbsp" + "</span>，" + date + "<br><span style='font-size:14px;font-weight:600;'>" + product + "&nbsp&nbsp" + "</span>" + "【开仓价】:<span style='font-size:14px;color:red;font-weight:600;'>" + openPrice + "</span>，建议【止盈价】：<span style='font-size:14px;color:red;font-weight:600;'>" + checkUpPrice + "</span>，建议【止损价】：<span style='color:red;font-weight:600;font-size:14px;'>" + checkLowPrice + "</span><br><span style='font-size:6px;color:grey;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
                        document.getElementById('home').scrollTop = document.getElementById('home').scrollHeight;
                        document.getElementById('resize').scrollTop = document.getElementById('resize').scrollHeight;
                        $("audio").attr('src', 'img/handan.mp3');
                        $("marquee").html("【喊单提醒】" + date + "【" + from + "】发布：【单号】：" + id + "，建议" + product + "&nbsp&nbsp" + type + "&nbsp&nbsp" + "，【挂单价】:" + openPrice + "，【止盈价】：" + checkUpPrice + "，【止损价】：" + checkLowPrice + "(以上建议仅供参考，投资有风险，操作需谨慎)");

                    }
                    if (operation === '挂单成交') {
                        //$("#home").append("<p style='font-size:14px;'><span style='font-size:14px;color:#A73CC2;'>【" + from + "】</span>建议，【单号】：" + id + "，<span style='font-weight:600;font-size:14px;color:red;'>挂单成交</span>，" + date + "<br><span style='font-weight:600;'>" + product + "</span>建议" + type + "，【开仓价】:<span style='color:red;'>" + openPrice + "</span>，建议【止盈价】：<span style='color:red;'>" + checkUpPrice + "</span>，建议【止损价】：<span style='color:red;'>" + checkLowPrice + "</span><br><span style='font-size:8px;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
                        $("#home").append("<p style='font-size:12px;'><span style='font-size:12px;color:#A73CC2;'>【" + from + "】</span>建议，【单号】：" + id + "<span style='font-weight:600;font-size:14px;color:red;'>&nbsp&nbsp挂单成交</span>，" + date + "<br><span style='font-size:14px;font-weight:600;'>" + product + "&nbsp&nbsp" + "</span>建议" + type + "【开仓价】:<span style='font-size:14px;color:red;font-weight:600;'>" + openPrice + "</span>，建议【止盈价】：<span style='font-size:14px;color:red;font-weight:600;'>" + checkUpPrice + "</span>，建议【止损价】：<span style='color:red;font-weight:600;font-size:14px;'>" + checkLowPrice + "</span><br><span style='font-size:6px;color:grey;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
                        document.getElementById('home').scrollTop = document.getElementById('home').scrollHeight;
                        document.getElementById('resize').scrollTop = document.getElementById('resize').scrollHeight;
                        $("audio").attr('src', 'img/handan.mp3');
                        $("marquee").html("【喊单提醒】" + date + "【" + from + "】发布：【单号】：" + id + "，建议" + product + "&nbsp&nbsp" + type + "&nbsp&nbsp" + "，【挂单成交价】:" + openPrice + "，【止盈价】：" + checkUpPrice + "，【止损价】：" + checkLowPrice + "(以上建议仅供参考，投资有风险，操作需谨慎)");
                    }
                    if (operation === '撤单') {
                        //$("#home").append("<p style='font-size:14px;'><span style='font-size:14px;color:#A73CC2;'>【" + from + "】</span>建议，【单号】：" + id + "，<span style='font-weight:600;font-size:14px;color:red;'></span>，" + date + "<br><span style='font-weight:600;'>" + product + "</span>，【撤单】：撤单理由" + reason + +"<span style='font-size:8px;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
                        $("#home").append("<p style='font-size:12px;'><span style='font-size:12px;color:#A73CC2;'>【" + from + "】</span>建议，【单号】：" + id + "<span style='font-weight:600;font-size:14px;color:red;'></span>，" + date + "<br><span style='font-size:14px;font-weight:600;'>" + product + "&nbsp&nbsp" + "</span>【撤单】：撤单理由" + reason + "<br/><span style='font-size:6px;color:grey;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
                        document.getElementById('home').scrollTop = document.getElementById('home').scrollHeight;
                        document.getElementById('resize').scrollTop = document.getElementById('resize').scrollHeight;
                        $("audio").attr('src', 'img/handan.mp3');
                        $("marquee").html("【喊单提醒】" + date + "【" + from + "】发布：【单号】：" + id + "，建议" + product + "&nbsp&nbsp" + type + "&nbsp&nbsp" + "，【撤单】：撤单理由" + reason + "(以上建议仅供参考，投资有风险，操作需谨慎)");
                    }
                }
            } else {
                alert(data.msg);
            }
        });
        this.socket.on('speaker', function(data) {
            var speak = data.display;
            var msg = data.msg;
            var time = data.createTime.split(' ')[1];
            //$("#home").append("<p style='font-size:14px;'>【<span style='color:#A73CC2'>" + speak + "</span>】建议，【<span style='color:blue;'>行情提醒</span>】" + time + "<br>" + msg + "<br><span style='font-size:8px;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
            $("#home").append("<p style='font-size:12px;'>【<span style='font-size:12px;color:#A73CC2'>" + speak + "</span>】建议，【<span style='font-size:12px;color:blue;'>行情提醒:</span>】" + time + "<br>" + "<span style='font-size:14px;'>" + msg + "</span>" + "<br><span style='font-size:6px;color:grey;'>(以上建议仅供参考，投资有风险，操作需谨慎)</span></p>");
            $("audio").attr('src', 'img/ding.mp3');
            $("marquee").html("【行情提醒】" + time + "【" + speak + "】：" + msg);
            document.getElementById('home').scrollTop = document.getElementById('home').scrollHeight;
            document.getElementById('resize').scrollTop = document.getElementById('resize').scrollHeight;

        });
        $("#power").unbind('click').click(function(event) {
            that.socket.emit('power');

        });
        this.socket.on('power', function(power_on) {
            if (power_on.now) $("#power").text('全屏蔽');
            else $("#power").text('解除屏蔽');
        })
        document.getElementById('sendBtn').addEventListener('click', function() {
            var msg = $("#messageInput").val()
                // var messageInput = document.getElementById('messageInput'),
                //     msg = messageInput.value,
                // color = document.getElementById('colorStyle').value;
            var whisper;
            if ($("input[name='qiaoqiao']:checked").length != 0) {
                whisper = true;
            } else if ($("input[name='qiaoqiao']:checked").length == 0) {
                whisper = false;
            }
            $("#messageInput").val('');
            $("#messageInput").focus();
            if (msg.trim().length != 0) {
                if (chat != null) {
                    var message = {
                            from: __info.id,
                            to: chat,
                            createTime: new Date(),
                            context: msg, //.replace(/&/g,'&amp;')
                            // .replace(/"/g,'&quot;')
                            // .replace(/'/g,'&#39;')
                            // .replace(/</g,'&lt;')
                            // .replace(/>/g,'&gt;'),
                            whisper: whisper
                        }
                        // that.socket.emit('msg', message);
                } else {
                    var message = {
                        from: __info.id,
                        createTime: new Date(),
                        context: msg, //.replace(/&/g,'&amp;')
                        // .replace(/"/g,'&quot;')
                        // .replace(/'/g,'&#39;')
                        // .replace(/</g,'&lt;')
                        // .replace(/>/g,'&gt;'),
                        whisper: whisper
                    };
                }
                console.log(msg.context);
                that.socket.emit('pre_msg', message);
                return;
            };
        }, false);
        if (document.getElementById('ding')) {
            document.getElementById('ding').addEventListener('click', function() {
                var msg = $("#messageInput").val();
                var lobby;
                $("#messageInput").val('');
                if ($("input[name='lobby']:checked").length != 0) {
                    lobby = true;
                } else if ($("input[name='lobby']:checked").length == 0) {
                    lobby = false;
                }
                if (msg.trim().length != 0) {
                    var message = {
                        from: __info.id,
                        createTime: new Date(),
                        context: msg,
                        lobby: lobby
                    };

                    that.socket.emit('speaker', message);
                    // that._displayNewMsg('我', msg, color);
                };

            }, false);

        };
        this.socket.on('pre_msg', function(msg) {
            var from = msg.from_display;
            // var to = __users[msg.to_idx].display||'大家';
            var to = '大家';
            if (msg.to_display) to = msg.to_display;
            var color = msg.warning ? "red" : "#fff";
            var a = new Date();
            var date = a.toString().substr(15, 9);
            if (msg.to == __info.id) {
                $("#historyMsg1").append("<p><span style='background-color:#505050;color:#fff;padding:3px 5px 3px 5px;margin-right:5px;border-radius: 5px;'>" + date + "</span><a tabindex='0' role='button' data-trigger='focus' data-toggle='popover' data-placement='right'><span style='padding:3px 5px 3px 5px;background-color:green;color:#fff;border-radius: 5px;font-size:12px;'>" + from + "</span></a>对<span style='padding:3px 5px 3px 5px;background-color:green;color:#fff;border-radius: 5px;font-size:12px;'>我</span>：<span style='padding:3px 5px 3px 5px;background-color:" + color + ";font-size:12px;border-radius: 5px;'>" + "<a style='text-decoration:none;color:#000;' onclick='schatTo(" + msg.from + ",\"" + from + "\")'>" + msg.context + "</a>" + "</span><span class='btn btn-sm btn-info pass' id='pass_btn" + msg.id + "'>通过</span></p>");
                document.getElementById('historyMsg1').scrollTop = document.getElementById('historyMsg1').scrollHeight;
                // document.getElementById('home1').scrollBottom = document.getElementById('home1').scrollHeight;
                // document.getElementById('minh').scrollTop = document.getElementById('minh').scrollHeight;
                $(function() {
                    $('[data-toggle="popover"]').popover({
                        html: true,
                        content: "<li><a onclick='schatTo(" + msg.from + ",\"" + from + "\")'>跟我聊天</a></li><li><a onclick='banmsg(" + msg.from + ",\"" + from + "\")'>屏蔽消息</a></li><li><a onclick='banspeak(" + msg.from + ",\"" + from + "\")'>禁言</a></li><li><a data-toggle='modal' data-target='#myModal12' onclick='sendgift(" + msg.from + ",\"" + from + "\")'>送礼物</a></li>"
                    })
                })
            } else {
                $("#historyMsg").append("<p><span style='background-color:#505050;color:#fff;padding:3px 5px 3px 5px;margin-right:5px;border-radius: 5px;'>" + date + "</span><a tabindex='0' role='button' data-trigger='focus' data-toggle='popover'  data-placement='right'><span style='padding:3px 5px 3px 5px;background-color:green;color:#fff;border-radius: 5px;font-size:12px;'>" + from + "</span></a> 对 <span  style='padding:3px 5px 3px 5px;background-color:green;color:#fff;border-radius: 5px;font-size:12px;'>" + to + "</span> ：<span style='padding:3px 5px 3px 5px;background-color:" + color + ";font-size:12px;border-radius: 5px;'>" + "<a style='text-decoration:none;color:#000;' onclick='schatTo(" + msg.from + ",\"" + from + "\")'>" + msg.context + "</a>" + "</span><span class='btn btn-sm btn-info pass' id='pass_btn" + msg.id + "'+>通过</span></p>");
                document.getElementById('historyMsg').scrollTop = document.getElementById('historyMsg').scrollHeight;
                $(function() {
                    $('[data-toggle="popover"]').popover({
                        html: true,
                        content: "<li><a onclick='schatTo(" + msg.from + ",\"" + from + "\")'>跟我聊天</a></li><li><a onclick='banmsg(" + msg.from + ",\"" + from + "\")'>屏蔽消息</a></li><li><a onclick='banspeak(" + msg.from + ",\"" + from + "\")'>禁言</a></li><li><a data-toggle='modal' data-target='#myModal12' onclick='sendgift(" + msg.from + ",\"" + from + "\")'>送礼物</a></li>"
                    })
                })
            }
            $("#pass_btn" + msg.id).unbind('click').click(function() {
                that.socket.emit('msg', msg.id);
                $(this).remove();

            });
        });
        this.socket.on('msg', function(msg) {
            var from = msg.from_display;
            // var to = __users[msg.to_idx].display||'大家';
            var to = '大家';
            if (msg.to_display) to = msg.to_display;
            var color = msg.warning ? "red" : "#fff";
            var a = new Date();
            var date = a.toString().substr(15, 9);
            if (msg.to == __info.id || msg.whisper) {
                if (msg.whisper) qiaoqiao = "悄悄";
                else qiaoqiao = ' ';
                if (msg.to == __info.id) to = "我";
                if (msg.to == __info.id || msg.from == __info.id)
                    if (isAdminstrator(from))
                        $("#historyMsg1").append("<p><span style='background-color:#505050;color:#fff;padding:3px 5px 3px 5px;margin-right:5px;border-radius: 5px;'>" + date + "</span><a tabindex='0' role='button' data-trigger='focus' data-toggle='popover'  data-placement='right'><span style='padding:3px 5px 3px 5px;background-color:green;color:#fff;border-radius: 5px;font-size:12px;'>" + from + "</span></a> " + qiaoqiao + "对 <span  style='padding:3px 5px 3px 5px;background-color:green;color:#fff;border-radius: 5px;font-size:12px;'>" + to + "</span> ：<span style='padding:3px 5px 3px 5px;background-color:" + color + ";font-size:12px;border-radius: 5px; '>" + "<a style='text-decoration:none;color:#FF0000;' onclick='schatTo(" + msg.from + ",\"" + from + "\")'>" + msg.context + "</a>" + "</span></p>");
                    else
                        $("#historyMsg1").append("<p><span style='background-color:#505050;color:#fff;padding:3px 5px 3px 5px;margin-right:5px;border-radius: 5px;'>" + date + "</span><a tabindex='0' role='button' data-trigger='focus' data-toggle='popover'  data-placement='right'><span style='padding:3px 5px 3px 5px;background-color:green;color:#fff;border-radius: 5px;font-size:12px;'>" + from + "</span></a> " + qiaoqiao + "对 <span  style='padding:3px 5px 3px 5px;background-color:green;color:#fff;border-radius: 5px;font-size:12px;'>" + to + "</span> ：<span style='padding:3px 5px 3px 5px;background-color:" + color + ";font-size:12px;border-radius: 5px;'>" + "<a style='text-decoration:none;color:#000;' onclick='schatTo(" + msg.from + ",\"" + from + "\")'>" + msg.context + "</a>" + "</span></p>");
                document.getElementById('historyMsg1').scrollTop = document.getElementById('historyMsg1').scrollHeight;
                $(function() {
                    var content = "<li><a onclick='schatTo(" + msg.from + ",\"" + from + "\")'>跟我聊天</a></li>";
                    if (__info.group >= 90)
                        content += "<li><a onclick='banmsg(" + msg.from + ",\"" + from + "\")'>屏蔽消息</a></li><li><a onclick='banspeak(" + msg.from + ",\"" + from + "\")'>禁言</a></li><li><a data-toggle='modal' data-target='#myModal12' onclick='sendgift(" + msg.from + ",\"" + from + "\")'>送礼物</a></li>";
                    $('[data-toggle="popover"]').popover({
                        html: true,
                        //   content: "<li><a onclick='schatTo(" + msg.from + ",\"" + from + "\")'>跟我聊天</a></li><li><a onclick='banmsg(" + msg.from + ",\"" + from + "\")'>屏蔽消息</a></li><li><a onclick='banspeak(" + msg.from + ",\"" + from + "\")'>禁言</a></li><li><a data-toggle='modal' data-target='#myModal12' onclick='sendgift(" + msg.from + ",\"" + from + "\")'>送礼物</a></li>"
                        content: content
                    })
                })
            } else {
                if (isAdminstrator(from))
                    $("#historyMsg").append("<p><span style='background-color:#505050;color:#fff;padding:3px 5px 3px 5px;margin-right:5px;border-radius: 5px;'>" + date + "</span><a tabindex='0' role='button' data-trigger='focus' data-toggle='popover'  data-placement='right'><span style='padding:3px 5px 3px 5px;background-color:green;color:#fff;border-radius: 5px;font-size:12px;'>" + from + "</span></a> 对 <span  style='padding:3px 5px 3px 5px;background-color:green;color:#fff;border-radius: 5px;font-size:12px;'>" + to + "</span> ：<span style='padding:3px 5px 3px 5px;background-color:" + color + ";font-size:12px;border-radius: 5px;'>" + "<a style='text-decoration:none;color:#FF0000;' onclick='schatTo(" + msg.from + ",\"" + from + "\")'>" + msg.context + "</a>" + "</span></p>");
                else
                    $("#historyMsg").append("<p><span style='background-color:#505050;color:#fff;padding:3px 5px 3px 5px;margin-right:5px;border-radius: 5px;'>" + date + "</span><a tabindex='0' role='button' data-trigger='focus' data-toggle='popover'  data-placement='right'><span style='padding:3px 5px 3px 5px;background-color:green;color:#fff;border-radius: 5px;font-size:12px;'>" + from + "</span></a> 对 <span  style='padding:3px 5px 3px 5px;background-color:green;color:#fff;border-radius: 5px;font-size:12px;'>" + to + "</span> ：<span style='padding:3px 5px 3px 5px;background-color:" + color + ";font-size:12px;border-radius: 5px;'>" + "<a style='text-decoration:none;color:#000;' onclick='schatTo(" + msg.from + ",\"" + from + "\")'>" + msg.context + "</a>" + "</span></p>");
                $(function() {
                    var content = "<li><a onclick='schatTo(" + msg.from + ",\"" + from + "\")'>跟我聊天</a></li>";
                    if (__info.group >= 90)
                        content += "<li><a onclick='banmsg(" + msg.from + ",\"" + from + "\")'>屏蔽消息</a></li><li><a onclick='banspeak(" + msg.from + ",\"" + from + "\")'>禁言</a></li><li><a data-toggle='modal' data-target='#myModal12' onclick='sendgift(" + msg.from + ",\"" + from + "\")'>送礼物</a></li>";
                    $('[data-toggle="popover"]').popover({
                        html: true,
                        //   content: "<li><a onclick='schatTo(" + msg.from + ",\"" + from + "\")'>跟我聊天</a></li><li><a onclick='banmsg(" + msg.from + ",\"" + from + "\")'>屏蔽消息</a></li><li><a onclick='banspeak(" + msg.from + ",\"" + from + "\")'>禁言</a></li><li><a data-toggle='modal' data-target='#myModal12' onclick='sendgift(" + msg.from + ",\"" + from + "\")'>送礼物</a></li>"
                        content: content
                    })
                })


            }
            document.getElementById('historyMsg').scrollTop = document.getElementById('historyMsg').scrollHeight;

        });
        document.getElementById('messageInput').addEventListener('keyup', function(e) {
            msg = $("#messageInput").val()
                // var messageInput = document.getElementById('messageInput'),
                //     msg = messageInput.value,
                // color = document.getElementById('colorStyle').value;
            $("#messageInput").focus();
            var whisper;
            if ($("input[name='qiaoqiao']:checked").length != 0) {
                whisper = true;
            } else if ($("input[name='qiaoqiao']:checked").length == 0) {
                whisper = false;
            }
            if (e.keyCode == 13 && msg.trim().length != 0) {
                messageInput.value = '';
                if (chat != null) {
                    var message = {
                        from: __info.id,
                        to: chat,
                        createTime: new Date(),
                        context: msg, //.replace(/&/g,'&amp;')
                        // .replace(/"/g,'&quot;')
                        // .replace(/'/g,'&#39;')
                        // .replace(/</g,'&lt;')
                        // .replace(/>/g,'&gt;'),
                        whisper: whisper
                    }
                } else {
                    var message = {
                        from: __info.id,
                        createTime: new Date(),
                        context: msg, //.replace(/&/g,'&amp;')
                        // .replace(/"/g,'&quot;')
                        // .replace(/'/g,'&#39;')
                        // .replace(/</g,'&lt;')
                        // .replace(/>/g,'&gt;'),
                        whisper: whisper
                    };

                }

                that.socket.emit('pre_msg', message);
                // that._displayNewMsg('我', msg, color);
            };
        }, false);
        document.getElementById('clearBtn').addEventListener('click', function() {
            document.getElementById('historyMsg').innerHTML = '';
            document.getElementById('historyMsg1').innerHTML = '';
        }, false);
        // document.getElementById('sendImage').addEventListener('change', function() {
        //     if (this.files.length != 0) {
        //         var file = this.files[0],
        //             reader = new FileReader(),
        //             color = document.getElementById('colorStyle').value;
        //         if (!reader) {
        //             that._displayNewMsg('system', '!your browser doesn\'t support fileReader', 'red');
        //             this.value = '';
        //             return;
        //         };
        //         reader.onload = function(e) {
        //             this.value = '';
        //             that.socket.emit('img', e.target.result, color);
        //             that._displayImage('我', e.target.result, color);
        //         };
        //         reader.readAsDataURL(file);
        //     };
        // }, false);
        // this._initialEmoji();
        // document.getElementById('emoji').addEventListener('click', function(e) {
        //     var emojiwrapper = document.getElementById('emojiWrapper');
        //     emojiwrapper.style.display = 'block';
        //     e.stopPropagation();
        // }, false);
        // document.body.addEventListener('click', function(e) {
        //     var emojiwrapper = document.getElementById('emojiWrapper');
        //     if (e.target != emojiwrapper) {
        //         emojiwrapper.style.display = 'none';
        //     };
        // });
        document.getElementById('emojiWrapper').addEventListener('click', function(e) {
            var target = e.target;
            if (target.nodeName.toLowerCase() == 'img') {
                var messageInput = document.getElementById('messageInput');
                messageInput.focus();
                messageInput.value = messageInput.value + '[emoji:' + target.title + ']';
            };
        }, false);
    },
    // _initialEmoji: function() {
    //     var emojiContainer = document.getElementById('emojiWrapper'),
    //         docFragment = document.createDocumentFragment();
    //     for (var i = 69; i > 0; i--) {
    //         var emojiItem = document.createElement('img');
    //         emojiItem.src = '../content/emoji/' + i + '.gif';
    //         emojiItem.title = i;
    //         docFragment.appendChild(emojiItem);
    //     };
    //     emojiContainer.appendChild(docFragment);
    // },
    // _displayNewMsg: function(user, msg, color) {
    //     var container = document.getElementById('historyMsg'),
    //         msgToDisplay = document.createElement('p'),
    //         date = new Date().toTimeString().substr(0, 8),
    //         //determine whether the msg contains emoji
    //         msg = this._showEmoji(msg);
    //     msgToDisplay.style.color = color || '#000';
    //     msgToDisplay.innerHTML = user + '<span class="timespan">(' + date + '): </span>' + msg;
    //     container.appendChild(msgToDisplay);
    //     container.scrollTop = container.scrollHeight;
    // },
    // _displayImage: function(user, imgData, color) {
    //     var container = document.getElementById('historyMsg'),
    //         msgToDisplay = document.createElement('p'),
    //         date = new Date().toTimeString().substr(0, 8);
    //     msgToDisplay.style.color = color || '#000';
    //     msgToDisplay.innerHTML = user + '<span class="timespan">(' + date + '): </span> <br/>' + '<a href="' + imgData + '" target="_blank"><img src="' + imgData + '"/></a>';
    //     container.appendChild(msgToDisplay);
    //     container.scrollTop = container.scrollHeight;
    // },
    // _showEmoji: function(msg) {
    //     var match, result = msg,
    //         reg = /\[emoji:\d+\]/g,
    //         emojiIndex,
    //         totalEmojiNum = document.getElementById('emojiWrapper').children.length;
    //     while (match = reg.exec(msg)) {
    //         emojiIndex = match[0].slice(7, -1);
    //         if (emojiIndex > totalEmojiNum) {
    //             result = result.replace(match[0], '[X]');
    //         } else {
    //             result = result.replace(match[0], '<img class="emoji" src="../content/emoji/' + emojiIndex + '.gif" />'); //todo:fix this in chrome it will cause a new request for the image
    //         };
    //     };
    //     return result;
    // }
};
