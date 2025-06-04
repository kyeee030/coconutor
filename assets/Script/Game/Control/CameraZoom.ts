// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class CameraZoom extends cc.Component {
    @property(cc.Node)
    cameraNode: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    private _camera: cc.Camera = null;

    onLoad () {
        this._camera = this.cameraNode.getComponent(cc.Camera);
        if (!this._camera) {
            console.error("CameraZoom: Camera component not found on the camera node.");
            return;
        }

        this.node.on(cc.Node.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onMouseWheel, this);
    }

    // start () {

    // }

    clickTest () {
        console.log("CameraMove: Click event detected, zooming camera.");
    }

    // update (dt) {}
    onMouseWheel (event: cc.Event.EventMouse) {
        console.log("CameraMove: Mouse wheel event detected, zooming camera.");
        const delta = event.getScrollY();
        this._camera.zoomRatio += delta * 0.1;
    }

}
