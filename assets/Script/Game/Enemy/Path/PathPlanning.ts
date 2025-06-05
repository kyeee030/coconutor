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

    findLocation(x: number, y: number): cc.Vec2 | null {
        const xi = Math.floor((x - this.startPoint.x) / this.pixelSize.x + 0.5);
        const yi = Math.floor((y - this.startPoint.y) / this.pixelSize.y + 0.5);
        if (xi < this.startPoint.x || xi >= this.mapSize.x || yi < this.startPoint.y || yi >= this.mapSize.y) {
            return null;
        }
        return new cc.Vec2(xi, yi);
    }

    findPath(start: cc.Vec2, end: cc.Vec2): cc.Vec2 {  //return the direction
        if(start.equals(end)) return new cc.Vec2(this.startPoint.x + start.x * this.pixelSize.x, this.startPoint.y + start.y * this.pixelSize.y);   
        let dir = [
            new cc.Vec2(1, 0),
            new cc.Vec2(-1, 0),
            new cc.Vec2(0, 1),
            new cc.Vec2(0, -1),
            new cc.Vec2(1, 1),
            new cc.Vec2(1, -1),
            new cc.Vec2(-1, 1),
            new cc.Vec2(-1, -1)
        ];
        let queue: cc.Vec3[] = [];
        let visited: boolean[][] = Array.from({ length: this.mapSize.x }, () => Array(this.mapSize.y).fill(false));
        for(let it of dir) {
            let newX = start.x + it.x;
            let newY = start.y + it.y;
            if (this.checkValid(newX, newY) && !visited[newX][newY]) {
                const idx = dir.indexOf(it);
                queue.push(new cc.Vec3(newX, newY, idx));
                visited[newX][newY] = true;
            }
        }
        while (queue.length > 0) {
            let current = queue.shift();
            if (!current) continue;
            if (current.x === end.x && current.y === end.y) {
                return new cc.Vec2(
                    this.startPoint.x + (dir[current.z].x + start.x) * this.pixelSize.x,
                    this.startPoint.y + (dir[current.z].y + start.y) * this.pixelSize.y
                );
            }
            for (let it of dir) {
                let newX = current.x + it.x;
                let newY = current.y + it.y;
                if (this.checkValid(newX, newY) && !visited[newX][newY]) {
                    queue.push(new cc.Vec3(newX, newY, current.z));
                    visited[newX][newY] = true;
                }
            }
        }
        return new cc.Vec2(0, 0);
    }

    checkValid(x: number, y: number): boolean {
        if (x < 0 || x >= this.mapSize.x || y < 0 || y >= this.mapSize.y) {
            return false;
        }
        return !(this._nodes[x][y].isBlocked);
    }

    calculateDistance(selfPos: cc.Vec2, targetPos: cc.Vec2): number {
        return Math.sqrt(Math.pow(selfPos.x - (this.startPoint.x + (targetPos.x) * this.pixelSize.x), 2) + Math.pow(selfPos.y - (this.startPoint.y + (targetPos.y) * this.pixelSize.y), 2));
    }
}
