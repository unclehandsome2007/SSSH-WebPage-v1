$(document).ready(function () {
    var id = new URL(location.href).searchParams.get('id');
    if (id == null || id == "") {
        $(".article_page").html('<div class="article_title">這個頁面已被刪除或不存在。</div>');
    }
    var db = firebase.firestore();
    var ref = db.collection('article').doc(id);

    // 這裡新增一個函數來增加 view_count
    function incrementViewCount() {
        ref.update({
            view_count: firebase.firestore.FieldValue.increment(1)
        });
    }

    ref.get().then(article => {
        if (article.exists == false) {
            $(".article_page").html('<div class="article_title">這個頁面已被刪除或不存在。</div>');
        }
        else if (article.data()["is_delete"] == true) {
            $(".article_page").html('<div class="article_title">這個頁面已被刪除或不存在。</div>');
        }
        else {
            $(".article_title").html(article.data()["title"]);
            $(".article_main").html(article.data()["content"]);
            $(".info_view_count").html(article.data()["view_count"]);
            // 將Firebase時間戳記轉換為日期和時間
            var timestamp = article.data()["time"];
            var date = new Date(timestamp.seconds * 1000); // 將秒轉換為毫秒
            var formattedDate = date.getFullYear() + "/" +
                String(date.getMonth() + 1).padStart(2, '0') + "/" +
                String(date.getDate()).padStart(2, '0') + " " +
                String(date.getHours()).padStart(2, '0') + ":" +
                String(date.getMinutes()).padStart(2, '0') + ":" +
                String(date.getSeconds()).padStart(2, '0');
            $(".info_date").html(formattedDate);

            var userRef = db.collection('user').doc(article.data()["author"]);
            userRef.get().then(user => {
                $(".article_user_img").attr("src", user.data()["avatar"]);
                $(".info_username").html(user.data()["name"]);
            });
            $(".is-preparing").html("");

            // 在載入後增加 view_count
            incrementViewCount();

            if (article.data()["toc"]) {
                // 目錄程式
                const tocList = document.getElementById('toc-list'); // 取得目錄列表元素
                const headers = document.querySelectorAll('h1, h2, h3'); // 取得所有標題元素
                // 對每個標題進行遍歷
                headers.forEach((header, index) => {
                    const id = `header-${index}`; // 為每個標題生成一個獨一無二的ID
                    header.id = id;

                    const listItem = document.createElement('li'); // 創建新的列表項目
                    listItem.innerHTML = `<a href="#${id}">${header.textContent}</a>`; // 生成包含標題文字的連結
                    tocList.appendChild(listItem); // 將新創建的列表項目加入到目錄列表中
                });
                $("#table-of-contents").css("display","block");
            }
        }

    });

});
