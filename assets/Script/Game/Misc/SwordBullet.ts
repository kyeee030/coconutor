// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Bullet from "./Bullet";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SwordBullet extends Bullet {

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        super.onLoad();
        this.damage = 10;
        this.speed = 300;
        this.lifetime = 2.0;
        // this.updateDirection();
        this.setDirection(cc.v2(-0.5, -0.5)); // test
    }

    update (dt) {
        this._RBody.linearVelocity = cc.v2(this._direction.x * this.speed, this._direction.y * this.speed);
        super.update(dt);
    }
}
