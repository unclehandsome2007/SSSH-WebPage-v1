// exam_search 段考範圍查詢 JS 專用
$(document).ready(function () {
    var db = firebase.firestore();
    var ref2 = db.collection('system').doc("exam_search");
    ref2.get().then(data => {
        $("#apps_exam_title").html(data.data()["title"])
    });
});
function selectOption(selectElement) {
    var option = selectElement.value; // 選擇的值 (e.g., "grade1")
    var optionName = selectElement.options[selectElement.selectedIndex].getAttribute('data-name');
    var db = firebase.firestore();
    var ref = db.collection('system').doc('exam_search');
    var card = '<div class="column mobile:is-16-wide tablet+:is-8-wide"><div class="ts-segment"><span class="ts-icon is-end-spaced is-pen-icon"></span><span>{{subject}}</span><p>{{range}}</p></div></div>';
    var temp = '';

    ref.get().then(querySnapshot => {
        $(".exam_result_card").html("");
        console.log(querySnapshot.data()[option]);
        for (i = 0; i < querySnapshot.data()[option].length; i++) {
            temp = card;
            temp = temp.replace("{{subject}}", optionName + querySnapshot.data()[option][i]["subject"])
            temp = temp.replace("{{range}}", querySnapshot.data()[option][i]["range"])
            $(".exam_result_card").append(temp);
        }
    })

}
