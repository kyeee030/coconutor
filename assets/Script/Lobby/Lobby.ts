// Lobby.ts
import GameController from "../Game/GameController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Lobby extends cc.Component {

    @property({ type: cc.AudioClip })
    background_bgm: cc.AudioClip = null;

    @property(cc.Slider)
    slider: cc.Slider = null;

    @property(cc.Node)  // 👉 新增背景 node
    backgroundNode: cc.Node = null;

    private time: number = 0; // 👉 加入時間累積器

    start() {
        // 同步滑桿與音量
        const currentVolume = cc.audioEngine.getMusicVolume();
        this.slider.progress = currentVolume;

        // ✅ 播放音樂之前先設音量，並設定為「循環播放」
        cc.audioEngine.setMusicVolume(currentVolume);
        cc.audioEngine.playMusic(this.background_bgm, true); // ✅ true 表示循環播放

        this.scheduleOnce(this.loadTop3Leaderboard, 0.2);
    }

    update(dt: number) {
        this.time += dt;

        // 使用 sin 波改變 R/G/B
        const r = Math.floor(127 * Math.sin(this.time) + 128);
        const g = Math.floor(127 * Math.sin(this.time + 2) + 128);
        const b = Math.floor(127 * Math.sin(this.time + 4) + 128);

        if (this.backgroundNode) {
            this.backgroundNode.color = new cc.Color(r, g, b);
        }
    }

    set_volume() {
        const volume = this.slider.progress;
        cc.audioEngine.setMusicVolume(volume);  // ✅ 即時調整背景音樂音量
        cc.log("音量調整為：", volume);
    }


    handle_sign_in() {
        var txtname = cc.find("Canvas/sign_in_board/board/name");
        var txtEmail = cc.find("Canvas/sign_in_board/board/mail");
        var txtPassword = cc.find("Canvas/sign_in_board/board/password");
        var username = txtname.getComponent(cc.EditBox).string;
        var email = txtEmail.getComponent(cc.EditBox).string;
        var password = txtPassword.getComponent(cc.EditBox).string;

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                user.updateProfile({
                    displayName: username
                });

                // 建立 user_list 資料
                firebase.database().ref('/user_list').child(user.uid).set({
                    email: email,
                    userName: username,
                    uid: user.uid,
                    score: 0,
                });

                // 建立 leaderboard 資料（for 排行榜）
                firebase.database().ref('/leaderboard').child(user.uid).set({
                    displayName: username,
                    photoURL: user.photoURL || "",  // 有可能是空的（註冊時未提供）
                    score: 0
                });

                alert("註冊成功！");
                cc.find("Canvas/sign_in_board").active = false;
                cc.audioEngine.stopMusic();
                cc.director.loadScene("Select");
            })
            .catch(e => {
                cc.find("Canvas/sign_in_board/board/name").getComponent(cc.EditBox).string = '';
                cc.find("Canvas/sign_in_board/board/mail").getComponent(cc.EditBox).string = '';
                cc.find("Canvas/sign_in_board/board/password").getComponent(cc.EditBox).string = '';

                alert("註冊失敗：" + e.message);
            });
    }

    sign_in() {
        cc.find("Canvas/sign_in_board").active = true;
    }

    sign_out() {
        cc.director.loadScene("start");
    }

    back() {
        cc.find("Canvas/sign_in_board").active = false;
        cc.find("Canvas/setting_board").active = false;
        cc.find("Canvas/leaderboard").active = false;
        cc.find("Canvas/login_board").active = false;
    }

    enter() {
        this.handle_sign_in();
    }

    enter2(){
        this.handlelogin();
    }

    volumn_render() {
        
    }

    updateScore(newScore: number) {
        const user = firebase.auth().currentUser;
        if (!user) return;

        const ref = firebase.database().ref('/leaderboard').child(user.uid);
        ref.update({
            score: newScore
        });
    }

    log_in(){
        cc.find("Canvas/login_board").active = true;
    }

    handlelogin() {
        var txtEmail = cc.find("Canvas/login_board/mail");
        var txtPassword = cc.find("Canvas/login_board/password");

        var txtemail = txtEmail.getComponent(cc.EditBox).string;
        var txtpassword = txtPassword.getComponent(cc.EditBox).string;

        firebase.auth().signInWithEmailAndPassword(txtemail, txtpassword)
            .then((userCredential) => {
                alert("success");
                cc.find("Canvas/sign_in_board").active = false;
                cc.audioEngine.stopMusic();
                cc.director.loadScene("Select");
            })
            .catch(userCredential => {
                cc.find("Canvas/login_board/mail").getComponent(cc.EditBox).string = '';
                cc.find("Canvas/login_board/password").getComponent(cc.EditBox).string = '';
                txtemail = '';
                txtpassword = '';
                alert("failed");
            }
            );
    }

    loadTop3Leaderboard() {
    const leaderboardRef = firebase.database().ref('/leaderboard');

        leaderboardRef.orderByChild('score').limitToLast(3).once('value')
            .then(snapshot => {
                const entries = [];

                console.log("取得排行榜資料...");

                snapshot.forEach(childSnapshot => {
                    const data = childSnapshot.val();
                    console.log("讀取到：", data);
                    entries.push({
                        name: data.displayName || "未知",
                        score: data.score || 0
                    });
                });

                entries.reverse();

                const rank1 = cc.find("Canvas/leaderboard/board/rank1");
                const rank2 = cc.find("Canvas/leaderboard/board/rank2");
                const rank3 = cc.find("Canvas/leaderboard/board/rank3");

                if (entries[0]) {
                    rank1.getComponent(cc.Label).string = `#1 ${entries[0].name} - ${entries[0].score}`;
                } else {
                    rank1.getComponent(cc.Label).string = "#1 無資料";
                }

                if (entries[1]) {
                    rank2.getComponent(cc.Label).string = `#2 ${entries[1].name} - ${entries[1].score}`;
                } else {
                    rank2.getComponent(cc.Label).string = "#2 無資料";
                }

                if (entries[2]) {
                    rank3.getComponent(cc.Label).string = `#3 ${entries[2].name} - ${entries[2].score}`;
                } else {
                    rank3.getComponent(cc.Label).string = "#3 無資料";
                }
            })
            .catch(error => {
                console.error("載入排行榜失敗：", error);
            });
    }

    setting(){
        cc.find("Canvas/setting_board").active = true;
    }

    show_scoreboard(){
        cc.find("Canvas/leaderboard").active = true;
    }
}