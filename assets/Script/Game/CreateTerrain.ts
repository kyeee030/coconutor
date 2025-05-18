const {ccclass, property} = cc._decorator;
import { Noise } from 'noisejs';


@ccclass
export default class CreateTerrain extends cc.Component {

    @property(cc.Node)
    mapGrid: cc.Node = null;

    @property(cc.Prefab)
    grassPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    stonePrefab: cc.Prefab = null;
    @property(cc.Prefab)
    treePrefab: cc.Prefab = null;
    @property(cc.Prefab)
    waterPrefab: cc.Prefab = null;
    
    @property(Number)
    terrainWidth: number = 150;

    @property(Number)
    terrainHeight: number = 150;

    @property(Number)
    blockSize: number = 32;

    @property(Number)
    scale: number = 15;

    @property(Number)
    seed: number = 12345;

    private altitudeGrid: number[][] = [];
    private map : string[][] = [];
    private riverStartX: number[] = [];
    private riverStartY: number[] = [];


    start(): void {
        this.mapGrid.setPosition(cc.v2(-this.terrainWidth * this.blockSize / 2, -this.terrainHeight * this.blockSize / 2));
        this.generateTerrain(this.seed);
    }

    generateTerrain (seed : number) {
        const altitudeNoise = new Noise(seed);

        // 生成海拔
        for(let x = 0; x < this.terrainWidth; x++) {
            this.altitudeGrid[x] = [];
            for(let y = 0; y < this.terrainHeight; y++) {
                this.altitudeGrid[x][y] = altitudeNoise.perlin2(x / this.scale, y / this.scale);
                console.log(this.altitudeGrid[x][y]);
                if (this.altitudeGrid[x][y] > 0.5) {
                    // 夠高處10%生出河流源頭
                    if (Math.random() < 0.1) {
                        this.riverStartX.push(x);
                        this.riverStartY.push(y);
                    }
                }
            }
        }

        // 生成地形
        for(let x = 0; x < this.terrainWidth; x++) {
            for(let y = 0; y < this.terrainHeight; y++) {
                const altitude = this.altitudeGrid[x][y];
                let blockType = 'grass';
                if (altitude < -0.5) {
                    blockType = 'water';
                } else if (altitude < 0) {
                    blockType = 'grass';
                } else if (altitude < 0.4) {
                    blockType = 'stone';
                } else {
                    blockType = 'tree';
                }
                this.placeBlock(blockType, x * this.blockSize, y * this.blockSize);
            }
        }

        // 目前效果不太好
        // 從所有源頭生成河流
        for (let i = 0; i < this.riverStartX.length; i++) {
            const startX = this.riverStartX[i];
            const startY = this.riverStartY[i];
            this.generateRiver(startX, startY);
        }
    }

    generateRiver (startX: number, startY: number) {
        let x = startX;
        let y = startY;
        if (x < 0 || x >= this.terrainWidth || y < 0 || y >= this.terrainHeight) {
            return;
        }
        this.placeBlock('water', x * this.blockSize, y * this.blockSize);
        this.placeBlock('water', x * this.blockSize, (y + 1) * this.blockSize);
        this.placeBlock('water', x * this.blockSize, (y - 1) * this.blockSize);
        this.placeBlock('water', (x + 1) * this.blockSize, y * this.blockSize);
        this.placeBlock('water', (x - 1) * this.blockSize, y * this.blockSize);
        this.placeBlock('water', (x + 1) * this.blockSize, (y + 1) * this.blockSize);
        this.placeBlock('water', (x - 1) * this.blockSize, (y + 1) * this.blockSize);
        this.placeBlock('water', (x + 1) * this.blockSize, (y - 1) * this.blockSize);
        this.placeBlock('water', (x - 1) * this.blockSize, (y - 1) * this.blockSize);
        let lowestAltitude = this.altitudeGrid[x][y];
        let nextX = x;
        let nextY = y;

        if (this.altitudeGrid[x-1][y] < lowestAltitude) {
            lowestAltitude = this.altitudeGrid[x-1][y];
            nextX = x - 1;
            nextY = y;
        }
        if (this.altitudeGrid[x+1][y] < lowestAltitude) {
            lowestAltitude = this.altitudeGrid[x+1][y];
            nextX = x + 1;
            nextY = y;
        }
        if (this.altitudeGrid[x][y-1] < lowestAltitude) {
            lowestAltitude = this.altitudeGrid[x][y-1];
            nextX = x;
            nextY = y - 1;
        }
        if (this.altitudeGrid[x][y+1] < lowestAltitude) {
            lowestAltitude = this.altitudeGrid[x][y+1];
            nextX = x;
            nextY = y + 1;
        }
        if (nextX !== x || nextY !== y) {
            this.generateRiver(nextX, nextY);
        }
    }

    placeBlock (blockType: string, x: number, y: number) {
        let blockPrefab: cc.Prefab = null;
        switch (blockType) {
            case 'grass':
                blockPrefab = this.grassPrefab;
                break;
            case 'stone':
                blockPrefab = this.stonePrefab;
                break;
            case 'tree':
                blockPrefab = this.treePrefab;
                break;
            case 'water':
                blockPrefab = this.waterPrefab;
                break;
            default:
                cc.error('Unknown block type:', blockType);
                return;
        }
        const blockNode = cc.instantiate(blockPrefab);
        blockNode.setPosition(x, y);
        blockNode.parent = this.node; // Assuming this script is attached to the parent node
        blockNode.active = true;
    }
    

    // onLoad () {}

    // start () {}

    // update (dt) {}
}

//
//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//
//
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
//               佛祖保佑         永无BUG
//
//
//