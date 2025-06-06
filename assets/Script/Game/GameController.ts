import CreateTerrain from "./CreateTerrain";
import TimeSystem, { TimeState } from "./Environment/TimeSystem";
import { IncidentType } from "./Environment/IncidentSystem";
import IncidentSystem from "./Environment/IncidentSystem";
import InfoManager from "./UI/InfoManager";
import KeyboardCursor from "./UI/GameTools/KeyBoardCursor";
import Building from "./Building/Building";
import PathPlanning from "./Enemy/Path/PathPlanning"; 
import ResourceSystem from "./Environment/ResourceSystem";

const {ccclass, property} = cc._decorator;

export enum GameState {
    INIT = 0,
    DEFFENSING = 1,
    BUILDING = 2,
    ENDING = 3
}
//------------------//

interface BlockInfo {
    type: string; 
    building: string;
}
//------------------//

@ccclass
export default class GameController extends cc.Component {

    @property
    GameDuration: number = 300;

    @property(cc.Node)
    InfoManager: cc.Node = null;

    @property(cc.Node)
    cursorNode: cc.Node = null;

    @property(cc.Button)
    wareHouseButton: cc.Button = null; // 按鈕用於選擇倉庫建築

    @property(cc.Button)
    swordTowerButton: cc.Button = null; // 按鈕用於選擇劍塔建築

    @property(cc.Button)
    mineButton: cc.Button = null; // 按鈕用於選擇劍塔建築

    @property(cc.Button)
    turretButton: cc.Button = null; // 按鈕用於選擇劍塔建築

    @property(cc.Button)
    sawmillButton: cc.Button = null; // 按鈕用於選擇劍塔建築

    @property(cc.Button)
    quarryButton: cc.Button = null; // 按鈕用於選擇劍塔建築

    @property(cc.Button)
    mageTowerButton: cc.Button = null; // 按鈕用於選擇劍塔建築

    @property(Building)
    buildingManager: Building = null; // 引用 Building 組件

    @property(cc.Node)
    mapGrid: cc.Node = null; // 地圖的父節點

    @property(cc.Node)
    colorRenderNode: cc.Node = null; // 用於渲染地圖顏色的節點


    // system components
    public timeSystem: TimeSystem;
    public terrain: CreateTerrain;
    public incidentSystem: IncidentSystem;
    public resourceSystem: ResourceSystem;
    public building: cc.Node;
    public cursor: KeyboardCursor = null;

    private gameTime: number = 0;
    private incident : IncidentType = IncidentType.NONE;
    private infoManager: InfoManager = null;
    private buildingMode: boolean = false;
    private isGenerateEnemy: boolean = false;
    private pathPlanning: PathPlanning = null; // 路徑規劃系統  
    private score: number = 0;
    public selectedBuildingType: string = "wareHouse"; // 預設建築類型

    //====== System Callback==========//
    onLoad(){}
    

    start () {
        this.init();
    }

    update(dt: number){
        this.updateGameTime(dt);
        // this.updateIncidentSystem(dt);
        this.updateUI();
        this.updateEnemy();
        this.updateTimeRender();
    }


    // ====== Private Methods ========== //
    private init () {

        // get required components
        this.resourceSystem = this.node.getComponent(ResourceSystem);
        this.infoManager = this.InfoManager.getComponent(InfoManager);
        this.timeSystem = this.node.getComponent(TimeSystem);
        this.cursor = this.cursorNode.getComponent(KeyboardCursor);
        this.terrain = this.node.getComponent(CreateTerrain);
        this.incidentSystem = this.node.getComponent(IncidentSystem);
        this.pathPlanning = this.node.getComponent(PathPlanning);
        this.building = cc.find("Canvas/Building");
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
        this.setupBuildingButtons();
        cc.systemEvent.on('building-position', this.onBuildingPlaced, this);

        // initialize local variables
        this.score = 0;
        this.gameTime = 0;
        this.incident = IncidentType.NONE;
        this.infoManager.updateWavesLabel(0);
        this.infoManager.updateDay(this.timeSystem.getCurrentTimeState());
        this.infoManager.updateGameTime(this.gameTime);
        this.infoManager.updateIncident(this.incident);
        this.buildingMode = false;
        this.isGenerateEnemy = false;
        this.colorRenderNode.opacity = 0;
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
        this.infoManager.updateResource(this.resourceSystem.getWoods(), this.resourceSystem.getStones(), this.resourceSystem.getOres());
    }

    private updateEnemy() {
        if(this.timeSystem.getCurrentTimeState() === TimeState.NIGHT && !this.isGenerateEnemy) {
            this.isGenerateEnemy = true;
            this.callEnemy();
        }
        else if (this.timeSystem.getCurrentTimeState() === TimeState.DAY) {
            this.isGenerateEnemy = false;
        }
    }

    private updateTimeRender() {
        const timeState = this.timeSystem.getCurrentTimeState();
        const currentTime = this.timeSystem.getGameTime();
        if(timeState == TimeState.DAY) {
            this.colorRenderNode.opacity = 0;
            this.colorRenderNode.color = cc.Color.WHITE;
        } else if(timeState == TimeState.NIGHT) {
            this.colorRenderNode.opacity = 100;
            this.colorRenderNode.color = cc.Color.BLACK;
        }
        

    }

    private callEnemy(){
        // TODO2: call your generate function, and store the enemy object tag or access in gameController.
        this.pathPlanning.spawnEnemy();
        console.log("enemy attack from the boundry");
    }

    private onBuildingPlaced(event: cc.Event.EventCustom) {
        if (!this.buildingMode) {
            //console.log("Building mode is not active. Ignoring building placement.");
            return;
        }
        const position = event.getUserData();
        let grid = this.terrain.getGridInfo(position.x + 2416, position.y + 2416);//{ blockType: string, resourceType: string }
        if(grid.blockType == 'water' ) {
            cc.log("Cannot place building on water.");
            return;
        };
        if(this.selectedBuildingType == "sawmill" && grid.resourceType != "tree") {
            cc.log("Cannot place sawmill on non-tree resource.");
            return;
        }
        if(this.selectedBuildingType == "quarry" && grid.blockType != "stone") {
            cc.log("Cannot place quarry on non-stone resource.");
            return;
        }
        if(this.selectedBuildingType == "mine" && grid.resourceType != "ore") {
            cc.log("Cannot place mine on non-ore resource.");
            return;
        }
        //TODO can't build on tree
        if(this.selectedBuildingType != "sawmill" && grid.resourceType == "tree"){
            cc.log("expect sawmill , no other building can be placed on tree resource.");
            return;
        }
        //TODO can't build on other building
        if(!this.buildingManager.ableBuild(position.x , position.y)){
            cc.log("There is already a building at this position.");
            return;
        }
        console.log("Building placement event received.");
        console.log("building type:", this.selectedBuildingType);
        console.log("event data:", event.getUserData());
        this.buildingManager.onBuildingPlaced(event, this.building, this.selectedBuildingType);
        console.log("finish call onBuildingPlaced");
        this.buildingMode = false;
        this.cursor.setCursorActive(false);
    }

    private setupBuildingButtons() {
    // 綁定倉庫按鈕事件
        this.wareHouseButton.node.on('click', () => {
            this.selectBuildingType("wareHouse"); // 設置建築類型為 wareHouse
            this.buildingMode = true; // 啟用建築模式
            this.cursor.setCursorActive(true); // 啟用光標
        }, this);
        // 綁定劍塔按鈕事件
        this.swordTowerButton.node.on('click', () => {
            this.selectBuildingType("swordTower"); // 設置建築類型為 swordTower
            this.buildingMode = true; // 啟用建築模式
            this.cursor.setCursorActive(true); // 啟用光標
        }, this);
        this.turretButton.node.on('click', () => {
            this.selectBuildingType("turret"); // 設置建築類型為 swordTower
            this.buildingMode = true; // 啟用建築模式
            this.cursor.setCursorActive(true); // 啟用光標
        }, this);
        this.sawmillButton.node.on('click', () => {
            this.selectBuildingType("sawmill"); // 設置建築類型為 swordTower
            this.buildingMode = true; // 啟用建築模式
            this.cursor.setCursorActive(true); // 啟用光標
        }, this);
        this.mineButton.node.on('click', () => {
            this.selectBuildingType("mine"); // 設置建築類型為 swordTower
            this.buildingMode = true; // 啟用建築模式
            this.cursor.setCursorActive(true); // 啟用光標
        }, this);
        this.quarryButton.node.on('click', () => {
            this.selectBuildingType("quarry"); // 設置建築類型為 swordTower
            this.buildingMode = true; // 啟用建築模式
            this.cursor.setCursorActive(true); // 啟用光標
        }, this);
        this.mageTowerButton.node.on('click', () => {
            this.selectBuildingType("mageTower"); // 設置建築類型為 swordTower
            this.buildingMode = true; // 啟用建築模式
            this.cursor.setCursorActive(true); // 啟用光標
        }, this);
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

    public addScore(points: number) {
        this.score += points;
        console.log(`Score updated: ${this.score}`);
    }

    public getScore(): number {
        return this.score;
    }

    public selectBuildingType(type: string) {
        this.selectedBuildingType = type;
        console.log(`Selected building type: ${type}`);
    }
}
