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
    terrainWidth: number = 100;

    @property(Number)
    terrainHeight: number = 100;

    @property(Number)
    blockSize: number = 32;

    @property(Number)
    scale: number = 10;


    start(): void {
        // this.generateTerrain(12345); // Example seed
        this.mapGrid.setPosition(cc.v2(-this.terrainWidth * this.blockSize / 2, -this.terrainHeight * this.blockSize / 2));
        this.generateTerrain(12345);
    }

    generateTerrain (seed : number) { //has called in gameController
        const noise = new Noise(seed);

        for(let x = 0; x < this.terrainWidth; x++) {
            for(let y = 0; y < this.terrainHeight; y++) {
                const value = noise.perlin2(x / this.scale, y / this.scale);
                let blockType = 'tree'; // Default block type

                if (value < -0.1) {
                    blockType = 'grass';
                } else if (value < 0.1) {
                    blockType = 'water';
                } else if (value < 0.3) {
                    blockType = 'stone';
                }

                this.placeBlock(blockType, x * this.blockSize, y * this.blockSize);
            }
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