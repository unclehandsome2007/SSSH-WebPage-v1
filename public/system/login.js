firebase.initializeApp({
    projectId: 'sssh-webpage'
});
var db = firebase.firestore();
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};
function handleCallback(response) {
    var data = parseJwt(response.credential);
    console.log(data);
    if (data["hd"] != "sssh.tp.edu.tw") {
        $("#login_msg").html("錯誤 請使用學校帳號");
    }
    else if (data["hd"] == "sssh.tp.edu.tw") {
        $("#login_msg").html('<div class="ts-loading is-notched"></div>');
        var db = firebase.firestore();
        var ref = db.collection('user').doc(data["email"]);

        var currentTime = new Date().getTime();;
        console.log(currentTime)
        //session製作
        var session = btoa('{"email":"' + data["email"] + '","time":"' + currentTime + '","avatar":"' + data["picture"] + '"}')
        //session解碼 並且將email那項alert(沒用到，之後驗證用)
        // var decodedSession = JSON.parse(atob(session));
        // alert(decodedSession["email"] + decodedSession["time"]);
        $.cookie('session', session, { expires: 0.1, path: '/' });


        ref.get().then((doc) => {
            

            if (doc.exists) { //如果已經註冊過

                ref.update({
                    "avatar": data["picture"],
                    "last_login": currentTime
                }).then(() => {
                    console.log('set data successful');

                    if (new URL(location.href).searchParams.get('callback') != null && new URL(location.href).searchParams.get('callback') != "") {
                        window.location.href = new URL(location.href).searchParams.get('callback');
                    }
                    else {
                        window.location.href = "/system"
                    }

                });
            }


            else { //如果第一次使用
                if (data["family_name"][0] == "S") { //判斷是否為學生(看名字是不是S開頭)
                    var role = "student";
                    var std_year = data["email"].substr(0, 3);
                    var std_id = data["email"].substr(0, 8)

                }
                else {
                    var role = "teacher";
                    var std_year = "";
                    var std_id = "";
                }

                ref.set({
                    "email": data["email"],
                    "name": data["given_name"],
                    "avatar": data["picture"],
                    "role": role,
                    "std_year": std_year,
                    "std_id": std_id,
                    "last_login": currentTime

                }).then(() => {
                    console.log('set data successful');
                    if (new URL(location.href).searchParams.get('callback') != null && new URL(location.href).searchParams.get('callback') != "") {
                        window.location.href = new URL(location.href).searchParams.get('callback');
                    }
                    else {
                        window.location.href = "/system"
                    }
                });
            }
        })


    }
};

function test() {
    var db = firebase.firestore();
    var ref = db.collection('fruit').doc('apple');
    db.collection('fruit').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
        });
    });
}