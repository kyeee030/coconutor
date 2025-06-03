import Building, { BuildingState } from "./Building";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SwordTower extends Building {

    @property       //when testing property you can change it at the right side :)
    hp: number = 3 ;
    @property
    level: number = 3; 
    @property
    damage: number = 3 ;
    @property
    attackRange: number = 3 ;
    @property
    attackSpeed: number = 3; 
    @property
    name: string = "SwordTower"; 

    protected infoPanelNode: cc.Node = null; 


    start() {
        super.start(); 
        if (!this.infoPanelNode) {
        console.error("Info panel node is not initialized!");
        } else {
            console.log("Info panel node is ready.");
        }
        console.log("SwordTower initialized with additional properties.");
    }

    attack(): void {
        console.log("SwordTower is attacking!");
        this.createSword();
    }

    createSword(): void {
        console.log(`SwordTower creates a sword with damage:`);
        // 在這裡實現生成劍的邏輯，例如生成一個劍的 Prefab
    }

    showInfoPanel(): void {
        if (!this.infoPanelNode) {
            console.error("Info panel node is not initialized!");
            return;
        }

        if(this.infoPanelNode === null) {
            console.log("InfoPanelNode is null! Please call onBuildingPlaced first.");
            return;
        }
         if (this.infoPanelNode.active) {
            this.infoPanelNode.active = false;
            return;
        }
        // 顯示面板
        this.infoPanelNode.active = true;



        // 更新面板內容
        const nameLabel = this.infoPanelNode.getChildByName("name").getComponent(cc.Label);
        const levelLabel = this.infoPanelNode.getChildByName("level").getComponent(cc.Label);
        const hpLabel = this.infoPanelNode.getChildByName("hp").getComponent(cc.Label);
        const damageLabel = this.infoPanelNode.getChildByName("damage").getComponent(cc.Label);
        const attackRangeLabel = this.infoPanelNode.getChildByName("attackRange").getComponent(cc.Label);

        nameLabel.string = `Name: ${this.name}`;
        levelLabel.string = `Level: ${this.level}`;
        hpLabel.string = `HP: ${this.hp}`;
        damageLabel.string = `Damage: ${this.damage}`;
        attackRangeLabel.string = `Attack Range: ${this.attackRange}`;
    }

    onBuildingPlaced(event: cc.Event.EventCustom, buildingRoot: cc.Node, selectedBuildingType: string): void {

        const position = event.getUserData();

        const buildingPrefab = this.getPrefabByType(selectedBuildingType);
        if (!buildingPrefab) {
            console.error("No building prefab found for type:", selectedBuildingType);
            return;
        }

        const buildingNode = cc.instantiate(buildingPrefab);
        buildingNode.setPosition(position.x, position.y);

        if (buildingRoot) {
            buildingRoot.addChild(buildingNode); // 將建築物添加到建築根節點
        } else {
            console.error("Building root node is not set!");
            return;
        }

        this.infoPanelNode = cc.instantiate(this.infoPanel);
        buildingNode.addChild(this.infoPanelNode); 
        this.infoPanelNode.setPosition(0, 0); 
        this.infoPanelNode.active = false; 
        console.log("Info panel added to building node.");

       

    }

    updateProperties(hp: number, damage: number, attackRange: number , level: number): void {
        this.hp = hp;
        this.damage = damage;
        this.attackRange = attackRange;
        console.log(`SwordTower updated: HP=${this.hp}, Damage=${this.damage}, Range=${this.attackRange}`);
    }
}