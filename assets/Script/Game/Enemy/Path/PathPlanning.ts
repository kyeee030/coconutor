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

    @property(cc.Prefab)
    mushroomEnemy: cc.Prefab = null;

    @property(cc.Prefab)
    goblinEnemy: cc.Prefab = null;  

    @property(cc.Prefab)
    stromheadEnemy: cc.Prefab = null;

    @property(cc.Prefab)
    botWheelEnemy: cc.Prefab = null;

    _nodes: NodeElement[][] = [];

    _canvas = cc.find('Canvas');

    // onLoad () {}

    start () {
        this.init();
    }

    // update (dt) {}

    init () {
        this._canvas = cc.find('Canvas');
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
        cc.log("hi");
        let dist = Math.abs(start.x - end.x) + Math.abs(start.y - end.y);
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
        let queue: cc.Vec4[] = [];
        let visited: boolean[][] = Array.from({ length: this.mapSize.x }, () => Array(this.mapSize.y).fill(false));
        for(let i=0; i< 8; ++i) {
            let it = dir[i];
            let newX = start.x + it.x;
            let newY = start.y + it.y;
            if (this.checkValid(newX, newY) && !visited[newX][newY]) {
                queue.push(new cc.Vec4(newX, newY, i, 0));
                visited[newX][newY] = true;
            }
        }
        while (queue.length > 0) {
            let current = queue.shift();
            if (!current) continue;
            cc.log(`dist: ${dist}, current: ${current.w}`);
            if(current.w > dist) return new cc.Vec2(0, 0);
            if (current.x === end.x && current.y === end.y) {
                return new cc.Vec2(
                    this.startPoint.x + (dir[current.z].x + start.x) * this.pixelSize.x,
                    this.startPoint.y + (dir[current.z].y + start.y) * this.pixelSize.y
                );
            }
            for (let i=0; i < 8; ++i) {
                let it = dir[i];
                let newX = current.x + it.x;
                let newY = current.y + it.y;
                if (this.checkValid(newX, newY) && !visited[newX][newY]) {
                    queue.push(new cc.Vec4(newX, newY, current.z, current.w+1));
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

    spawnEnemy() {
        let t = Math.floor(Math.random() * 4);
        let pos = cc.v2(this.startPoint.x, this.startPoint.y);
        if(t == 0) {
            pos.y += Math.floor(Math.random()*this.mapSize.y)*this.pixelSize.y;
        } else if(t == 1) {
            pos.x += Math.floor(Math.random()*this.mapSize.x)*this.pixelSize.x;
        } else if(t == 2) {
            pos.x += this.mapSize.x * this.pixelSize.x;
            pos.y += Math.floor(Math.random()*this.mapSize.y)*this.pixelSize.y;
        } else {
            pos.y += this.mapSize.y * this.pixelSize.y;
            pos.x += Math.floor(Math.random()*this.mapSize.x)*this.pixelSize.x;
        }
        pos = new cc.Vec2(512, 512);
        t = Math.floor(Math.random()*4);
        if(t == 0 || 1) {
            let enemy = cc.instantiate(this.mushroomEnemy);
            enemy.setPosition(pos.x, pos.y, 0);
            this._canvas.addChild(enemy);
        } else if(t == 1) {
            let enemy = cc.instantiate(this.goblinEnemy);
            enemy.setPosition(pos.x, pos.y, 0);
            this._canvas.addChild(enemy);
        } else if(t == 2) {
            let enemy = cc.instantiate(this.stromheadEnemy);
            enemy.setPosition(pos.x, pos.y, 0);
            this._canvas.addChild(enemy);
        } else {
            let enemy = cc.instantiate(this.botWheelEnemy);
            enemy.setPosition(pos.x, pos.y, 0);
            this._canvas.addChild(enemy);
        }
    }
}
