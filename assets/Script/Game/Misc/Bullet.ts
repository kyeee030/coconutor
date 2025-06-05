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
    lifetime: number = 3.0;

    @property(cc.Float)
    size: number = 0.5;

    @property(cc.Node)
    sprites: cc.Node[] = [];

    protected _direction: cc.Vec2 = cc.Vec2.ZERO;
    protected _RBody: cc.RigidBody = null;
    protected _timer: number = 0;
    protected _target: cc.Node = null;
    protected _source: cc.Node = null;
    protected _animation: cc.Animation = null;
    protected _spriteHeadAngle: number = 45; // 頭部角度

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
        this._animation = this.getComponent(cc.Animation);

        this._timer = 0;
    }

    update (dt) {
        this._timer += dt;
        if (this._timer >= this.lifetime && !this.disappeared) {
            this.disappear();
            this.disappeared = true;
            return;
        }
    }

    private disappeared: boolean = false;

    disappear() {
        console.log("deleting bullet");
        this.node.destroy();
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

        if(!targetPosition || !currentPosition) {
            console.error("Target or current position is not defined.");
            return;
        }

        this._direction = cc.v2(targetPosition.x - currentPosition.x, targetPosition.y - currentPosition.y).normalize();
        this.node.rotation = cc.misc.radiansToDegrees(Math.atan2(this._direction.y, this._direction.x));
    }

    setDirection(direction: cc.Vec2) {
        if (!direction || !(direction instanceof cc.Vec2)) {
            console.error("Invalid direction provided. It must be a cc.Vec2 instance.");
            return;
        }
        this._direction = direction.normalize();
        const angle = cc.misc.radiansToDegrees(Math.atan2(this._direction.y, this._direction.x));
        console.log(`Setting bullet direction to angle: ${angle} degrees`);
        this.node.angle = angle - this._spriteHeadAngle;
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node.group === "Enemy") {
            // 對敵人造成傷害
        } else if (otherCollider.node.group === "Building") {
            console.log("Bullet hit a building, no damage is applied.");
            this.node.destroy();
            // 如果要打到自己建築有效果寫在這
        } else {
            console.log("Bullet hit an unhandled object.");
        }
    }
}
