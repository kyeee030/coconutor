import Enemy, { EnemyState } from './Enemy'
const {ccclass, property} = cc._decorator;

@ccclass
export default class EnemyMushroom extends Enemy {

    // onLoad () {}

    // start () {}

    // update (dt) {}

    switchAnim() {
        switch (this.enemyState) {
            case EnemyState.IDLE:
                this._anim.play('Enemy_Mushroom_Idle');
                cc.log('kk');
                break;
            case EnemyState.MOVE:
                cc.log('jj');
                this._anim.play('Enemy_Mushroom_Run');
                break;
            case EnemyState.ATTACK:
                cc.log('ll');
                this._anim.play('Enemy_Mushroom_Attack');
                this._anim.once('finished', () => {
                    if (this.enemyState === EnemyState.ATTACK) {
                        this._anim.play('Enemy_Mushroom_Idle');
                    }
                });
                this.schedule(this.attackAnimationControl, this.coolDown);
                break;
            case EnemyState.DIE:
                this._anim.play('Enemy_Mushroom_Die');
                break;
            default:
                this._anim.play('Enemy_Mushroom_Idle');
                cc.log('jj');
            break;
        }
    }
    
    attackAnimationControl () {
        this._anim.play('Enemy_Mushroom_Attack');
        this._anim.once('finished', () => {
            if (this.enemyState === EnemyState.ATTACK) {
                this._anim.play('Enemy_Mushroom_Idle');
            }
        });
    }
}
