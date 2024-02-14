$(document).ready(function () {
  var initialHash = window.location.hash.substring(1);
  if (initialHash === '') {
    initialHash = 'home';
  }
  $(".admin_dashboard").load(initialHash + ".html");
  $(window).on('hashchange', function () {
    var hash = window.location.hash.substring(1);
    $(".admin_dashboard").load(hash + ".html");
  });
});
$(document).ready(function () {
  if ($.cookie('session') != null && $.cookie('session') != "") {
    var db = firebase.firestore();
    var session = $.cookie('session');
    var decodedSession = JSON.parse(atob(session));
    var ref = db.collection('user').doc(decodedSession["email"]);
    ref.get().then(user => {

      if (user.data()["last_login"] == decodedSession["time"]) {
        var role = user.data()["role"];
        var ref2 = db.collection('role').doc(role);
        ref2.get().then(querySnapshot => {
          if (querySnapshot.data()["dashboard"]) {
            $(".admin_avatar").attr("src", decodedSession["avatar"]);
            $(".admin_role").html(querySnapshot.data()["name"]);
            $(".admin_username").html(user.data()["name"]);


              // 初始化 Firestore
              const db = firebase.firestore();
            
              // 獲取 role 集合中 admin 文檔的權限
              db.collection("role").doc(role).get().then(doc => {
                  if (doc.exists) {
                      const permissions = doc.data().permission;
                      // 讀取 dashboard 集合中 all_system 文檔的數據
                      db.collection("dashboard").doc("all_system").get().then(doc => {
                          if (doc.exists) {
                              const systems = doc.data();
                              const sortOrder = systems.sort; // 獲取排序順序
                              // 根據獲取的數據生成側邊欄
                              createSidebar(systems, permissions, sortOrder);
                          }
                      });
                  }
              });
            
            // 創建側邊欄
            function createSidebar(systems, permissions, sortOrder) {
              const menuContainer = document.getElementById('menu-all');
              let htmlContent = '';
            
              // 根據 sort 陣列的順序來排序大標
              sortOrder.forEach(category => {
                  let categoryContent = '';
                  systems[category].forEach(system => {
                      if (permissions[system.name]) {
                          categoryContent += `<a class="item" href="${system.url}">
                                                  <span class="ts-icon is-${system.icon}-icon"></span>
                                                  ${system.name}
                                              </a>`;
                      }
                  });
            
                  if (categoryContent) {
                      htmlContent += `<div class="ts-app-topbar" data-toggle="${category}:has-hidden">
                                          <div class="start">
                                              <a class="item">
                                                  <span class="ts-icon is-bars-icon"></span>
                                              </a>
                                              <div class="item is-text">${category}</div>
                                          </div>
                                          <div class="content has-hidden" data-name="${category}">
                                              <div class="ts-menu is-separated is-start-icon has-dark">
                                                  ${categoryContent}
                                              </div>
                                          </div>
                                      </div>`;
                  }
              });
            
              menuContainer.innerHTML = htmlContent;
            }
          } else {
            window.location.href = "/"
          }
          
        });
      } else {
        $.removeCookie('session');
        alert("登入逾時，請重新登入。");
        window.location.href = "/"
      }
    });
  } else {
    window.location.href = "/"
  }
});

// 获取menu_bar和dashboard_menu元素
const menuBar = document.getElementById('menu_bar');
const dashboardMenu = document.getElementById('dashboard_menu');

// 添加点击事件监听器
menuBar.addEventListener('click', () => {
  // 切换dashboard_menu的显示状态
  if (dashboardMenu.style.display === 'none' || dashboardMenu.style.display === '') {
    dashboardMenu.style.display = 'block';
  } else {
    dashboardMenu.style.display = 'none';
  }
});