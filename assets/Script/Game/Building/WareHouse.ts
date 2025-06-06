import Building, { BuildingState } from "./Building";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WareHouse extends Building {
    
    // @property(cc.Node)
    // infoPanelNode: cc.Node = null;

    // @property(cc.Node)
    // headNode: cc.Node = null;

    private _animation: cc.Animation = null;

    start() {
        super.start(); 
        this._buildingType = "wareHouse"; // 設置建築物類型
        if (!this.infoPanelNode) {
            console.warn("Info panel node is not initialized in start.");
        } else {
            console.log("Info panel node is ready in start.");
            //this.infoPanelNode.on(cc.Node.EventType.TOUCH_END, this.showInfoPanel, this.infoPanelNode);
        }

        //this._animation = this.headNode.getComponent(cc.Animation);
        
        if(!this._canvas)
            this._canvas = cc.find("Canvas");



        // test
        this.attack();
    }

    update(dt) {
        super.update(dt);
        // if(this._targetNode && this.headNode) {
        //     const targetDirection = cc.v2(this._targetNode.position.x - this.node.position.x,
        //     this._targetNode.position.y - this.node.position.y).normalize();
        //     const angle = cc.misc.radiansToDegrees(Math.atan2(targetDirection.y, targetDirection.x));
        //     this.headNode.angle = angle;
        // } else {
        //     this.headNode.angle += 1;
        // }
    }

    attack(): void {
        console.log("Warehouse is attacking!");
        //this._animation.play("WarehouseAttack");
        super.attack(); // 呼叫父類別的攻擊方法
    }

    createBullet(): void {
        console.log(`Warehouse creates a sword with damage:`);
        // 在這裡實現生成劍的邏輯，例如生成一個劍的 Prefab
        // const bulletNode = cc.instantiate(this.bullet);
        // bulletNode.setPosition(this.node.position); // 設置子彈位置為建築物位置
        // this._canvas.addChild(bulletNode); // 將子彈添加到 Canvas 節點下 
    }

    updateProperties(hp: number, damage: number, attackRange: number , level: number): void {
        this.hp = hp;
        this.damage = damage;
        this.attackRange = attackRange;
        console.log(`Warehouse updated: HP=${this.hp}, Damage=${this.damage}, Range=${this.attackRange}`);
    }

    // onBeginContact(contact, selfCollider, otherCollider) {
    //     if (otherCollider.node.group === "Enemy") {
    //         // 對敵人造成傷害
    //         console.log("SwordTower hit an enemy!");
    //         // 在這裡添加對敵人造成傷害的邏輯
    //     } else if (otherCollider.node.group === "Building") {
    //         console.log("SwordTower hit a building, no damage is applied.");
    //     }
    // }
}