import Building, { BuildingState } from "./Building";
import Targeting from "../Misc/Targeting";
const { ccclass, property } = cc._decorator;
import SwordBullet from "../Misc/SwordBullet";

@ccclass
export default class SwordTower extends Building {
    
    // @property(cc.Node)
    // infoPanelNode: cc.Node = null;

    @property(cc.Node)
    headNode: cc.Node = null;

    private _animation: cc.Animation = null;

    onLoad () {
        super.onLoad();
        if(this.rangeNode) {
            this._targetingSystem = this.node.getComponent(Targeting);
        }
    }

    start() {
        super.start(); 
        this.buildingType = "SwordTower"; // 設置建築物類型
        if (!this.infoPanelNode) {
            console.warn("Info panel node is not initialized in start.");
        } else {
            console.log("Info panel node is ready in start.");
            //this.infoPanelNode.on(cc.Node.EventType.TOUCH_END, this.showInfoPanel, this.infoPanelNode);
        }

        this._animation = this.headNode.getComponent(cc.Animation);
        
        
        if(!this._canvas)
            this._canvas = cc.find("Canvas");

        if(!this._targetingSystem && this.rangeNode) {
            this._targetingSystem = this.rangeNode.getComponent(Targeting);
            if (!this._targetingSystem) {
                console.error("Targeting component not found on rangeNode.");
            } else {
                this._targetingSystem.selfNode = this.node; // 設置 selfNode 為當前建築物節點
            }
        }

        // this.attack();
    }

    update(dt) {
        // super.update(dt);
        // console.log("target: ", this._targetingSystem.getTargets());
        const targets = this._targetingSystem.getTargets();
        if(targets.length > 0) {
            if(targets[0] != this._targetNode) {
                this._targetNode = targets[0];
                this.schedule(()=>{
                    this.attack();
                }, this.attackSpeed);
            }
        } else {
            this._targetNode = null;
        }

        if(this._targetNode != null && this.headNode) {
            const targetDirection = cc.v2(this._targetNode.position.x - this.node.position.x,
            this._targetNode.position.y - this.node.position.y).normalize();
            const angle = cc.misc.radiansToDegrees(Math.atan2(targetDirection.y, targetDirection.x));
            this.headNode.angle = angle - 90;
        } else {
            this.headNode.angle += 1;
        }
    }

    attack(): void {
        console.log("SwordTower is attacking!");
        this._animation.play("SwordTowerAttack");
        super.attack(); // 呼叫父類別的攻擊方法
    }

    createBullet(): void {
        // console.log(`SwordTower creates a sword with damage:`);
        const bulletNode = cc.instantiate(this.bullet);
        bulletNode.setPosition(this.node.position); 
        const bulletComponent = bulletNode.getComponent(SwordBullet); 
        bulletComponent.damage = this.damage;
        bulletComponent.setTarget(this._targetNode);
        this._canvas.addChild(bulletNode); 
        
    }

    updateProperties(hp: number, damage: number, attackRange: number , level: number): void {
        this.hp = hp;
        this.damage = damage;
        this.attackRange = attackRange;
        console.log(`SwordTower updated: HP=${this.hp}, Damage=${this.damage}, Range=${this.attackRange}`);
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node.group === "Enemy") {
            console.log("SwordTower hit an enemy!");
        } else if (otherCollider.node.group === "Building") {
            console.log("SwordTower hit a building, no damage is applied.");
        }
    }
}