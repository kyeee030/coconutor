// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Bullet extends cc.Component {

    @property(Number)
    level: number = 1;

    @property(Number)
    damage: number = 0;

    @property(Number)
    speed: number = 0;

    @property(cc.Float)
    lifetime: number = 5.0;

    @property(cc.Node)
    sprites: cc.Node[] = [];

    protected _direction: cc.Vec2 = cc.Vec2.ZERO;
    protected _RBody: cc.RigidBody = null;
    protected _timer: number = 0;
    protected _target: cc.Node = null; // Target node to follow

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._RBody = this.getComponent(cc.RigidBody);
        if (!this._RBody) {
            console.error("Bullet requires a RigidBody component.");
        }

        this.sprites.forEach(sprite => {
            if (sprite) {
                sprite.active = false;
            } else {
                console.warn("Sprite node is not set or is null.");
            }
        });
        this.sprites[Math.min(this.level - 1, this.sprites.length - 1)].active = true;

        this._timer = 0;
    }

    update (dt) {
        this._timer += dt;
        if (this._timer >= this.lifetime) {
            this.node.destroy();
            return;
        }
    }

    setSpeed(speed: number) {
        this.speed = speed;
        if (this._RBody) {
            this._RBody.linearVelocity = cc.v2(this._direction.x * this.speed, this._direction.y * this.speed);
        } else {
            console.warn("RigidBody component is not available to set speed.");
        }
    }

    setTarget(target: cc.Node) {
        this._target = target;
        this.updateDirection();
    }

    updateDirection() {
        if(!this._target) {
            console.warn("Target is not set for the bullet.");
            return;
        }

        const targetPosition = this._target.position;
        const currentPosition = this.node.position;
        this._direction = cc.v2(targetPosition.x - currentPosition.x, targetPosition.y - currentPosition.y).normalize();
        this.node.rotation = cc.misc.radiansToDegrees(Math.atan2(this._direction.y, this._direction.x));
    }
}
