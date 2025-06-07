

const {ccclass, property} = cc._decorator;

@ccclass
export default class Select extends cc.Component {

    hard: number = 1;

    @property(cc.AudioClip)
    select_bgm: cc.AudioClip = null;

    start () {
        cc.audioEngine.playMusic(this.select_bgm, true);
    }

    select_hard(){
        cc.director.loadScene("Game");
        this.hard = 10;
        cc.sys.localStorage.setItem("hardness", this.hard.toString());
    }

    select_soft(){
        cc.director.loadScene("Game");
        this.hard = 3;
        cc.sys.localStorage.setItem("hardness", this.hard.toString());
    }
}
