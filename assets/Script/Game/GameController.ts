import CreateTerrain from "./CreateTerrain";

const {ccclass, property} = cc._decorator;

export enum GameState {
    PREPARATION = 0,
    DAY = 1,
    NIGHT = 2,
    ENDING = 3
}

@ccclass
export default class GameController extends cc.Component {

    @property
    timer: number;

    preStatusTime: number;

    @property
    gameState: GameState;

    @property
    dayTime: number;

    preparationTime: number;


    start () {
        this.init();
    }

    init () {
        this.schedule(this.timerCallBack, 1)
        this.timer = 0;
        this.preStatusTime = 0;
        this.gameState = GameState.PREPARATION;
        this.dayTime = (this.dayTime==null) ? 10 : this.dayTime;
        this.preparationTime = 3;
        CreateTerrain.generateTerrain();
    }

    timerCallBack () { //timer
        this.timer +=1;
        switch (this.gameState) {
            case GameState.PREPARATION:
                if (this.timer - this.preStatusTime == this.preparationTime)
                    this.gameState = GameState.DAY;
            break;
            case GameState.DAY:
                if (this.timer - this.preStatusTime == this.dayTime)
                    this.gameState = GameState.NIGHT;
            break;
            case GameState.NIGHT:
                if (this.timer - this.preStatusTime == this.dayTime)
                    this.gameState = GameState.DAY;
            break;
            default:
            break;
        }
    }

    // update (dt) {}
}

//
//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//
//
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
//               佛祖保佑         永无BUG
//
//
//
