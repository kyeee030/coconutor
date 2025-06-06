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

    onLoad(): void {

    }

    setBuildingInfo(name: string, level: number, hp: number, damage: number, attackRange: number): void {
        this.nameLabel.string = `${name}`;
        this.levelLabel.string = `Level: ${level}`;
        this.hpLabel.string = `HP: ${hp}`;
        this.damageLabel.string = `Damage: ${damage}`;
        this.attackRangeLabel.string = `Attack Range: ${attackRange}`;
        this.node.active = true;
    }
}