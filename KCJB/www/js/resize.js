window.onresize=function(){
	$("#resize").height(document.documentElement.clientHeight-555+'px');
	$("#userh").height(document.documentElement.clientHeight-500+'px');
	$("#home1").height(document.documentElement.clientHeight-300+'px');
	$("#minh").height(document.documentElement.clientHeight-290+'px');
	    var oBox = document.getElementById('home1');
        var oTop =  document.getElementById('historyMsg');
        var oBottom =  document.getElementById('historyMsg1');
        var oLine =  document.getElementById('line');
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
