import Enemy, { EnemyState } from './Enemy'
const {ccclass, property} = cc._decorator;

@ccclass
export default class EnemyMushroom extends Enemy {

    _enemyType: string = 'Mushroom';

    switchAnim() {
        switch (this.enemyState) {
            case EnemyState.IDLE:
                this._anim.play('Enemy_Mushroom_Idle');
                break;
            case EnemyState.MOVE:
                this._anim.play('Enemy_Mushroom_Run');
                break;
            case EnemyState.ATTACK:
                this.attack();
                this.schedule(this.attackAnimationControl, this.coolDown);
                break;
            case EnemyState.DIE:
                this._anim.play('Enemy_Mushroom_Die');
                this._anim.once('finished', () => {
                    this.node.destroy();
                    
                });
                break;
            default:
                this._anim.play('Enemy_Mushroom_Idle');
            break;
        }
    }
    
    attackAnimationControl () { //remove this will broke
        this.attack();
    }

    attack() {
        this._anim.play('Enemy_Mushroom_Attack');
        this._isAttacking = true;
        this.scheduleOnce(() => {// this way is not good, but now I am too lazy to change it
            //target.hp - damage
            cc.log("attack!!!!!!!!!!");
        }, 0.70);
        this._anim.once('finished', () => {
            if (this.enemyState === EnemyState.ATTACK) {
                this._anim.play('Enemy_Mushroom_Idle');
            }
            this._isAttacking = false;
        });
    }
}
