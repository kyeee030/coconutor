// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class MinimapCamera extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    @property(cc.Node)
    minimap: cc.Node = null;

    @property(cc.Node)
    mapRenderObject: cc.Node = null;

    private _camera: cc.Camera = null;
    private _renderTexture: cc.RenderTexture = null;
    private _renderSpriteFrame: cc.SpriteFrame = null;
    private _renderSprite: cc.Sprite = null;

    onLoad () {
        this._camera = this.getComponent(cc.Camera);
        this._renderSprite = this.mapRenderObject.getComponent(cc.Sprite);
        if (!this._camera || !this._renderSprite) {
            this.minimap.active = false;
            cc.error("MinimapCamera: Camera component not found!");
            return;
        }

        // Create a render texture for the minimap camera
        this._renderTexture = new cc.RenderTexture();
        this._renderTexture.initWithSize(512, 512, cc.Texture2D.PixelFormat.RGBA8888);
        this._camera.targetTexture = this._renderTexture;

        this._renderSpriteFrame = new cc.SpriteFrame();
        this._renderSpriteFrame.setTexture(this._renderTexture);
        this.mapRenderObject.getComponent(cc.Sprite).spriteFrame = this._renderSpriteFrame;
        
        this.minimap.active = true;
        this._renderSprite.spriteFrame = this._renderSpriteFrame;
    }

    start () {}

    // update (dt) {}
}
