import { TimeState } from "../Environment/TimeSystem";
import { IncidentType } from "../Environment/IncidentSystem";
const { ccclass, property } = cc._decorator;

@ccclass
export default class InfoManager extends cc.Component {
    @property(cc.Node)
    topBar: cc.Node = null;
    
    @property(cc.Label)
    waveLabel: cc.Label = null;
    
    @property(cc.Label)
    dayLebel: cc.Label = null;
    
    @property(cc.Label)
    timeLabel: cc.Label = null;
    
    @property(cc.Label)
    incidentLabel: cc.Label = null;
    
    public updateWavesLabel(waves: number): void {
        if (this.waveLabel) {
            this.waveLabel.string = `${waves}`;
        } else {
            console.warn("waveLabel is not set!");
        }
    }
    
    public updateDay(timeState : TimeState): void {
        if (this.dayLebel) {
            this.dayLebel.string = `Day: ${TimeState[timeState]}`;            
        } else {
            console.warn("dayLebel is not set!");
        }
    }

    public updateGameTime(time: number): void {
        if (this.timeLabel) {
            this.timeLabel.string = `GameTime: ${time.toString()}`;
        }
    }

    public updateIncident(incident : IncidentType): void {
        if (this.incidentLabel) {
            this.incidentLabel.string = `Incident: ${IncidentType[incident]}`;
        } else {
            console.warn("incidentLabel is not set!");
        }
    }
    
    // private updateLifeIcons(): void {
    //     if (!this.livesContainer || !this.lifeIconPrefab) {
    //         console.warn("Missing livesContainer or lifeIconPrefab!");
    //         return;
    //     }
        
    //     this.livesContainer.removeAllChildren();
    //     this.lifeIcons = [];
            
    //     this.livesContainer.opacity = 255;
    //     this.livesContainer.active = true;
        
    //     for (let i = 0; i < this.lives; i++) {
    //         const icon = cc.instantiate(this.lifeIconPrefab);
    //         this.livesContainer.addChild(icon);
    //         this.lifeIcons.push(icon);
            
    //         icon.active = true;
    //         icon.opacity = 255;
            
    //         if (icon.width <= 0) icon.width = 32;
    //         if (icon.height <= 0) icon.height = 32;
            
    //         icon.x = i * (icon.width + 10);
    //         icon.y = 0; 
            
    //     }
        
    //     if (this.lives > 0 && this.lifeIcons.length > 0) {
    //         const lastIcon = this.lifeIcons[this.lifeIcons.length - 1];
    //         this.livesContainer.width = lastIcon.x + lastIcon.width;
    //     }
    // }
}