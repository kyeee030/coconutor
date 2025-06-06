import { EnemyState } from "../Enemy/Enemy";
import Targeting from "../Misc/Targeting";
import BuildingInfoPanel from "./BuildingInfoPanel";
import ResourceSystem from "../Environment/ResourceSystem";
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
    @property
    buildingType: string = 'Example'; 
    buildingState: BuildingState;

    _location: {
        x: number,
        y: number
    }

    @property(cc.Node)
    infoPanelNode: cc.Node = null;

    @property       //when testing property you can change it at the right side :)
    hp: number = 1;
    @property
    level: number = 1; // 建築物等級
    @property
    damage: number = 1;
    @property
    attackRange: number = 1;
    @property
    attackSpeed: number = 1.0; // 攻擊速度

    @property(cc.Node)
    previewBox: cc.Node = null; // 預覽框節點

    @property(cc.Prefab)
    bullet: cc.Prefab = null; // 子彈預製體

    @property(cc.Node)
    rangeNode: cc.Node = null; // 範圍節點

    private canvas: cc.Node = null; // Canvas 節點
    private mapSize: number = 4800;
    private gridSize: number = 32;
    private map:(string | null)[][] = [];

    private resourceSystem: ResourceSystem = null;
    _resourceTimer : number = 0;

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

    _canvas: cc.Node = null; // Canvas 節點
    _targetingSystem: Targeting = null;
    _targetNode: cc.Node = null; // 目標節點
    _isShowingInfoPanel: boolean = false; // 是否正在顯示信息面板
    _buildings: cc.Node[] = [];

    start () {
        this.init();
    }
    
    onLoad(): void {
        this.canvas = cc.find("Canvas");
        this.resourceSystem = cc.find("GameController").getComponent(ResourceSystem);
        if (!this.infoPanelNode) {
            console.warn("Info panel node is not initialized yet in onLoad.");
        } else {
            console.log("Info panel node is ready in onLoad.");
        }
    }

    init (): void {
        this._resourceTimer = 0;
        this._location = {
            x: this.node.position.x,
            y: this.node.position.y
        };
        this.buildingState = BuildingState.IDLE;
        this.hp = HP
        this.damage = DAMAGE;
        this.attackRange = ATTACKRANGE; // default building
        this._isShowingInfoPanel = false; // 初始化為不顯示信息面板
        if(this.infoPanelNode)
            this.infoPanelNode.active = false; // 初始化信息面板為不顯示

        // console.log(`A building has been initialized at (${this._location.x}, ${this._location.y})`);
        if(this.buildingType !== 'Example') {
            this.node.on(cc.Node.EventType.TOUCH_END, this.showInfoPanel, this);
            cc.log('set click event');
        }

        const gridCount = this.mapSize / this.gridSize;
        this.map = Array.from({ length: gridCount + 200 }, () => Array(gridCount + 200).fill(null)); // 初始化地圖為空
        console.log('gridCount:', gridCount);

    }

    update (dt) {
        this._resourceTimer += dt;
        if (this._resourceTimer >= 1) this.updateResouce();
        this._resourceTimer = this._resourceTimer % 1;

        switch (this.buildingState) {
            case BuildingState.IDLE:
            case BuildingState.ATTACK:
            break;
        }
    }

    attack () {
        //call Animation
        this.createBullet();
    }

    createBullet () {
        // TODO
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
        // if(!this.checkEnoughResources()) {
        //     console.warn(`Not enough resources to build ${selectedBuildingType}.`);
        //     return;
        //     // TODO USER INFO
        // }
        const position = event.getUserData();
        const buildingPrefab = this.getPrefabByType(selectedBuildingType);
        this.buildingType = selectedBuildingType;
        if(!this.checkEnoughResources()) {
            console.warn(`Not enough resources to build ${selectedBuildingType}.`);
            return;
        }
        const buildingNode = cc.instantiate(buildingPrefab);
        buildingNode.setPosition(position.x, position.y);
        this.setBuildingAt(Math.floor((position.x  + 2416) / this.gridSize ), Math.floor((position.y + 2416) / this.gridSize), selectedBuildingType);

        this.canvas.addChild(buildingNode); // 將建築物添加到 Canvas 節點下
        this._buildings.push(buildingNode);
    }

    setBuildingAt(gridX: number, gridY: number, buildingType: string):void{
        if(this.map[gridX][gridY] == null){
            this.map[gridX][gridY] = buildingType;
            console.log(`Building of type ${buildingType} set at grid (${gridX}, ${gridY})`);
        }
    }

   
    showInfoPanel () {
        cc.log(this._isShowingInfoPanel);
        if(!this.infoPanelNode) console.log("Can't find info panel node.");
        
        this._isShowingInfoPanel = !this._isShowingInfoPanel;
        this.infoPanelNode.active = this._isShowingInfoPanel;
        if(!this._isShowingInfoPanel) return;

        console.log("Showing Building Info Panel");
        if(this.rangeNode) this.rangeNode.active = true;
        else console.log("This building does not have a range node.");
        this.infoPanelNode.getComponent(BuildingInfoPanel).setBuildingInfo(
            this.buildingType,
            this.level,
            this.hp,
            this.damage,
            this.attackRange
        );
    }


    ableBuild(x: number, y: number): boolean {
        console.log(`Checking if able to build at (${x}, ${y})`);
        console.log(`put Grid at: ${Math.floor( (x+2416) / this.gridSize)}, ${Math.floor( (y + 2416) / this.gridSize)}`);
        if(this.map[Math.floor( (x+2416) / this.gridSize)][Math.floor((y + 2416 )/ this.gridSize)] == null) {
            return true;
        }
        return false;
    }


    updatePreviewBox(x: number, y: number): void {
        if (!this.previewBox) {
            console.error("Preview box node is not set!");
            return;
        }

        const canBuild = this.ableBuild(x, y);
        if (canBuild) {
            this.previewBox.color = cc.Color.GREEN; // 綠色表示允許建造
        } else {
            this.previewBox.color = cc.Color.RED; // 紅色表示不允許建造
        }

        this.previewBox.setPosition(x, y); // 更新預覽框的位置
        this.previewBox.active = true; // 顯示預覽框
    }

    hidePreviewBox(): void {
        // TODO
    }

    getNearestBuilding(pos: cc.Vec2) {
        let nearestBuilding: cc.Node = null;
        let minDistance = Infinity;

        if(!this._buildings || this._buildings.length === 0) {
            return null;
        }
        this._buildings = this._buildings.filter(b => b && cc.isValid(b));

        this._buildings.forEach(building => {
            if (!building) return null;
            const buildingPos2D = new cc.Vec2(building.position.x, building.position.y);
            const distance = pos.sub(buildingPos2D).mag();
            if (distance < minDistance) {
                minDistance = distance;
                nearestBuilding = building; 
            }
        });
        return nearestBuilding;
    }

    updateResouce() {
        console.log(`Updating resources for building type: ${this.buildingType}`);
        switch (this.buildingType) {
            case 'sawmill':
                this.resourceSystem.addWoods(1);
                break;
            case 'quarry':
                this.resourceSystem.addStones(1);
                break;
            case 'mine':
                this.resourceSystem.addOres(1);
                break;
            default:
                break;
        }
    }

    checkEnoughResources(){
        switch (this.buildingType) {
            case 'sawmill':
                if (this.resourceSystem.getWoods() >= 25) this.resourceSystem.addWoods(-25);
                return this.resourceSystem.getWoods() >= 25;
            case 'quarry':
                if( this.resourceSystem.getStones() >= 25) this.resourceSystem.addStones(-25);
                return this.resourceSystem.getStones() >= 25;
            case 'mine':
                if( this.resourceSystem.getOres() >= 10) this.resourceSystem.addOres(-10);
                return this.resourceSystem.getOres() >= 10;
            case 'wareHouse':
                if( this.resourceSystem.getWoods() >= 20 && this.resourceSystem.getStones() >= 10 && this.resourceSystem.getOres() >= 5) {
                    this.resourceSystem.addWoods(-20);
                    this.resourceSystem.addStones(-1);
                    this.resourceSystem.addOres(-5);
                }
                return this.resourceSystem.getWoods() >= 20 && this.resourceSystem.getStones() >= 10 && this.resourceSystem.getOres() >= 5;
            case 'swordTower':
                if( this.resourceSystem.getWoods() >= 5 && this.resourceSystem.getStones() >= 5 && this.resourceSystem.getOres() >= 5) {
                    this.resourceSystem.addWoods(-5);
                    this.resourceSystem.addStones(-5);
                    this.resourceSystem.addOres(-5);
                }
                return this.resourceSystem.getWoods() >= 5 && this.resourceSystem.getStones() >= 5 && this.resourceSystem.getOres() >= 5;
            case 'turret':
                if( this.resourceSystem.getWoods() >= 10 && this.resourceSystem.getStones() >= 10 && this.resourceSystem.getOres() >= 10) {
                    this.resourceSystem.addWoods(-10);
                    this.resourceSystem.addStones(-10);
                    this.resourceSystem.addOres(-10);
                }
                return this.resourceSystem.getWoods() >= 10 && this.resourceSystem.getStones() >= 10 && this.resourceSystem.getOres() >= 10;
        }
    }
    getHurts (damage: number) {
        this.hp -= damage;
        if (this.hp <= 0) {
            this.buildingState = BuildingState.BROKEN;
            if (this.node && cc.isValid(this.node))
                this.node.destroy();
            console.log(`Building of type ${this.buildingType} has been destroyed.`);
        } else {
            console.log(`Building of type ${this.buildingType} took ${damage} damage, remaining HP: ${this.hp}`);
        }
    }

    setTargetNode(targetNode: cc.Node): void {
        if(targetNode == null) {
            targetNode = null;
            console.warn("Target node is null, setting to null.");
            return;
        }
        if (targetNode && cc.isValid(targetNode)) {
            this._targetNode = targetNode;
            console.log(`Target node set to: ${targetNode.name}`);
        } else {
            console.warn("Invalid target node provided.");
        }
    }
} 