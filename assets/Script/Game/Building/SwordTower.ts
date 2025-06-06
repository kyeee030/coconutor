import SwordBullet from "../Misc/SwordBullet";
import Targeting from "../Misc/Targeting";
import Building, { BuildingState } from "./Building";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SwordTower extends Building {
    
    // @property       //when testing property you can change it at the right side :)
    // override hp: number = 3 ;
    // @property
    // override level: number = 3; 
    // @property
    // override damage: number = 3 ;
    // @property
    // override attackRange: number = 3 ;
    // @property
    // override attackSpeed: number = 3; 
    // @property
    // override name: string = "SwordTower"; 
    @property(cc.Node)
    infoPanelNode: cc.Node = null;

    @property(cc.Node)
    headNode: cc.Node = null;

    private _animation: cc.Animation = null;

    start() {
        super.start(); 
        this._buildingType = "SwordTower"; // 設置建築物類型
        if (!this.infoPanelNode) {
            console.warn("Info panel node is not initialized in start.");
        } else {
            console.log("Info panel node is ready in start.");
            this.infoPanelNode.on(cc.Node.EventType.TOUCH_END, this.showInfoPanel, this.infoPanelNode);
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

        // test
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

    // onLoad(): void {
    //     this.node.on(cc.Node.EventType.TOUCH_END, this.showInfoPanel, this);

    //     if (!this.infoPanelNode) {
    //         console.warn("Info panel node is not initialized yet in onLoad.");
    //     } else {
    //         this.infoPanelNode.on(cc.Node.EventType.TOUCH_END, this.showInfoPanel, this.infoPanelNode);
    //     }
    // }

    attack(): void {
        console.log("SwordTower is attacking!");
        this._animation.play("SwordTowerAttack");
        super.attack();
    }

    createBullet(): void {
        console.log(`SwordTower creates a sword with damage:`);
        const bulletNode = cc.instantiate(this.bullet);
        bulletNode.setPosition(this.node.position); 
        const bulletComponent = bulletNode.getComponent(SwordBullet); 
        bulletComponent.damage = this.damage;
        bulletComponent.setTarget(this._targetNode);
        this._canvas.addChild(bulletNode); 
        
    }

    // override showInfoPanel(): void {
    //     if (!this.infoPanelNode) {
    //         console.error("Info panel node is not initialized!");
    //         return;
    //     }

    //     if (this.infoPanelNode.active) {
    //         this.infoPanelNode.active = false;
    //         return;
    //     }

    //     this.infoPanelNode.active = true;

    //     const nameLabel = this.infoPanelNode.getChildByName("name").getComponent(cc.Label);
    //     const levelLabel = this.infoPanelNode.getChildByName("level").getComponent(cc.Label);
    //     const hpLabel = this.infoPanelNode.getChildByName("hp").getComponent(cc.Label);
    //     const damageLabel = this.infoPanelNode.getChildByName("damage").getComponent(cc.Label);
    //     const attackRangeLabel = this.infoPanelNode.getChildByName("attackRange").getComponent(cc.Label);

    //     nameLabel.string = `Name: ${this.name}`;
    //     levelLabel.string = `Level: ${this.level}`;
    //     hpLabel.string = `HP: ${this.hp}`;
    //     damageLabel.string = `Damage: ${this.damage}`;
    //     attackRangeLabel.string = `Attack Range: ${this.attackRange}`;
    // }

    // override onBuildingPlaced(event: cc.Event.EventCustom, buildingRoot: cc.Node, selectedBuildingType: string): void {
    //     console.log("swordTower : onBuildingPlaces");
    //     const position = event.getUserData();

    //     const buildingPrefab = this.getPrefabByType(selectedBuildingType);
    //     if (!buildingPrefab) {
    //         console.error("No building prefab found for type:", selectedBuildingType);
    //         return;
    //     }

    //     const buildingNode = cc.instantiate(buildingPrefab);
    //     buildingNode.setPosition(position.x, position.y);

    //     if (buildingRoot) {
    //         buildingRoot.addChild(buildingNode); // 將建築物添加到建築根節點
    //     } else {
    //         console.error("Building root node is not set!");
    //         return;
    //     }

    //     this.infoPanelNode = cc.instantiate(this.infoPanel);
    //     buildingNode.addChild(this.infoPanelNode); 
    //     this.infoPanelNode.setPosition(0, 0); 
    //     this.infoPanelNode.active = false; 
    //     console.log("Info panel added to building node.");

    // }

    updateProperties(hp: number, damage: number, attackRange: number , level: number): void {
        this.hp = hp;
        this.damage = damage;
        this.attackRange = attackRange;
        console.log(`SwordTower updated: HP=${this.hp}, Damage=${this.damage}, Range=${this.attackRange}`);
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node.group === "Enemy") {
            // 對敵人造成傷害
            console.log("SwordTower hit an enemy!");
            // 在這裡添加對敵人造成傷害的邏輯
        } else if (otherCollider.node.group === "Building") {
            console.log("SwordTower hit a building, no damage is applied.");
        }
    }
}