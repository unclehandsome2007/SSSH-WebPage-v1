$(document).ready(function () { //頂部淡入淡出
   $('.show').fadeIn(4500);
   $(window).scroll(function () {
      if ($(this).scrollTop() > 50) {
         $('.headerPage').fadeIn("slow");
         $('.contact').fadeIn("slow");

      } else {
         $('.headerPage').fadeOut("slow");
         $('.contact').fadeOut("slow");
      }
   });
});

$(document).ready(function () { //網站計數
   var db = firebase.firestore();
   var visitRef = db.collection('log').doc("visit_count");
   var today = new Date();
   var year = today.getFullYear().toString();
   var month = (today.getMonth() + 1).toString().padStart(2, '0');
   var day = today.getDate().toString().padStart(2, '0');
   var formattedDate = year + month + day;
   visitRef.update({
      [formattedDate]: firebase.firestore.FieldValue.increment(1)
   });



   var db = firebase.firestore();
    var newsContainer = document.querySelector('.news');

    // 加載並顯示 pinNews
    async function loadAndDisplayPinNews() {
        var doc = await db.collection('dashboard').doc('website').get();
        if (doc.exists) {
            var pinNews = doc.data().pin_news;
            pinNews.reverse();

            for (const articleId of pinNews) {
                var articleDoc = await db.collection('article').doc(articleId.toString()).get();
                if (articleDoc.exists) {
                    var articleData = articleDoc.data();
                    var articleDate = articleData.time.toDate();
                    var tzOffset = 8 * 60; // 台灣是 UTC+8
                    var localDate = new Date(articleDate.getTime() + tzOffset * 60000);
                    var formattedDate = localDate.toISOString().split('T')[0].replace(/-/g, '.');

                    var userDoc = await db.collection('user').doc(articleData.author).get();
                    if (userDoc.exists) {
                        var userName = userDoc.data().name;
                        var blockItem = document.createElement('div');
                        blockItem.className = 'block-item';
                        blockItem.innerHTML = `
                            <a href="article.html?id=${articleId}">
                                <div class="block-info">
                                    <p class="block-item-date">${formattedDate}</p>
                                    <div class="block-item-tag">${userName}</div>
                                </div>
                                <p class="block-item-content">${articleData.title}</p>
                            </a>
                        `;
                        if (newsContainer) {
                            newsContainer.appendChild(blockItem);
                        }
                    }
                }
            }
        }
        
    }

    // 呼叫函數加載並顯示 pinNews
    loadAndDisplayPinNews();

})
window.addEventListener('scroll', function () {
   var element = document.querySelector('.block-img');
   var position = element.getBoundingClientRect();

   // 檢查元素是否在可視區域
   if (position.top < window.innerHeight && position.bottom >= 0) {
      element.classList.add('animated');
   }
});