import Building, { BuildingState } from "./Building";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Mine extends Building {

    private _animation: cc.Animation = null;

    start() {
        super.start(); 
        this.buildingType = "mine"; // 設置建築物類型
    }

    updateProperties(hp: number, damage: number, attackRange: number , level: number): void {
        this.hp = hp;
        this.damage = damage;
        this.attackRange = attackRange;
        console.log(`Mine updated: HP=${this.hp}, Damage=${this.damage}, Range=${this.attackRange}`);
    }

}