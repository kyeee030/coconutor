const {ccclass, property} = cc._decorator;

@ccclass
export default class ResourceSystem extends cc.Component{
    @property
    initWoods: number = 100;

    @property
    initStones: number = 100;

    @property
    initOres: number = 100;


    // resources storages
    _stones: number = 0;
    _woods: number = 0;
    _ores: number = 0;

    onLoad() {
        this._woods = this.initWoods;
        this._stones = this.initStones;
        this._ores = this.initOres;
    }

    public getWoods(): number {
        return this._woods;
    }

    public getStones(): number {
        return this._stones;
    }

    public getOres(): number {
        return this._ores;
    }

    public addWoods(amount: number): void {
        this._woods += amount;
        cc.log(`Woods added: ${amount}, Total Woods: ${this._woods}`);
    }

    public addStones(amount: number): void {
        this._stones += amount;
        cc.log(`Stones added: ${amount}, Total Stones: ${this._stones}`);
    }

    public addOres(amount: number): void {
        this._ores += amount;
        cc.log(`Ores added: ${amount}, Total Ores: ${this._ores}`);
    }
}