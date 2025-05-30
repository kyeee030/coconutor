import CreateTerrain from "./CreateTerrain";
import TimeSystem from "./Environment/TimeSystem";
import { IncidentType } from "./Environment/IncidentSystem";
import IncidentSystem from "./Environment/IncidentSystem";
import InfoManager from "./UI/InfoManager";

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


    // system components
    public timeSystem: TimeSystem;
    public terrain: CreateTerrain;
    public incidentSystem: IncidentSystem;

    private gameTime: number = 0;
    private incident : IncidentType = IncidentType.NONE;
    private infoManager: InfoManager = null;

    //====== System Callback==========//
    onLoad(){}
    

    start () {
        this.init();
    }

    update(dt: number){
        this.updateGameTime(dt);
        this.updateIncidentSystem(dt);
        this.updateUI();
    }


    // ====== Private Methods ========== //
    private init () {
        this.infoManager = this.InfoManager.getComponent(InfoManager);
        this.timeSystem = this.node.getComponent(TimeSystem);
        this.terrain = this.node.getComponent(CreateTerrain);
        this.incidentSystem = this.node.getComponent(IncidentSystem);
        if (!this.timeSystem || !this.terrain || !this.incidentSystem) {
            console.error("GameController: Missing required components (TimeSystem or CreateTerrain)");
            return;
        }

        this.timeSystem.start();
        this.terrain.start();
        this.incidentSystem.start();
        console.log("GameController initialized with TimeSystem and CreateTerrain.");
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

}
