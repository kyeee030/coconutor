// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.htmls

const {ccclass, property} = cc._decorator;
import CreateTerrain from "../CreateTerrain";


enum Direction {
    NONE,
    UP,
    DOWN,
    LEFT,
    RIGHT
}

@ccclass
export default class CameraMove extends cc.Component {
    // LIFE-CYCLE CALLBACKS:

    @property(Number)
    moveSpeed: number = 10;

    @property(cc.Node)
    cameraNode: cc.Node = null;

    private _camera: cc.Camera = null;
    private _cameraRBody: cc.RigidBody = null;
    private _keyboardControl: any = null;
    private _moveDirection: Direction = Direction.NONE;
    private _terrain: CreateTerrain;

    onLoad () {
        this._camera = this.cameraNode.getComponent(cc.Camera);
        this._cameraRBody = this.cameraNode.getComponent(cc.RigidBody);
        this._keyboardControl = this.node.getComponent("KeyboardControl");
        this._terrain = this.node.getComponent(CreateTerrain);

        if (!this._keyboardControl) {
            cc.error("CameraMove: KeyboardControl component not found!");
            return;
        }
        if (!this._cameraRBody) {
            cc.error("CameraMove: RigidBody component not found!");
            return;
        }
        if (!this._camera) {
            cc.error("CameraMove: Camera component not found!");
            return;
        }

        cc.director.getPhysicsManager().enabled = true;

        // cc.systemEvent.on('mousewheel', this.onMouseWheel, this); // 沒用
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

        // switch (this._moveDirection) {
        //     case Direction.UP:
        //         this._cameraRBody.linearVelocity = cc.v2(0, this.moveSpeed);
        //         break;
        //     case Direction.DOWN:
        //         this._cameraRBody.linearVelocity = cc.v2(0, -this.moveSpeed);
        //         break;
        //     case Direction.LEFT:
        //         this._cameraRBody.linearVelocity = cc.v2(-this.moveSpeed, 0);
        //         break;
        //     case Direction.RIGHT:
        //         this._cameraRBody.linearVelocity = cc.v2(this.moveSpeed, 0);
        //         break;
        //     case Direction.NONE:
        //         this._cameraRBody.linearVelocity = cc.v2(0, 0);
        //         break;
        //     default:
        //         cc.error("CameraMove: Unknown move direction!");
        //         break;
        // }
        let outOfBounds = false;
        let backspeed: cc.Vec2 = cc.v2(0, 0);
        if(Math.abs(this.cameraNode.position.x) > this._terrain.terrainWidth * this._terrain.blockSize / 2 || Math.abs(this.cameraNode.position.y) > this._terrain.terrainHeight * this._terrain.blockSize / 2) {
            outOfBounds = true;
            console.warn("CameraMove: Camera position out of bounds, move toward to (0, 0)");
            const speedx = Math.abs(this.cameraNode.position.x) > this._terrain.terrainWidth * this._terrain.blockSize / 2 ? this.moveSpeed * this.cameraNode.position.x / (this._terrain.terrainWidth * this._terrain.blockSize / 2) * 0.85 : 0;
            const speedy = Math.abs(this.cameraNode.position.y) > this._terrain.terrainHeight * this._terrain.blockSize / 2 ? this.moveSpeed * this.cameraNode.position.y / (this._terrain.terrainHeight * this._terrain.blockSize / 2) * 0.85 : 0;
            backspeed = cc.v2(speedx, speedy);
        }

        this._cameraRBody.linearVelocity = cc.v2(
            (this._keyboardControl.isKeyDown(cc.macro.KEY.d) || this._keyboardControl.isKeyDown(cc.macro.KEY.right) ? this.moveSpeed : 0) - (this._keyboardControl.isKeyDown(cc.macro.KEY.a) || this._keyboardControl.isKeyDown(cc.macro.KEY.left) ? Math.max(0, this.moveSpeed + backspeed.x) : backspeed.x),
            (this._keyboardControl.isKeyDown(cc.macro.KEY.w) || this._keyboardControl.isKeyDown(cc.macro.KEY.up) ? this.moveSpeed : 0) - (this._keyboardControl.isKeyDown(cc.macro.KEY.s) || this._keyboardControl.isKeyDown(cc.macro.KEY.down) ? Math.max(0, this.moveSpeed + backspeed.y) : backspeed.y)
        )
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

    onMouseWheel (event: cc.Event.EventMouse) {
        const delta = event.getScrollY();
        this._camera.zoomRatio += delta * 0.1;
    }

}
