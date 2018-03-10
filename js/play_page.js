/**
 * 发送检查jwt请求.
 */
var isLogin = function () {
    if(!localStorage.jwt || localStorage.jwt.length === 0) {
        window.location.href = '/html/sign.html';
    }
    ajax({
        jwt: localStorage.jwt,
        url: "/sign/isLogin",
        method: "GET",
        async: true,
        success: function(msg) {
            var obj = JSON.parse(msg);
            if(obj.jwt){
                localStorage.jwt = obj.jwt;
                userInfo = JSON.parse(msg);
                $(".face").src = userInfo.photoUrl;
                $(".p_name").innerText = userInfo.username;
                $(".p_level").innerText = 'Lv. ' + userInfo.level;
                $(".coin_num").innerText = userInfo.coin;
            }
        },
        error: function(e) {
            window.location.href = '/html/sign.html';
        }
    });
}

function getCnt() {
    ajax({
        jwt: localStorage.jwt,
        url: "/info/getDivCnt",
        method: "GET",
        async: true,
        success: function(msg) {
            var obj = JSON.parse(msg);
            console.log(obj);
            $(".music_cnt").innerText = obj.music || '0';
            $(".movie_cnt").innerText = obj.movie || '0';
            $(".game_cnt").innerText = obj.game || '0';
            $(".tech_cnt").innerText = obj.tech || '0';
        },
    });
}

document.addEventListener("DOMContentLoaded", function(event) {
	//检测用户登入状态,并初始化顶部信息
    //发送检查jwt请求
    isLogin();
    getCnt();

    var videoId = getRequest().videoId;
    //请求视频信息
    ajax({
        url: "/info/getVideoById",
        method: "GET",
        async: true,
        data: {
            videoId: videoId
        },
        success: function(msg) {
            var job = JSON.parse(msg);
            if(job.result === 'success') {
                $(".d_video_title").innerText = job.title;
                $(".father_div").innerText = job.fatherDiv.toUpperCase();
                $(".son_div").innerText = job.sonDiv.toUpperCase();
                $(".d_hits").innerText = job.hits;
                $(".d_barr").innerText = job.barrageNumber;
                $(".d_coin").innerText = "硬币 " + job.coinNum;
                $(".d_userName").innerText = job.upUser;
                $("time").innerText = job.videoDate.slice(0, job.videoDate - 2);
                ajax({
                    jwt: localStorage.jwt,
                    url: "/info/getExtraInfo",
                    data: {
                        username: job.upUser
                    },
                    method: "GET",
                    async: true,
                    success: function(msg_02) {
                        var json = JSON.parse(msg_02);                
                        $(".u_sign").innerText = json.sign;
                    }
                })
                ajax({
                    jwt: localStorage.jwt,
                    url: "/manage/upHits",
                    data: {
                        videoId: job.id
                    },
                    method: "GET",
                    async: true,
                })
            }
            else {
                window.location.href = './error_page.html';
            }
        }
    });

    //顶部用户栏绑定事件
    addSlidEvent($('.user_head'), $('.info_box'), true, 5 , 5, -15, 0);
    addSlidEvent($('.info_bnt'), $('.in_box'), true, 5 , 3, -15, 0);
    addSlidEvent($('.vip_bnt'), $('.vip_box'), true, 5 , 3, -15, 0);
    addSlidEvent($('.up_button'), $('.up_box'), true, 5 , 3, -15, 0);
    $("#quit_bnt").onclick = function () {
    	localStorage.jwt = '';
    	window.location.href = '/html/sign.html'
    }

    //为展开按钮绑定事件
    $("#up_bnt").onclick = function () {
        var box = $("#u_sign_box");
        if(this.className === "up_bnt_status") {
            this.className = "";
            box.className = "";
            this.innerText = "收起";
        }
        else {
            this.className = "up_bnt_status";
            box.className = "up_span_status";
            this.innerText = "展开";
        }
    }

    //为搜索按钮绑定事件
    $(".search_bnt").onclick = function() {
        var keyword = $(".search_word").value;
        window.location.href = '/html/search_page.html?word=' + escape(keyword);
    }

}, false);

