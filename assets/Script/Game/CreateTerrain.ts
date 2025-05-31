const {ccclass, property} = cc._decorator;
import { Noise } from 'noisejs';


@ccclass
export default class CreateTerrain extends cc.Component {

    @property(cc.Node)
    mapGrid: cc.Node = null;
    // 地圖母物件

    @property(cc.Prefab)
    grassPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    stonePrefab: cc.Prefab = null;
    @property(cc.Prefab)
    treePrefab: cc.Prefab = null;
    @property(cc.Prefab)
    waterPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    orePrefab: cc.Prefab = null;

    // prefab

    @property(Number)
    terrainWidth: number = 150;
    @property(Number)
    terrainHeight: number = 150;
    // 地圖的大小

    @property(Number)
    blockSize: number = 32;
    // 每個方塊的大小

    @property(Number)
    scale: number = 15;
    // 地形規模

    @property(Number)
    seed: number = -1;
    // 隨機種子

    // **以下參數皆位在+-1之間，主要分布於+-0.5，<-0.5或>0.5的很少出現**

    @property(Number)
    seaLevel: number = -0.5;
    // 海平面高度

    @property(Number)
    planeSize: number = 0.5;
    // 平原大小
    @property(Number)
    mountainSize: number = 0.5;
    // 山脈大小

    @property(Number)
    biomeMixArea: number = 0.05;
    @property(Number)
    biomeMix: number = 0.3;
    // 不同區域交界混和程度

    // **以下參數皆位在0~1之間**
    @property(Number)
    riverProbability: number = 0.3;
    // 河流生成機率

    @property(Number)
    riverSpread: number = 0.5;
    // 河流擴散程度

    @property(Number)
    resourceDensity: number = 0.1;



    private _altitudeGrid: number[][] = [];
    private _map : string[][] = [];
    private _resourceGrid: string[][] = [];
    private _resourceObjects: cc.Node[][] = [];
    private _riverStartX: number[] = [];
    private _riverStartY: number[] = [];


    start(): void {
        this.mapGrid.setPosition(cc.v2(-this.terrainWidth * this.blockSize / 2, -this.terrainHeight * this.blockSize / 2));
        this.generateTerrain();
    }

    generateTerrain () {
        const randomSeed = this.seed >= 0 ? this.seed : Math.floor(Math.random() * 1000000);

        const altitudeNoise = new Noise(randomSeed);
        
        console.log('Generating terrain with seed:', randomSeed);

        // 生成海拔
        for(let x = 0; x < this.terrainWidth; x++) {
            this._altitudeGrid[x] = [];
            this._map[x] = [];
            this._resourceGrid[x] = [];
            this._resourceObjects[x] = [];
            for(let y = 0; y < this.terrainHeight; y++) {
                this._altitudeGrid[x][y] = altitudeNoise.perlin2(x / this.scale, y / this.scale);
                // console.log(this.altitudeGrid[x][y]);
                if (this._altitudeGrid[x][y] > 0.5) {
                    // 夠高處10%生出河流源頭
                    if (Math.random() < this.riverProbability) {
                        this._riverStartX.push(x);
                        this._riverStartY.push(y);
                    }
                }
            }
        }

        // 生成地形
        for(let x = 0; x < this.terrainWidth; x++) {
            for(let y = 0; y < this.terrainHeight; y++) {
                const altitude = this._altitudeGrid[x][y];
                let blockType = 'grass'; // 預設為草地
                let resource = null; // 資源類型
                if (altitude < this.seaLevel) {
                    blockType = 'water';
                } else if (altitude < this.seaLevel + this.planeSize) {
                    blockType = 'grass';
                    resource = Math.random() < this.resourceDensity ? 'tree' : null; // 以resource density為機率生成樹木
                } else if (altitude < this.seaLevel + this.planeSize + this.mountainSize - this.biomeMixArea) {
                    blockType = Math.random() < this.biomeMix ? 'stone' : 'grass';
                } else if (altitude < this.seaLevel + this.planeSize + this.mountainSize) {
                    blockType = Math.random() < this.biomeMix ? 'grass' : 'stone';
                } else if (altitude < this.seaLevel + this.planeSize + this.mountainSize + this.biomeMixArea) {
                    blockType = 'stone';
                    resource = Math.random() < this.resourceDensity ? 'ore' : null; // 以resource density為機率生成礦石
                } else {
                    blockType = 'stone';
                }
                this._map[x][y] = blockType;
                this._resourceGrid[x][y] = resource;
                this.placeBlock(blockType, x, y);
                this.placeResource(resource, x, y);
            }
        }

        // 目前效果不太好
        // 從所有源頭生成河流
        console.log(this._riverStartX);
        console.log(this._riverStartY);
        for (let i = 0; i < this._riverStartX.length; i++) {
            const startX = this._riverStartX[i];
            const startY = this._riverStartY[i];
            this.generateRiver(startX, startY);
        }
    }

    public generateMap(){
        this.generateTerrain();
    }

    generateRiver(startX: number, startY: number) {
        try {
            let x = startX;
            let y = startY;

            while (true) {
                if (x < 0 || x >= this.terrainWidth || y < 0 || y >= this.terrainHeight) {
                    break; // 超出邊界
                }

                if (this._altitudeGrid[x][y] < -0.5) {
                    break; // 到達海平面
                }

                if(this._map[x][y] != 'water') {
                    this._map[x][y] = 'water';
                    this.placeBlock('water', x, y);
                }

                let lowestAltitude = this._altitudeGrid[x][y];
                let nextX = x;
                let nextY = y;

                if (Math.random() < this.riverSpread) {
                    // 隨機擴散
                    const randomDirection = Math.floor(Math.random() * 4);
                    switch (randomDirection) {
                        case 0: nextX = x + 1; break; // 向右
                        case 1: nextX = x - 1; break; // 向左
                        case 2: nextY = y + 1; break; // 向上
                        case 3: nextY = y - 1; break; // 向下
                    }
                } else {
                    // 水往下流
                    if (x + 1 < this.terrainWidth && this._altitudeGrid[x + 1][y] < lowestAltitude) {
                        lowestAltitude = this._altitudeGrid[x + 1][y];
                        nextX = x + 1;
                        nextY = y;
                    }
                    if (x - 1 >= 0 && this._altitudeGrid[x - 1][y] < lowestAltitude) {
                        lowestAltitude = this._altitudeGrid[x - 1][y];
                        nextX = x - 1;
                        nextY = y;
                    }
                    if (y + 1 < this.terrainHeight && this._altitudeGrid[x][y + 1] < lowestAltitude) {
                        lowestAltitude = this._altitudeGrid[x][y + 1];
                        nextX = x;
                        nextY = y + 1;
                    }
                    if (y - 1 >= 0 && this._altitudeGrid[x][y - 1] < lowestAltitude) {
                        lowestAltitude = this._altitudeGrid[x][y - 1];
                        nextX = x;
                        nextY = y - 1;
                    }
                }

                if (nextX === x && nextY === y) {
                    break;
                }

                x = nextX;
                y = nextY;
            }
        } catch (error) {
            console.error('Error generating river:', error);
        }
    }

    placeResource (resourceType: string, x: number, y: number) {
        if(!resourceType) return;

        let resourcePrefab: cc.Prefab = null;
        switch (resourceType) {
            case 'tree':
                resourcePrefab = this.treePrefab;
                break;
            case 'ore':
                resourcePrefab = this.orePrefab;
                break;
            default:
                cc.error('Unknown resource type:', resourceType);
                return;
        }
        const resourceNode = cc.instantiate(resourcePrefab);
        resourceNode.setPosition(x * this.blockSize, y * this.blockSize);
        resourceNode.parent = this.mapGrid;
        resourceNode.active = true;
        this._resourceObjects[x][y] = resourceNode; // 儲存資源物件
    }

    placeBlock (blockType: string, x: number, y: number) {
        if (x < 0 || x >= this.terrainWidth || y < 0 || y >= this.terrainHeight) {
            cc.error('Block position out of bounds:', x, y);
            return; // 超出邊界
        }
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
            case 'ore':
                blockPrefab = this.orePrefab;
                break;
            default:
                cc.error('Unknown block type:', blockType);
                return;
        }
        const blockNode = cc.instantiate(blockPrefab);
        blockNode.setPosition(x * this.blockSize, y * this.blockSize);
        // blockNode.opacity = 255 * ((this.altitudeGrid[Math.floor(x / this.blockSize)][Math.floor(y / this.blockSize)]) + 0.55); // 效果不好
        blockNode.parent = this.mapGrid;
        blockNode.active = true;
    }
    
    isWalkable (x: number, y: number) {
        if (x < 0 || x >= this.terrainWidth || y < 0 || y >= this.terrainHeight) {
            return false; // 超出邊界
        }
        const blockType = this._map[x][y];
        return blockType !== 'water' && blockType !== 'tree' && blockType !== ''; // 水和樹木不可通行
    } // 輸入網格座標

    positionWalkable (x: number, y: number): boolean {
        const posX = Math.floor(x / this.blockSize);
        const posY = Math.floor(y / this.blockSize);
        return this.isWalkable(posX, posY);
    } // 輸入實際座標

    getBlockType (x: number, y: number): string {
        if (x < 0 || x >= this.terrainWidth || y < 0 || y >= this.terrainHeight) {
            return 'OUT OF BORDER'; // 超出邊界
        }
        return this._map[x][y];
    } // 輸入網格座標

    positionBlockType (x: number, y: number): string {
        const posX = Math.floor(x / this.blockSize);
        const posY = Math.floor(y / this.blockSize);
        return this.getBlockType(posX, posY);
    } // 輸入實際座標

    getGridCoordinates (x: number, y: number): { gridCoordinates: { gridX: number, gridY: number }, blockSize: number } {
        if( x < 0 || y < 0 || x >= this.terrainWidth * this.blockSize || y >= this.terrainHeight * this.blockSize) {
            cc.error('Coordinates out of bounds:', x, y);
            return { gridCoordinates: { gridX: -1, gridY: -1 }, blockSize: this.blockSize }; // 超出邊界
        }
        const gridX : number = Math.floor(x / this.blockSize);
        const gridY : number = Math.floor(y / this.blockSize);
        return { gridCoordinates: {gridX, gridY}, blockSize: this.blockSize };
    } // 輸入實際座標，回傳網格座標
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