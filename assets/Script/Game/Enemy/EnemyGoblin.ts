import Enemy, { EnemyState } from './Enemy'
const {ccclass, property} = cc._decorator;

@ccclass
export default class EnemyGoblin extends Enemy {

    _enemyType: string = 'Goblin';

    switchAnim() {
        switch (this.enemyState) {
            case EnemyState.IDLE:
                this._anim.play('Enemy_Goblin_Idle');
                break;
            case EnemyState.MOVE:
                this._anim.play('Enemy_Goblin_Walk');
                break;
            case EnemyState.ATTACK:
                this.attack();
                this.schedule(this.attackAnimationControl, this.coolDown);
                break;
            case EnemyState.DIE:
                this._anim.play('Enemy_Goblin_Die');
                this._anim.once('finished', () => {
                    this.node.destroy();
                    
                });
                break;
            default:
                this._anim.play('Enemy_Goblin_Idle');
            break;
        }
    }
    
    attackAnimationControl () { //remove this will broke
        this.attack();
    }

    attack() {
        this._anim.play('Enemy_Goblin_Attack');
        this._isAttacking = true;
        this.scheduleOnce(() => {// this way is not good, but now I am too lazy to change it
            //target.hp - damage
            cc.log("attack!!!!!!!!!!");
        }, 0.70);
        this._anim.once('finished', () => {
            if (this.enemyState === EnemyState.ATTACK) {
                this._anim.play('Enemy_Goblin_Idle');
            }
            this._isAttacking = false;
        });
    }
}
