const {ccclass, property} = cc._decorator;

@ccclass
export default class NodeElement extends cc.Component {

    @property
    _w: number = 0;
    @property
    _h: number = 0;
    @property
    _x1: number = 0;
    @property
    _y1: number = 0;

    _x2: number = 0;
    _y2: number = 0;

    _collider: cc.PhysicsBoxCollider = null;

    _isBlocked: boolean = false;

    

    onLoad () {
        
    }

    init(x1: number, y1: number, w: number, h: number, isBlocked: boolean) {
        this._collider = this.getComponent(cc.PhysicsBoxCollider);
        this.node.setPosition(cc.v2(x1 + w / 2, y1 + h / 2));
        this._x1 = x1;
        this._y1 = y1;
        this._w = w;
        this._h = h;
        this._x2 = x1 + w;
        this._y2 = y1 + h;
        this._collider.size = cc.size(w, h);
        this._isBlocked = isBlocked;
    }

    // onBeginContact (self: cc.Collider) {

    // }

    // start () {}

    // update (dt) {}
}
