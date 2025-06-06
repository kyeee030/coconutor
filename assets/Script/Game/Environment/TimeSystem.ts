const {ccclass, property} = cc._decorator;

export enum TimeState {
    DAY,
    NIGHT,
}

@ccclass
export default class TimeSystem extends cc.Component {
    
    @property
    timeInterval: number = 5;

    @property
    dayTime: number = 30;

    @property
    nightTime: number = 30;

    private timeState: TimeState = TimeState.DAY;
    private gameTime: number = 0;
    private waveCount: number = 0;

    onLoad(){
        this.gameTime = 0;
        this.waveCount = 0;
        this.timeState = TimeState.DAY;
    }

    start(){
        this.gameTime = 0;
        this.waveCount = 0;
        this.timeState = TimeState.DAY;
    }

    private updateTimeStateMachine() {
        if( this.timeState === TimeState.DAY && this.gameTime >= this.dayTime) {
            this.gameTime = 0;
            this.timeState = TimeState.NIGHT;
            this.waveCount++;
            console.log("Transitioning to NIGHT");
        }
        else if(this.timeState === TimeState.NIGHT && this.gameTime >= this.nightTime) {
            this.gameTime = 0;
            this.timeState = TimeState.DAY;
            console.log("Transitioning to DAY");
        }
    }

    public getCurrentTimeState(): TimeState {
        return this.timeState;
    }

    public changeCurrentTimeState(newState: TimeState) {
        this.timeState = newState;
        this.gameTime = 0;
        console.log("Time state changed to: " + TimeState[this.timeState]);
    }

    public getGameTime(): number{
        return Math.floor(this.gameTime);
    }

    public updateGameTime(dt: number){
        this.gameTime += dt;
        this.updateTimeStateMachine();
    }

    public getWaveCount(): number {
        return this.waveCount;
    }

}