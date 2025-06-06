const {ccclass, property} = cc._decorator;
import Building from "../../Building/Building";

const BLOCKSIDE = 32;

@ccclass
export default class SimpleCursor extends cc.Component {

    @property(cc.Node)
    cursorNode: cc.Node = null;

    @property(cc.Integer)
    mouse_x_offset: number = 0;

    @property(cc.Integer)
    mouse_y_offset: number = 0;

    @property(cc.Camera)
    mainCamera: cc.Camera = null;

    @property(cc.Float)
    keyMoveSpeed: number = 200; // Speed of movement with WASD keys (pixels per second)

    @property(cc.Node)
    building: cc.Node = null;

    private moveUp: boolean = false;
    private moveDown: boolean = false;
    private moveLeft: boolean = false;
    private moveRight: boolean = false;
    private active: boolean = false; // Default to false, GameController will activate it
    private previewBoxComp: any;

    _dx: number = 0; // Used to store the x position of the cursors
    _dy: number = 0; // Used to store the y position of the cursor

    // To keep track of whether mouse movement should also control the cursor
    @property(cc.Boolean)
    followMouse: boolean = true;


    onLoad() {
        if (!this.cursorNode) {
            console.error("Cursor Node is not assigned in the editor!");
            this.enabled = false; // Disable the entire component if critical node is missing
            return;
        }

        // Ensure cursorNode's visibility matches the initial 'active' state
        this.cursorNode.active = this.active;

        if (!this.mainCamera && this.followMouse) {
            console.warn("Main Camera is not assigned. Mouse following might be inaccurate if the camera is moved or scaled, or if the cursorNode is not parented to the Canvas.");
        }

        // Register system-level event listeners
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onDestroy() {
        // Clean up system-level event listeners
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    private onKeyDown(event: cc.Event.EventKeyboard): void {
        if (!this.active) { // Check 'active' state
            return;
        }

        switch(event.keyCode) {
            case cc.macro.KEY.w:
            case cc.macro.KEY.up:
                this.moveUp = true;
                break;
            case cc.macro.KEY.s:
            case cc.macro.KEY.down:
                this.moveDown = true;
                break;
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                this.moveLeft = true;
                break;
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                this.moveRight = true;
                break;
            case cc.macro.KEY.space:
                if (this.cursorNode) {
                    const position = this.cursorNode.getPosition();
                    const buildEvent = new cc.Event.EventCustom('building-position', true);
                    let x = Math.floor(position.x);
                    let y = Math.floor(position.y);
                    buildEvent.setUserData({ x: x, y: y });
                    cc.systemEvent.dispatchEvent(buildEvent);
                    console.log(`KeyboardCursor: Sent building-position event at (${position.x}, ${position.y})`);
                }
                break;
        }
    }

    private onKeyUp(event: cc.Event.EventKeyboard): void {
        // It's good practice to also check 'active' here, though less critical for 'key up'
        // if (!this.active) {
        //     return;
        // }

        switch(event.keyCode) {
            case cc.macro.KEY.w:
            case cc.macro.KEY.up:
                this.moveUp = false;
                break;
            case cc.macro.KEY.s:
            case cc.macro.KEY.down:
                this.moveDown = false;
                break;
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                this.moveLeft = false;
                break;
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                this.moveRight = false;
                break;
        }
    }

    update(dt: number): void {
        if (!this.active || !this.cursorNode) { // Check 'active' state
            return;
        }

        let deltaPos = cc.v2(0, 0);

        if (this.moveUp) {
            deltaPos.y += this.keyMoveSpeed * dt;
        }
        if (this.moveDown) {
            deltaPos.y -= this.keyMoveSpeed * dt;
        }
        if (this.moveLeft) {
            deltaPos.x -= this.keyMoveSpeed * dt;
        }
        if (this.moveRight) {
            deltaPos.x += this.keyMoveSpeed * dt;
        }

        if (deltaPos.x !== 0 || deltaPos.y !== 0) {

            this._dx += deltaPos.x;
            this._dy += deltaPos.y;
            this.cursorNode.x = Math.floor(this._dx / BLOCKSIDE) * BLOCKSIDE;
            this.cursorNode.y = Math.floor(this._dy / BLOCKSIDE) * BLOCKSIDE;

        this.previewBoxComp = this.building.getComponent('Building');
        this.previewBoxComp.updatePreviewBox(this.cursorNode.x, this.cursorNode.y);
        
        
            // Optional: Clamp position to Canvas boundaries
            // This requires knowing the Canvas size and the cursorNode's anchor point.
            // Example (assuming cursorNode's parent is the Canvas and anchor is 0.5, 0.5):
            // if (this.cursorNode.parent) {
            //     const canvasWidth = this.cursorNode.parent.width;
            //     const canvasHeight = this.cursorNode.parent.height;
            //     const halfCursorWidth = this.cursorNode.width / 2;
            //     const halfCursorHeight = this.cursorNode.height / 2;
            //
            //     this.cursorNode.x = cc.misc.clampf(this.cursorNode.x, -canvasWidth / 2 + halfCursorWidth, canvasWidth / 2 - halfCursorWidth);
            //     this.cursorNode.y = cc.misc.clampf(this.cursorNode.y, -canvasHeight / 2 + halfCursorHeight, canvasHeight / 2 - halfCursorHeight);
            // }
        }
    }

    public setCursorActive(active: boolean): void {
        this.active = active;
        if (this.cursorNode) {
            this.cursorNode.active = this.active; // Control visibility
        }

        // If becoming inactive, reset movement flags to prevent stuck movement
        if (!this.active) {
            this.moveUp = false;
            this.moveDown = false;
            this.moveLeft = false;
            this.moveRight = false;
        }
        console.log(`KeyboardCursor active state set to: ${this.active}, cursorNode visibility: ${this.cursorNode ? this.cursorNode.active : 'N/A'}`);
    }
}