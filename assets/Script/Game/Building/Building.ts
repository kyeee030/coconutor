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

    init (): void {
        if (!this._location || this._location.x === undefined || this._location.y === undefined) {
            console.error("Building location is not set! Please call setLocation before init.");
            return;
        }

        this.buildingState = BuildingState.IDLE;
        this.hp = this.hp ?? HP;
        this.damage = this.damage ?? DAMAGE;
        this.coolDown = this.coolDown ?? COOLDOWN;
        this.attackRange = this.attackRange ?? ATTACKRANGE;

        console.log(`A building has been initialized at (${this._location.x}, ${this._location.y})`);
    }

    setLocation (x: number, y: number): void {
        this._location = { x, y };
        console.log(`Building location set to: (${x}, ${y})`);
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

    onBuildingPlaced(event: cc.Event.EventCustom, buildingRoot: cc.Node, selectedBuildingType: string): void {
        const position = event.getUserData();
        console.log(`The position received from cursor.ts: ${position.x}, ${position.y}`);

        const buildingPrefab = this.getPrefabByType(selectedBuildingType);
        if (!buildingPrefab) {
            console.error("No building prefab found for type:", selectedBuildingType);
            return;
        }

        const buildingNode = cc.instantiate(buildingPrefab);
        buildingNode.setPosition(position.x, position.y);

        if (buildingRoot) {
            if (!buildingRoot.active) {
                console.error("Building root node is not active!");
                buildingRoot.active = true; // 啟用節點
            }
            buildingRoot.addChild(buildingNode);
            console.log("Building node added to 'building' root.");
        } else {
            console.error("Building root node is not set!");
        }

        const buildingComponent = buildingNode.getComponent(Building);
        if (buildingComponent) {
            buildingComponent.setLocation(position.x, position.y); // 設置位置
            buildingComponent.init(); // 初始化建築物
        } else {
            console.error("Building component not found on instantiated node!");
        }

        console.log(`Building of type "${selectedBuildingType}" placed at:`, position);
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
