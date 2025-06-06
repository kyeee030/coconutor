import GameController from "./Game/GameController";
import Lobby from "./Lobby/Lobby";

const { ccclass, property } = cc._decorator;

@ccclass
export default class EndScene extends cc.Component {

    @property(cc.Label)
    scoreLabel: cc.Label = null;

    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(GameController)
    GameController: GameController = null;

    @property(Lobby)
    Lobby: Lobby = null;

    start() {
        const scoreStr = cc.sys.localStorage.getItem("lastScore");
        const score = this.GameController.getScore();

        this.scoreLabel.string = `Your score: ${score}`;

        const user = firebase.auth().currentUser;
        if (user) {
            const username = user.displayName || "未知玩家";
            this.nameLabel.string = `Player: ${username}`;
        } else {
            this.nameLabel.string = `未登入`;
        }

        this.uploadScore(score);
    }


    uploadScore(score: number) {
        const user = firebase.auth().currentUser;
        if (!user) {
            console.warn("❌ 尚未登入，無法上傳分數");
            return;
        }

        const uid = user.uid;

        // leaderboard
        firebase.database().ref(`/leaderboard/${uid}`).update({
            score: score
        });

        // user_list
        firebase.database().ref(`/user_list/${uid}`).update({
            score: score
        });

        console.log("✅ 分數上傳成功：", score);
    }

    backToLobby() {
        cc.director.loadScene("Lobby");
    }
}
