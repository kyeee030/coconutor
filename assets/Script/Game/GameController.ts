import CreateTerrain from "./CreateTerrain";
import TimeSystem, { TimeState } from "./Environment/TimeSystem";
import { IncidentType } from "./Environment/IncidentSystem";
import IncidentSystem from "./Environment/IncidentSystem";
import InfoManager from "./UI/InfoManager";
import Cursor, { CursorMode } from "./UI/GameTools/cursor";
import Building from "./Building/Building"; 

const {ccclass, property} = cc._decorator;

export enum GameState {
    INIT = 0,
    DEFFENSING = 1,
    BUILDING = 2,
    ENDING = 3
}

@ccclass
export default class GameController extends cc.Component {

    @property
    GameDuration: number = 300;

    @property(cc.Node)
    InfoManager: cc.Node = null;

    @property(cc.Node)
    cursorNode: cc.Node = null;

    @property(cc.Button)
    BuildingButton: cc.Button = null;

    @property(Building)
    buildingManager: Building = null; // 引用 Building 組件

    @property(cc.Node)
    mapGrid: cc.Node = null; // 地圖的父節點


    // system components
    public timeSystem: TimeSystem;
    public terrain: CreateTerrain;
    public incidentSystem: IncidentSystem;
    public building: Building;

    private gameTime: number = 0;
    private incident : IncidentType = IncidentType.NONE;
    private infoManager: InfoManager = null;
    private buildingMode: boolean = false;

    private selectedBuildingType: string = "wareHouse"; // 預設建築類型

    //====== System Callback==========//
    onLoad(){}
    

    start () {
        this.init();
    }

    update(dt: number){
        this.updateGameTime(dt);
        this.updateIncidentSystem(dt);
        this.updateUI();
        this.updateEnemy();
    }


    // ====== Private Methods ========== //
    private init () {

        // get required components
        this.infoManager = this.InfoManager.getComponent(InfoManager);
        this.timeSystem = this.node.getComponent(TimeSystem);
        this.terrain = this.node.getComponent(CreateTerrain);
        this.incidentSystem = this.node.getComponent(IncidentSystem);
        this.building = this.node.getComponent(Building);
        if (!this.timeSystem || !this.terrain || !this.incidentSystem) {
            console.error("GameController: Missing required components (TimeSystem or CreateTerrain)");
            return;
        }


        // start systems
        this.timeSystem.start();
        this.terrain.start();
        this.incidentSystem.start();
        console.log("GameController initialized with TimeSystem and CreateTerrain.");

        // add event listeners
        this.BuildingButton.node.on('click', this.updateBuildingMode, this);
        cc.systemEvent.on('building-position', this.onBuildingPlaced, this);

        // initialize local variables
        this.gameTime = 0;
        this.incident = IncidentType.NONE;
        this.infoManager.updateWavesLabel(0);
        this.infoManager.updateDay(this.timeSystem.getCurrentTimeState());
        this.infoManager.updateGameTime(this.gameTime);
        this.infoManager.updateIncident(this.incident);
        this.buildingMode = false;
    }

    private updateBuildingMode() {
        const cursor = this.cursorNode.getComponent(Cursor);
        if (cursor.getCurrentMode() === CursorMode.NORMAL) {
            cursor.changeState(CursorMode.BUILDING);
            this.buildingMode = true; // 啟用建築模式
            console.log("Building mode activated.");
        } else if (cursor.getCurrentMode() === CursorMode.BUILDING) {
            cursor.changeState(CursorMode.NORMAL);
            this.buildingMode = false; // 停用建築模式
            console.log("Building mode deactivated.");
        }
    }


    private updateIncidentSystem(dt : number){
        this.incidentSystem.updateIncidentSystem(dt);
        this.incident = this.incidentSystem.getCurrentIncident();
        if (this.incident !== IncidentType.NONE) {
            console.log("Current incident: " + IncidentType[this.incident]);
        }
    }

    private updateGameTime(dt: number) {
        this.timeSystem.updateGameTime(dt);
        this.gameTime = this.timeSystem.getGameTime();
        if (this.gameTime >= this.GameDuration) {
            console.log("Game duration reached. Ending game.");
            this.endGame();
        }
    }

    private updateUI() {
        this.infoManager.updateWavesLabel(this.timeSystem.getWaveCount());
        this.infoManager.updateDay(this.timeSystem.getCurrentTimeState());
        this.infoManager.updateGameTime(this.gameTime);
        this.infoManager.updateIncident(this.incident);
    }

    private updateEnemy() {
        if(this.timeSystem.getCurrentTimeState() === TimeState.NIGHT) {
            // TODO1: call enemy start
            console.log("start enemy attack");
            this.callEnemy();
        }
    }

    private callEnemy(){
        // TODO2: call your generate function, and store the enemy object tag or access in gameController.
        console.log("enemy attack from the boundry");
    }

    private onBuildingPlaced(event: cc.Event.EventCustom) {
        // 確認是否在建築模式下
        if (!this.buildingMode) {
            console.log("Building mode is not active. Ignoring building placement.");
            return;
        }

        const position = event.getUserData(); // 獲取使用者點擊的位置
        console.log(`The position received from cursor.ts: ${position.x}, ${position.y}`);

        // 呼叫 getBuildingPrefab 獲取對應的建築物 Prefab
        const buildingPrefab = this.getBuildingPrefab();
        if (!buildingPrefab) {
            console.error("No building prefab found for type:", this.selectedBuildingType);
            return;
        }

        // 實例化建築物
        const buildingNode = cc.instantiate(buildingPrefab);
        buildingNode.setPosition(position.x, position.y);
        buildingNode.parent = this.mapGrid;

        console.log(`Building of type "${this.selectedBuildingType}" placed at:`, position);

        // 重置建築模式
        this.buildingMode = false;
        const cursor = this.cursorNode.getComponent(Cursor);
        cursor.changeState(CursorMode.NORMAL);
        console.log("Building mode deactivated after placement.");
    }

    // 假設有一個方法來選擇建築物的 prefab
    private getBuildingPrefab(): cc.Prefab {
        console.log(`Getting prefab for building type: ${this.selectedBuildingType}`);

        switch (this.selectedBuildingType) {
            case "wareHouse":
                return this.buildingManager.getPrefabByType("wareHouse");
            case "defenseTower":
                return this.buildingManager.getPrefabByType("defenseTower");
            case "house":
                return this.buildingManager.getPrefabByType("house");
            default:
                console.error(`Unknown building type: ${this.selectedBuildingType}`);
                return null;
        }
    }

    private endGame(){
        console.log("Ending game...");
    }
    
    // Public API ========== //
    public getGameTime(): number {
        return this.gameTime;
    }

    public callEndTime(){
        this.endGame();
    }

    public selectBuildingType(type: string) {
        this.selectedBuildingType = type;
        console.log(`Selected building type: ${type}`);
    }
}
