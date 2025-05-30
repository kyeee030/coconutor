const {ccclass, property} = cc._decorator;

class NodeElement {
    x1: number;
    y1: number;
    w: number;
    h: number;
    isBlocked: boolean;

    constructor(x1: number, y1: number, w: number, h: number, isBlocked: boolean) {
        this.x1 = x1;
        this.y1 = y1;
        this.w = w;
        this.h = h;
        this.isBlocked = isBlocked;
    }
}

@ccclass
export default class PathPlanning extends cc.Component {

    @property(cc.Vec2)
    mapSize: cc.Vec2 = cc.v2(0, 0);

    @property(cc.Vec2)
    startPoint: cc.Vec2 = cc.v2(0, 0);

    @property(cc.Vec2)
    pixelSize: cc.Vec2 = cc.v2(0, 0);
    
    _nodes: NodeElement[][] = [];

    // onLoad () {}

    start () {
        this.init();
    }

    // update (dt) {}

    init () {
        this._nodes = [];
        for (let i = 0; i < this.mapSize.x; i++) {
            const column = [];
            for (let j = 0; j < this.mapSize.y; j++) {
                let node = new NodeElement(
                    this.startPoint.x + i * this.pixelSize.x,  
                    this.startPoint.y + j * this.pixelSize.y,
                    this.pixelSize.x,
                    this.pixelSize.y,
                    false
                );
                column.push(node);
            }
            this._nodes.push(column);
        }
        cc.log(this._nodes);
    }

    findBlock(x: number, y: number): cc.Vec2 | null {
        const xi = Math.floor(x);
        const yi = Math.floor(y);
        if (xi < 0 || xi >= this.mapSize.x || yi < 0 || yi >= this.mapSize.y) {
            return null;
        }
        return new cc.Vec2(xi, yi);
    }

}
