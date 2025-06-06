const {ccclass, property} = cc._decorator;

@ccclass
export default class BFStest extends cc.Component {

    map: number[][] = Array.from({ length: 200 }, () => Array(200).fill(0));

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        
    }


    bfs(start: cc.Vec2, end: cc.Vec2): cc.Vec2[] {
        let queue: cc.Vec2[] = [];
        let visited: boolean[][] = Array.from({ length: this.map.length }, () => Array(this.map[0].length).fill(false));
        let parent: cc.Vec2[][] = Array.from({ length: this.map.length }, () => Array(this.map[0].length).fill(null));

        queue.push(start);
        visited[start.x][start.y] = true;

        const directions = [
            cc.v2(1, 0), cc.v2(-1, 0), cc.v2(0, 1), cc.v2(0, -1)
        ];

        while (queue.length > 0) {
            let current = queue.shift();
            if (current.equals(end)) {
                let path: cc.Vec2[] = [];
                while (current) {
                    path.push(current);
                    current = parent[current.x][current.y];
                }
                return path.reverse();
            }

            for (let dir of directions) {
                let next = current.add(dir);
                if (this.isValidPosition(next, visited)) {
                    queue.push(next);
                    visited[next.x][next.y] = true;
                    parent[next.x][next.y] = current;
                }
            }
        }
        cc.log('gg');
        return [];
    }
    update (dt) {
        for (let i = 0; i < 30; i++) {
            this.bfs(cc.v2(0, 0), cc.v2(199, 199));
        }
    }

    isValidPosition(pos: cc.Vec2, visited: boolean[][]): boolean {
        return (
            pos.x >= 0 &&
            pos.x < this.map.length &&
            pos.y >= 0 &&
            pos.y < this.map[0].length &&
            !visited[pos.x][pos.y] &&
            this.map[pos.x][pos.y] === 0
        );
    }
}
