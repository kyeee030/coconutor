// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Building from "../Building/Building";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Targeting extends cc.Component {

    @property(cc.Node)
    selfNode: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:

    private _area: cc.PhysicsCircleCollider = null;
    private _building: Building = null;
    private _target: Set<cc.Node>;
    private _blocksize: number = 64;


    onLoad () {
        if (!this.selfNode) {
            console.error("Targeting component requires a selfNode to be set.");
        }
        this._blocksize = cc.find("GameController").getComponent("CreateTerrain").blockSize;
        this._area = this.node.getComponent(cc.PhysicsCircleCollider);
        this._building = this.selfNode.getComponent(Building);
        this._area.radius = this._building.attackRange * this._blocksize;
        this._area.apply();
        this.node.width = this._area.radius * 2;
        this.node.height = this._area.radius * 2;
        console.log(`Targeting area radius set to: ${this._area.radius}`);
        this._target = new Set<cc.Node>();
    }

    // start () {

    // }

    getTargets () {
        return Array.from(this._target);
    }

    onBeginContact (contact, selfCollider, otherCollider) {
        if (otherCollider.node.group === "Enemy") {
            this._target.add(otherCollider.node);
            console.log(`Target added: ${otherCollider.node.name}`);
        }
    }

    onEndContact (contact, selfCollider, otherCollider) {
        if (otherCollider.node.group === "Enemy") {
            this._target.delete(otherCollider.node);
            console.log(`Target removed: ${otherCollider.node.name}`);
        }
    }

    // update (dt) {}
}
