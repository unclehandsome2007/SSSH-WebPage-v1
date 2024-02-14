function topFunction() {
   document.body.scrollTop = 0;
   document.documentElement.scrollTop = 0;
}
function login() {
   var currentUrl = window.location.href;

   var loginLink = document.getElementById('loginLink');
   loginLink.href = "/system/login.html?callback=" + encodeURIComponent(currentUrl);
}
function check_open() {
   var db = firebase.firestore();
   var ref3 = db.collection('dashboard').doc("website");
   ref3.get().then(data => {
      var websiteData = data.data();
      if (websiteData && websiteData["open"] === false) {
         // 從資料庫獲取不開放時的提示訊息
         var notOpenMessage = websiteData["notopenMSG"] || "此網站目前不開放";

         // 清空整個頁面的內容，並顯示從資料庫獲取的提示訊息
         document.body.innerHTML = "<h1 style='text-align: center; margin-top: 20%;'>" + notOpenMessage + "</h1>";

         // 禁用所有鏈接，按鈕等互動元素
         var elements = document.getElementsByTagName('*');
         for (var i = 0; i < elements.length; i++) {
            elements[i].disabled = true;
         }
      }
   }).catch(error => {
      console.error("無法從資料庫獲取網站狀態：", error);
   });
}
function loadHeaderAndFooter() {
   $(".headerPage").load("/header.html", function () {
      $(".footerPage").load("/footer.html", function () {

         $(window).scroll(function () {
            if ($(this).scrollTop() > 50) {
               $('#myBtn_div').fadeIn("slow");
            } else {
               $('#myBtn_div').fadeOut("slow");
            }
         });

         var login_code = '<div id="title_account"><a href="/system/login.html" id="loginLink"><button id="loginButton" class="ts-button is-circular is-small is-start-icon is-accent" onclick="login()"><span class="ts-icon is-right-to-bracket-icon"></span> 登入</button></a></div>';
         var logined_code = '<div id="title_avatar"><button class="is-ghost" data-dropdown="dropdown"><span class="ts-avatar is-circular"><img src="{{avatar}}"></span></button><div class="ts-dropdown" data-name="dropdown"><button onclick="location.href=\'/account.html\';" class="item">帳戶</button><button onclick="location.href=\'/logout.html\';" class="item">登出</button></div></div>';

         if ($.cookie('session') != null && $.cookie('session') != "") {
            var db = firebase.firestore();
            var session = $.cookie('session');
            var decodedSession = JSON.parse(atob(session));
            var ref = db.collection('user').doc(decodedSession["email"]);
            ref.get().then(querySnapshot => {

               if (querySnapshot.data()["last_login"] == decodedSession["time"]) {
                  var role = querySnapshot.data()["role"];
                  var ref2 = db.collection('role').doc(role);

                  ref2.get().then(querySnapshot => {
                     if (querySnapshot.data()["dashboard"]) {
                        var tmp = logined_code;
                        tmp = tmp.replace('<button onclick="location.href=\'/logout.html\';" class="item">登出</button>', '<button onclick="location.href=\'/admin/dashboard.html\';" class="item">管理介面</button><button onclick="location.href=\'/logout.html\';" class="item">登出</button></div>');
                        tmp = tmp.replace("{{avatar}}", decodedSession["avatar"]);
                        $('.headerPage').append(tmp);
                     } else {
                        check_open();
                        var tmp = logined_code;
                        tmp = tmp.replace("{{avatar}}", decodedSession["avatar"]);
                        $('.headerPage').append(tmp);
                     }
                  });
               } else {
                  $.removeCookie('session');
                  alert("登入逾時，請重新登入。");
                  $('.headerPage').append(login_code);
               }
            });
         } else {
            $('.headerPage').append(login_code);
            check_open();
         }
      });
   });
}

loadHeaderAndFooter();

var count = 0;

function rick() {
   count++;
   $("#score").css("display", "block");
   $("#score").html("你被洗腦了" + count + "次");

   // 弹跳效果
   $(".moving-image img").css("transform", "scale(50)");
   $(".moving-image img").css("z-index", "100000");
   setTimeout(function () {
      $(".moving-image img").css("transform", "scale(1)");
      $(".moving-image img").css("z-index", "1");
   }, 1000);
}
