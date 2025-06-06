import Building from "./Building";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BuildingInfoPanel extends cc.Component {
    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.Label)
    levelLabel: cc.Label = null;

    @property(cc.Label)
    hpLabel: cc.Label = null;

    @property(cc.Label)
    damageLabel: cc.Label = null;

    @property(cc.Label)
    attackRangeLabel: cc.Label = null;

    // @property(cc.Button)
    // closeButton: cc.Button = null;

    onLoad(): void {
        // 為 closeButton 添加點擊事件
        // if (this.closeButton) {
        //     this.closeButton.node.on(cc.Node.EventType.TOUCH_END, this.hide, this);
        // } else {
        //     console.error("Close button is not set!");
        // }
    }

    // showBuildingInfo(building: Building): void {
    //     if (!building) {
    //         console.error("Building is not defined!");
    //         return;
    //     }
    //     this.nameLabel.string = `${building._buildingType}`;
    //     this.levelLabel.string = `Level: ${building.level || 1}`;
    //     this.hpLabel.string = `HP: ${building.hp}`;
    //     this.damageLabel.string = `Damage: ${building.damage}`;
    //     this.attackRangeLabel.string = `Attack Range: ${building.attackRange}`;
    //     this.node.active = true;
    // }

    // hide(): void {
    //     console.log("Hiding Building Info Panel");
    //     this.node.active = false;
    // }
}