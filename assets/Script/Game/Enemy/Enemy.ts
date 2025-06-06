import { BuildingState } from "../Building/Building";
import Building from "../Building/Building";
import PathPlanning from "./Path/PathPlanning";

const {ccclass, property} = cc._decorator;
export enum EnemyState {
    MOVE = 0,
    ATTACK = 1,
    DIE = 2,
    IDLE = 3
};

const HP = 50;
const DAMAGE = 10;
const COOLDOWN = 1.5;
const SPEED = 1;
const ATTACKRANGE = 1;

@ccclass
export default class Enemy extends cc.Component {

    _enemyType: string = 'Example';
    enemyState: EnemyState;
    //when testing property you can change it at the right side :)

    //---test----//
    @property
    testProperty: cc.Vec2 = cc.v2(0, 0); //if you need :)
    @property
    testProperty2: cc.Vec2 = cc.v2(0, 0);

    buildings = [this.testProperty];

    //---test----//

    @property       
    hp: number = 0; //if you need :)    
    @property
    damage: number = 0;
    //splashDamage: number; //if you need :)
    @property
    coolDown: number = 0;
    @property
    speed: number = 0;
    @property
    attackRange: number = 0;

    _pathPlanning: any;
    _nextPos: cc.Vec2 = cc.v2(0, 0);
    _anim: cc.Animation = null;

    _isAttacking: boolean = false; //if you need :)

    _buildingRoot: Building = null; //if you need :)

    target: {
        dist: number,
        pos: cc.Vec2,
        type: BuildingState,
        tag: null //Index of building or somwthing else
    }

    onLoad () {
        this._pathPlanning = cc.find('GameController');
        if (!this._pathPlanning) {
            console.error('Can\'t find GameController node, please check the scene!');
            return;
        }
        
        this._pathPlanning = this._pathPlanning ? this._pathPlanning.getComponent(PathPlanning) : null;
        if (!this._pathPlanning) {
            console.error('Can\'t find PathPlanning script, please check the scene!');
        }

        this._anim = this.node.getComponent(cc.Animation);
        if (!this._anim) {
            console.error('Can\'t find anim');
        }

        this._buildingRoot = cc.find('Canvas/Building').getComponent(Building);
        if (!this._buildingRoot) {
            console.error('Can\'t find Building root node, please check the scene!');
        }
    }

    start () {
        this.init();
        this.scheduleOnce(() => {
            this.buildings = [this.testProperty2];
        }, 8)
    }

    init() {
        this.enemyState = EnemyState.IDLE;
        this.hp = (this.hp == null) ? HP : this.hp;
        this.damage = (this.damage == null) ? DAMAGE : this.damage;
        this.coolDown = (this.coolDown == null) ? COOLDOWN : this.coolDown;
        this.speed = (this.speed == null) ? SPEED : this.speed;
        this.attackRange = (this.attackRange == null) ? ATTACKRANGE : this.attackRange;
        
        // console.log(
        //     (   this.hp == null || this.damage == null ||
        //         this.coolDown == null || this.speed == null || 
        //         this.attackRange == null || this.enemyState == null) //check location and log
        //     ? 'Can\'t find ' + this._enemyType + '\'s property T_T, who write this shxt code?' 
        //     : 'A ' + this._enemyType + ' has\'s spawned!!'
        // );
    }

    update (dt) {
        const selfpos = this.findTarget();  
        if (this.target) {
            switch (this.enemyState) {
                case EnemyState.MOVE:
                case EnemyState.ATTACK:
                    this.findDirection(selfpos); 
                break;
                case EnemyState.DIE:
                    this.death();
                break;
                default:
                    this.idle();
                break;
            }
        }
    }


    findTarget () { //find the target and return self pos
        // if (!this._pathPlanning) 
        //     cc.error('Can\'t find PathPlanning script');
        let pos_t = this._pathPlanning.findLocation(this.node.position.x, this.node.position.y);
        // if (!pos_t) 
        //     cc.error('Enemy can\'t find location, please check it position is valid!');
        // const x = pos_t.x;
        // const y = pos_t.y;
        // let minDist = Infinity;
        // for (let b of this.buildings) {
        //     const dist = Math.sqrt(Math.pow(b.x - x, 2) + Math.pow(b.y - y, 2));
        //     if(dist < minDist) {
        //         minDist = dist;
        //         this.target = {
        //             dist: dist,
        //             pos: new cc.Vec2(b.x, b.y),
        //             type: null, //or other state
        //             tag: null //Index of building or something else
        //         };
        //     }
        // }
        let building = this._buildingRoot.getNearestBuilding(new cc.Vec2(this.node.position.x, this.node.position.y));
        if(building) {
            const x = pos_t.x;
            const y = pos_t.y;
            let b_pos = this._pathPlanning.findLocation(building.position.x, building.position.y);
            const bx = b_pos.x;
            const by = b_pos.y;
            this.target = {
                dist: Math.sqrt(Math.pow(x-bx, 2) + Math.pow(y-by, 2)),
                pos: new cc.Vec2(bx, by),
                type: null, //or other state
                tag: null //Index of building or something else
            };
        }
        if(!this.target) this.checkState(EnemyState.IDLE);
        else if(this.enemyState == EnemyState.IDLE) this.checkState(EnemyState.MOVE);
        return pos_t;
    }

    findDirection (selfpos: cc.Vec2) { //find the direction
        if(selfpos == null) return;
        if(this._isAttacking) return;
        if (this.target.dist < this.attackRange)
        {
            this.checkState(EnemyState.ATTACK);
            return;
        }
        else {
            if(this.enemyState == EnemyState.ATTACK)
                this.checkState(EnemyState.IDLE);
            this.unschedule(this.attackAnimationControl);
        }
        if((Math.pow(Math.abs(this.node.position.x - this._nextPos.x), 2) + Math.pow(Math.abs(this.node.position.y - this._nextPos.y), 2) < 10))
        {
            let pos_t = this._pathPlanning.findLocation(this.node.position.x, this.node.position.y);
            this._nextPos = this._pathPlanning.findPath(selfpos, this.target.pos);
        }
        this.move(this._nextPos);
    }

    move (nextPos: cc.Vec2) { //move
        if (!nextPos) {
            cc.error('Can\'t find direction, please check the path planning!');
            return;
        }
        let angle = Math.atan2(nextPos.y - this.node.position.y, nextPos.x - this.node.position.x);

        if(Math.cos(angle) > 0) this.node.scaleX = -1;
        else this.node.scaleX = 1;
        this.node.x += Math.cos(angle) * this.speed;
        this.node.y += Math.sin(angle) * this.speed;
    }

    checkState (nextState: EnemyState) {
        // let nextState: EnemyState;
        //  if (this.hp < 0) {
        //     nextState = EnemyState.DIE;
        // } else if(this.target.dist < this.attackRange) {
        //     nextState = EnemyState.ATTACK
        // } else {
        //     nextState = EnemyState.MOVE;
        // }
        if(this.enemyState == nextState) return;
        this.enemyState = nextState;
        this.switchAnim();
    }

    switchAnim () {};

    attack () { //attack
        
    }

    death () { //call when death

    }

    idle () { //idle (optional)

    }

    attackAnimationControl () {

    }
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
