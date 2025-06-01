import { EnemyState } from "../Enemy/Enemy";

const {ccclass, property} = cc._decorator;

export enum BuildingState {
    IDLE = 0,
    ATTACK = 1,
    BROKEN = 2,
}


//Modify data here
const HP = 100;
const DAMAGE = 10;
const COOLDOWN = 1.5;
const ATTACKRANGE = 7;

@ccclass
export default class Building extends cc.Component {

    _buildingType: string = 'Example';
    buildingState: BuildingState;

    _location: {
        x: number,
        y: number
    }

    @property       //when testing property you can change it at the right side :)
    hp: number;
    @property
    damage: number;
    //splashDamage: number; //if you need :)
    @property
    coolDown: number;
    @property
    attackRange: number;
    @property(cc.Prefab)
    wareHousePrefab: cc.Prefab = null;

    target: {
        dist: number,
        pos: {
            x: number,
            y: number
        },
        type: EnemyState,
        tag: null //index of enemy or something else
    }

    @property({ type: [cc.Prefab] })
    buildingPrefabs: cc.Prefab[] = []; // 存放所有建築物的 Prefab

    @property({ type: [cc.String] })
    buildingTypes: string[] = []; // 存放對應的建築類型名稱（與 Prefab 一一對應）

    // onLoad () {}

    start () {
        this.init();
    }

    init () {
        this.buildingState = BuildingState.IDLE;  //set initial value
        this.hp = (this.hp == null) ? HP : this.hp;
        this.damage = (this.damage == null) ? DAMAGE : this.damage;
        this.coolDown = (this.damage == null) ? COOLDOWN : this.coolDown;
        this.attackRange = (this.attackRange == null) ? ATTACKRANGE: this.attackRange;
        
        console.log(
            (   this._location.x == null || this._location.y == null ||
                this.hp == null || this.damage == null ||
                this.coolDown == null || this.attackRange == null ||
                this.buildingState == null) //check location and log
            ? 'Can\'t find ' + this._buildingType + '\'s property T_T, who write this shxt code?' 
            : 'A ' + this._buildingType + ' has been build!!'
        );
    }

    setLocation (x: number, y: number) { //called when be built from other object
        this._location = {x, y};
    }

    update (dt) {
        switch (this.buildingState) {
            case BuildingState.IDLE:
            case BuildingState.ATTACK:
                this.searchTarget();
            break;
        }
    }

    searchTarget () {
        /*
        if (found new one)
            this.schedule(this.attack, this.coolDown);
        else
            state = ...
            this.unschedule(this.attack);
        */
    }

    attack () {
        //call Animation
        this.createBullet();
    }

    createBullet () {

    }

    getPrefabByType(type: string): cc.Prefab {
        console.log(`Getting prefab for building type: ${type}`);
        const index = this.buildingTypes.indexOf(type);
        if (index === -1) {
            console.error(`Building type "${type}" not found!`);
            return null;
        }
        return this.buildingPrefabs[index];
    }
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
