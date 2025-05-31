// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Keyboard extends cc.Component {
    // LIFE-CYCLE CALLBACKS:

    private _keyDown : boolean[] = [];

    onLoad () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this._keyDown = [];
    }

    onKeyDown (event: cc.Event.EventKeyboard) {
        this._keyDown[event.keyCode] = true;
    }

    onKeyUp (event: cc.Event.EventKeyboard) {
        this._keyDown[event.keyCode] = false;
    }

    isKeyDown (keyCode: number): boolean {
        return this._keyDown[keyCode] || false;
    }



    // update (dt) {}
}
