import { EnemyState } from "../Enemy/Enemy";
import BuildingInfoPanel from "./BuildingInfoPanel";
//TODO 1 : 做一個面板，可以點地圖上的建築，顯示該建築的功能及屬性
//TODO 1-1 : Name 、 Level 、 HP 
const {ccclass, property} = cc._decorator;

export enum BuildingState {
    IDLE = 0,
    ATTACK = 1,
    BROKEN = 2,
}


//Modify data here
const HP = 100;
const DAMAGE = 10;
const ATTACKRANGE = 7;

@ccclass
export default class Building extends cc.Component {
    _buildingType: string = 'Example'; 
    buildingState: BuildingState;

    _location: {
        x: number,
        y: number
    }

    protected infoPanelNode: cc.Node = null; 

    @property       //when testing property you can change it at the right side :)
    hp: number;
    @property
    level: number = 1; // 建築物等級
    @property
    damage: number;
    @property
    attackRange: number;
    @property
    attackSpeed: number = 1.0; // 攻擊速度

    @property(cc.Node)
    previewBox: cc.Node = null; // 預覽框節點

    @property(cc.Prefab)
    infoPanel: cc.Prefab = null; 

    @property(cc.Prefab)
    bullet: cc.Prefab = null; // 子彈預製體



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
    buildingPrefabs: cc.Prefab[] = []; 

    @property({ type: [cc.String] })
    buildingTypes: string[] = []; 

    protected _canvas: cc.Node = null; // Canvas 節點

    start () {
        this.init();
        cc.log(this.level);
    }
    
    onLoad(): void {
        this.node.on(cc.Node.EventType.TOUCH_END, this.showInfoPanel, this);

        if (!this.infoPanelNode) {
            console.warn("Info panel node is not initialized yet in onLoad.");
        } else {
            this.infoPanelNode.on(cc.Node.EventType.TOUCH_END, this.showInfoPanel, this.infoPanelNode);
        }
        this._canvas = cc.find("Canvas");
    }

    init (): void {
        if (!this._location || this._location.x === undefined || this._location.y === undefined) {
            console.error("Building location is not set! Please call setLocation before init.");
            return;
        }

        this.buildingState = BuildingState.IDLE;
        this.hp = this.hp ?? HP;
        this.damage = this.damage ?? DAMAGE;
        this.attackRange = this.attackRange ?? ATTACKRANGE;
        this._buildingType = this._buildingType || 'Example'; // 確保有一個默認的建築類型

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
        const index = this.buildingTypes.indexOf(type);
        if (index === -1) {
            console.error(`Building type "${type}" not found!`);
            return null;
        }
        return this.buildingPrefabs[index];
    }

    onBuildingPlaced(event: cc.Event.EventCustom, buildingRoot: cc.Node, selectedBuildingType: string): void {

        const position = event.getUserData();

        const buildingPrefab = this.getPrefabByType(selectedBuildingType);
        if (!buildingPrefab) {
            console.error("No building prefab found for type:", selectedBuildingType);
            return;
        }

        const buildingNode = cc.instantiate(buildingPrefab);
        buildingNode.setPosition(position.x, position.y);
        

        // this.infoPanelNode = cc.instantiate(this.infoPanel);
        // buildingNode.addChild(this.infoPanelNode); 
        // this.infoPanelNode.setPosition(0, 0); 
        // this.infoPanelNode.active = false; 
        // console.log("Info panel added to building node.");

        cc.find("Canvas").addChild(buildingNode); // 將建築物添加到 Canvas 節點下

        // if (buildingRoot) {
        //     buildingRoot.addChild(buildingNode); // 將建築物添加到建築根節點
        // } else {
        //     console.error("Building root node is not set!");
        //     return;
        // }

    }

    showInfoPanel(): void {
            console.log(this._buildingType);
        if (!this.infoPanel) {
            console.error("InfoPanel prefab is null!");
            return;
        }

        
        if(this.infoPanelNode === null) {
            console.log("InfoPanelNode is null! Please call onBuildingPlaced first.");
            return;
        }
         if (this.infoPanelNode.active) {
            this.infoPanelNode.active = false;
            return;
        }

        console.log("Showing Building Info Panel");
        this.infoPanelNode.active = true;
        const nameLabel = this.infoPanelNode.getChildByName("name");
        const levelLabel = this.infoPanelNode.getChildByName("level").getComponent(cc.Label);
        const hpLabel = this.infoPanelNode.getChildByName("hp").getComponent(cc.Label);
        const damageLabel = this.infoPanelNode.getChildByName("damage").getComponent(cc.Label);
        const attackLabel = this.infoPanelNode.getChildByName("attackRange").getComponent(cc.Label);
        //nameLabel.string = `${this._buildingType}`;
        levelLabel.string = "Level:"+this.level.toString();
        hpLabel.string = `HP: ${this.hp}`;
        damageLabel.string = `Damage: ${this.damage}`;
        attackLabel.string = `Attack Range: ${this.attackRange}`;
        this.node.active = true;
        console.log(this.level);
    }


    ableBuild(x: number, y: number): boolean {
        // 假設有一個地圖數據結構 `_map`，用來存儲地形信息
        // 例如：0 表示空地，1 表示障礙物，2 表示水域等
        // const terrainType = this._map[x][y];
        // if (terrainType === 0) {
        //     return true; // 空地，允許建造
        // } else {
        //     return false; // 其他地形，不允許建造
        // }
        return true;
    }

    updatePreviewBox(x: number, y: number): void {
        console.log(`Updating preview box`);
        if (!this.previewBox) {
            console.error("Preview box node is not set!");
            return;
        }

        const canBuild = this.ableBuild(x, y);
        if (canBuild) {
            console.log(`Building allowed`);
            this.previewBox.color = cc.Color.GREEN; // 綠色表示允許建造
        } else {
            console.log(`Building not allowed`);
            this.previewBox.color = cc.Color.RED; // 紅色表示不允許建造
        }

        this.previewBox.setPosition(x, y); // 更新預覽框的位置
        this.previewBox.active = true; // 顯示預覽框
    }

    hidePreviewBox(): void {
        if (this.previewBox) {
            this.previewBox.active = false; // 隱藏預覽框
        }
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
