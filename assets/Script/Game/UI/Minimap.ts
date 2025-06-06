// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Minimap extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    @property(Number)
    minimapSize: number = 1.0;

    @property(cc.Node)
    mapRenderObject: cc.Node = null;

    @property(cc.Node)
    minimapCamera: cc.Node = null;

    @property(Boolean)
    minimapEnabled: boolean = true;

    private _camera: cc.Camera = null;
    private _renderTexture: cc.RenderTexture = null;
    private _renderSpriteFrame: cc.SpriteFrame = null;
    private _renderSprite: cc.Sprite = null;
    private _animation: cc.Animation = null;
    private _active: boolean = false;

    onLoad () {
        this._animation = this.getComponent(cc.Animation);

        this._camera = this.minimapCamera.getComponent(cc.Camera);
        this._renderSprite = this.mapRenderObject.getComponent(cc.Sprite);
        if (!this._camera || !this._renderSprite) {
            this.node.active = false;
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
        
        this.node.active = true;
        this._renderSprite.spriteFrame = this._renderSpriteFrame;

        this.node.scaleX = this.minimapSize;
        this.node.scaleY = this.minimapSize;

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.setActive(this.minimapEnabled);
    }

    private _toggleKeyTriggered: boolean = false;
    onKeyDown (event: cc.Event.EventKeyboard) {
        if (event.keyCode === cc.macro.KEY.m && !this._toggleKeyTriggered) {
            this.toggleMinimap();
            this._toggleKeyTriggered = true;
        }
    }

    onKeyUp (event: cc.Event.EventKeyboard) {
        if (event.keyCode === cc.macro.KEY.m) {
            this._toggleKeyTriggered = false;
        }
    }

    toggleMinimap() {
        // this.setActive(!this.node.active && this.minimapEnabled);
        this.setActive(!this._active);
    }

    setActive(active: boolean) {
        if (this._active === active) {
            return; // No change in state
        }
        this._active = active;
        this.minimapCamera.active = active;
        if (active) {
            this._renderSprite.spriteFrame = this._renderSpriteFrame;
            this._animation.play("ShowMinimap");
        } else {
            this._renderSprite.spriteFrame = null;
            this._animation.play("HideMinimap");
        }
        
    }

    setMinimapSize(size: number) {
        this.minimapSize = size;
        this.node.scaleX = this.minimapSize;
        this.node.scaleY = this.minimapSize;
    }

    enable(){
        this.minimapEnabled = true;
        this.setActive(true);
    }

    disable(){
        this.minimapEnabled = false;
        this.setActive(false);
    }
}
