// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.htmls

const {ccclass, property} = cc._decorator;


enum Direction {
    NONE,
    UP,
    DOWN,
    LEFT,
    RIGHT
}

@ccclass
export default class NewClass extends cc.Component {
    // LIFE-CYCLE CALLBACKS:

    @property(Number)
    private moveSpeed: number = 10;

    private _cameraRBody: cc.RigidBody = null;
    private _keyboardControl: any = null;
    private _moveDirection: Direction = Direction.NONE;

    onLoad () {
        this._cameraRBody = this.node.getComponent(cc.RigidBody);

        this._keyboardControl = this.node.getComponent("KeyboardControl");
        if (!this._keyboardControl) {
            cc.error("CameraMove: KeyboardControl component not found!");
            return;
        }

        cc.director.getPhysicsManager().enabled = true;
    }

    update (dt) {
        this.updateSpeed(dt);
    }

    updateSpeed (dt: number) {
        if(!this._keyboardControl) {
            cc.error("CameraMove: KeyboardControl component not found!");
            return;
        }
        this.updateDirection();

        switch (this._moveDirection) {
            case Direction.UP:
                this._cameraRBody.linearVelocity = cc.v2(0, this.moveSpeed);
                break;
            case Direction.DOWN:
                this._cameraRBody.linearVelocity = cc.v2(0, -this.moveSpeed);
                break;
            case Direction.LEFT:
                this._cameraRBody.linearVelocity = cc.v2(-this.moveSpeed, 0);
                break;
            case Direction.RIGHT:
                this._cameraRBody.linearVelocity = cc.v2(this.moveSpeed, 0);
                break;
            case Direction.NONE:
                this._cameraRBody.linearVelocity = cc.v2(0, 0);
                break;
            default:
                cc.error("CameraMove: Unknown move direction!");
                break;
        }
    }

    updateDirection () {
        if(!this._keyboardControl) {
            cc.error("CameraMove: KeyboardControl component not found!");
            return;
        }

        if(!this._keyboardControl.isKeyDown(cc.macro.KEY.s) && !this._keyboardControl.isKeyDown(cc.macro.KEY.down) && this._keyboardControl.isKeyDown(cc.macro.KEY.w) || this._keyboardControl.isKeyDown(cc.macro.KEY.up)) {
            this._moveDirection = Direction.UP;
        } else if(!this._keyboardControl.isKeyDown(cc.macro.KEY.w) && !this._keyboardControl.isKeyDown(cc.macro.KEY.up) && this._keyboardControl.isKeyDown(cc.macro.KEY.s) || this._keyboardControl.isKeyDown(cc.macro.KEY.down)) {
            this._moveDirection = Direction.DOWN;
        } else if(!this._keyboardControl.isKeyDown(cc.macro.KEY.d) && !this._keyboardControl.isKeyDown(cc.macro.KEY.right) && this._keyboardControl.isKeyDown(cc.macro.KEY.a) || this._keyboardControl.isKeyDown(cc.macro.KEY.left)) {
            this._moveDirection = Direction.LEFT;
        } else if(!this._keyboardControl.isKeyDown(cc.macro.KEY.a) && !this._keyboardControl.isKeyDown(cc.macro.KEY.left) && this._keyboardControl.isKeyDown(cc.macro.KEY.d) || this._keyboardControl.isKeyDown(cc.macro.KEY.right)) {
            this._moveDirection = Direction.RIGHT;
        } else {
            this._moveDirection = Direction.NONE;
        }
    }

}
