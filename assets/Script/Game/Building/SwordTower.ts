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

    start() {
        super.start(); 
        this._buildingType = "SwordTower"; // 設置建築物類型
        if (!this.infoPanelNode) {
            console.warn("Info panel node is not initialized in start.");
        } else {
            console.log("Info panel node is ready in start.");
            this.infoPanelNode.on(cc.Node.EventType.TOUCH_END, this.showInfoPanel, this.infoPanelNode);
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
        super.attack(); // 呼叫父類別的攻擊方法
    }

    createBullet(): void {
        console.log(`SwordTower creates a sword with damage:`);
        // 在這裡實現生成劍的邏輯，例如生成一個劍的 Prefab
        const bulletNode = cc.instantiate(this.bullet);
        bulletNode.setPosition(this.node.position); // 設置子彈位置為建築物位置
        this._canvas.addChild(bulletNode); // 將子彈添加到 Canvas 節點下
        
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
}