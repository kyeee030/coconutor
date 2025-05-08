import { BuildingState } from "../Building/Building";

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

    @property       //when testing property you can change it at the right side :)
    hp: number;
    @property
    damage: number;
    //splashDamage: number; //if you need :)
    @property
    coolDown: number;
    @property
    speed: number;
    @property
    attackRange: number;

    target: {
        dist: number,
        pos: {
            x: number,
            y: number
        }
        type: BuildingState,
        tag: null //Index of building or somwthing else
    }

    // onLoad () {}

    start () {
        this.init();
    }

    init() {
        this.enemyState = EnemyState.MOVE;
        this.hp = (this.hp == null) ? HP : this.hp;
        this.damage = (this.damage == null) ? DAMAGE : this.damage;
        this.coolDown = (this.coolDown == null) ? COOLDOWN : this.coolDown;
        this.speed = (this.speed == null) ? SPEED : this.speed;
        this.attackRange = (this.attackRange == null) ? ATTACKRANGE : this.attackRange;
        
        console.log(
            (   this.hp == null || this.damage == null ||
                this.coolDown == null || this.speed == null || 
                this.attackRange == null || this.enemyState == null) //check location and log
            ? 'Can\'t find ' + this._enemyType + '\'s property T_T, who write this shxt code?' 
            : 'A ' + this._enemyType + ' has\'s spawned!!'
        );
    }

    update (dt) {
        this.findTarget();
        if (this.hp < 0) {

        } else if(this.target.dist < this.attackRange) {
            this.enemyState = EnemyState.ATTACK
        } else {
            this.enemyState = EnemyState.ATTACK
        }
        switch (this.enemyState) {
            case EnemyState.MOVE:
            case EnemyState.ATTACK:
                this.findDirection(); 
            break;
            case EnemyState.DIE:
                this.death();
            break;
            default:
                this.idle();
            break;
        }
    }


    findTarget () { //find the target

    }

    findDirection () { //find the direction
        /*if (target.dist < attackRange)
            this.schedule(this.attack, this.coolDown);
        else
            this.unschedule(this.attack);
            this.move();
        */
    }

    move () { //move

    }

    attack () { //attack & call animation

    }

    death () { //call when death

    }

    idle () { //idle (optional)

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
