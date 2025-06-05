/*

const { ccclass, property } = cc._decorator;

@ccclass
export default class Leaderboard extends cc.Component {

    @property(cc.Node)
    itemTemplate: cc.Node = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    rankLabel: cc.Node = null;

    @property(cc.Node)
    scoreLabel: cc.Node = null;

    @property(cc.Node)
    nameLabel: cc.Node = null;
    

    start() {
        const testData = [
            { displayName: "Luigi", score: 5000 },
            { displayName: "Mario", score: 2000 },
            { displayName: "Peach", score: 1000 }
        ];

        testData.forEach((entry, i) => {
            const uid = `test_user_${i}`;
            firebase.database().ref('/leaderboard').child(uid).set(entry);
        });

        this.loadLeaderboard();
    }


    loadLeaderboard() {
        const ref = firebase.database().ref('/leaderboard');
        ref.orderByChild('score').limitToLast(3).once('value', snapshot => {
            const data: any[] = [];
            snapshot.forEach(child => {
                data.push(child.val());
            });

            // 小到大 → 反轉成高分在前
            data.reverse();

            this.renderLeaderboard(data);
        });
    }

    renderLeaderboard(data: any[]) {
        this.content.removeAllChildren(); // 清空舊資料

        data.forEach((entry, index) => {
            const item = cc.instantiate(this.itemTemplate);
            item.active = true;

            const rankLabel = item.getChildByName("rankLabel").getComponent(cc.Label);
            const nameLabel = item.getChildByName("nameLabel").getComponent(cc.Label);
            const scoreLabel = item.getChildByName("scoreLabel").getComponent(cc.Label);

            rankLabel.string = `${index + 1}`;
            nameLabel.string = entry.displayName || "玩家";
            scoreLabel.string = `${entry.score}`;

            this.content.addChild(item);
        });
    }
}
*/