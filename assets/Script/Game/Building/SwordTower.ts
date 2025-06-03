import Building, { BuildingState } from "./Building";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SwordTower extends Building {

    @property       //when testing property you can change it at the right side :)
    hp: number = 3 ;
    @property
    level: number = 3; // 建築物等級
    @property
    damage: number = 3 ;
    @property
    attackRange: number = 3 ;
    @property
    attackSpeed: number = 3; // 攻擊速度

    start() {
        super.start(); // 調用父類的 `start` 方法
        console.log("SwordTower initialized with additional properties.");
    }

    attack(): void {
        console.log("SwordTower is attacking!");
        // 劍塔的專屬攻擊邏輯
        this.createSword();
    }

    createSword(): void {
        console.log(`SwordTower creates a sword with damage:`);
        // 在這裡實現生成劍的邏輯，例如生成一個劍的 Prefab
    }

    updateProperties(hp: number, damage: number, attackRange: number): void {
        this.hp = hp;
        this.damage = damage;
        this.attackRange = attackRange;
        console.log(`SwordTower updated: HP=${this.hp}, Damage=${this.damage}, Range=${this.attackRange}`);
    }
}