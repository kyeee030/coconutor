// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Bullet from "./Bullet";
import Enemy from "../Enemy/Enemy";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MagicBullet extends Bullet {

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        super.onLoad();
        this.damage = 10;
        this.speed = 300;
        this.lifetime = 2.0;
        // this.updateDirection();
        // this.setDirection(cc.v2(-0.5, -0.5)); // test
    }

    update (dt) {
        this._RBody.linearVelocity = cc.v2(this._direction.x * this.speed, this._direction.y * this.speed);
        super.update(dt);
    }

    disappear() {
        this.sprites.forEach(sprite => {
            if (sprite) {
                sprite.active = false;
            } else {
                console.warn("Sprite node is not set or is null.");
            }
        });
        this._direction = cc.Vec2.ZERO;
        const animState = this._animation.play("Magic1");
        animState.wrapMode = cc.WrapMode.Normal;
        // console.log("SwordBullet disappear");
        this._animation.on(cc.Animation.EventType.FINISHED, () => {
            super.disappear();
        }, this);
    }
}
