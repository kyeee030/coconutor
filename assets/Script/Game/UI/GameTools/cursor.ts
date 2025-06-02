const {ccclass, property} = cc._decorator;

export enum CursorMode {
    NORMAL,
    BUILDING,
    // Easy to add more modes here in the future
    // TARGETING,
    // DELETING,
    // etc.
}

// Abstract base state class
abstract class CursorState {
    protected cursor: Cursor;

    constructor(cursor: Cursor) {
        this.cursor = cursor;
    }

    abstract enter(): void;
    abstract exit(): void;
    abstract onMouseMove(event: cc.Event.EventMouse): void;
    abstract onMouseDown(event: cc.Event.EventMouse): void;
}

// Normal cursor state
class NormalState extends CursorState {
    enter(): void {
        // Nothing special needed for normal state
    }

    exit(): void {
        // Clean up if needed
    }

    onMouseMove(event: cc.Event.EventMouse): void {
        // const mousePos = event.getLocation();
        // const worldPos = this.cursor.cursorNode.parent.convertToNodeSpaceAR(mousePos);
        // this.cursor.mouse_x = worldPos.x;
        // this.cursor.mouse_y = worldPos.y;
        // this.cursor.cursorNode.setPosition(worldPos);
    }

    onMouseDown(event: cc.Event.EventMouse): void {
        // Handle normal click if needed
    }
}

// Building cursor state
class BuildingState extends CursorState {

    enter(): void {
        cc.systemEvent.on(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this);
    }

    exit(): void {
        // Remove preview
        cc.systemEvent.off(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this);
    }

    onMouseMove(event: cc.Event.EventMouse): void {
        // Get screen position
        const screenPos = event.getLocation();
        
        // Convert to world position (relative to canvas)
        const worldPos = this.cursor.node.parent.convertToNodeSpaceAR(screenPos);
        
        // Apply offsets
        this.cursor.mouse_x = worldPos.x + this.cursor.mouse_x_offset;
        this.cursor.mouse_y = worldPos.y + this.cursor.mouse_y_offset;
        
        // Update cursor position
        this.cursor.cursorNode.setPosition(this.cursor.mouse_x, this.cursor.mouse_y);
    }

    onMouseDown(event: cc.Event.EventMouse): void {
        // Get screen position
        const screenPos = event.getLocation();
        
        // Convert to world position
        const worldPos = this.cursor.node.parent.convertToNodeSpaceAR(screenPos);
        
        // Apply offsets (same as in onMouseMove)
        const buildingX = worldPos.x + this.cursor.mouse_x_offset;
        const buildingY = worldPos.y + this.cursor.mouse_y_offset;
        
        // Emit an event to notify GameController
        const buildEvent = new cc.Event.EventCustom('building-position', true);
        buildEvent.setUserData({x: buildingX, y: buildingY});
        cc.systemEvent.dispatchEvent(buildEvent);
        
        // Place building at current position
        // const building = cc.instantiate(this.cursor.canBuildBlock);
        // this.cursor.node.parent.addChild(building);
        // building.setPosition(buildingX, buildingY);
        // 獲取 GameController 節點並呼叫 onBuildingPlaced
        const gameController = cc.find("GameController").getComponent("GameController");
        if (gameController) {
            console.log("find GameController!");
            gameController.onBuildingPlaced(buildEvent);
        } else {
            console.error("GameController not found!");
        }
        
        // Return to normal state
        console.log(`BuildingState: Placed building at (${buildingX}, ${buildingY})`);
        this.cursor.changeState(CursorMode.NORMAL);
        console.log("BuildingState: Changed to NORMAL state");
    }
}

@ccclass
export default class Cursor extends cc.Component {
    
    @property(cc.Node)
    cursorNode: cc.Node = null;

    @property(cc.Prefab)
    canBuildBlock: cc.Prefab = null;

    @property(cc.Prefab)
    cannotBuildBlock: cc.Prefab = null;

    @property(cc.Integer)
    mouse_x_offset: number = 0;

    @property(cc.Integer)
    mouse_y_offset: number = 0;

    // Public properties for use by states
    public mouse_x: number = 0;
    public mouse_y: number = 0;

    private currentState: CursorState = null;
    private states: Map<CursorMode, CursorState> = new Map();

    onLoad() {
        // Initialize states
        this.states.set(CursorMode.NORMAL, new NormalState(this));
        this.states.set(CursorMode.BUILDING, new BuildingState(this));
        
        // Set initial state
        this.changeState(CursorMode.NORMAL);

        // Set up event listeners
        this.node.on(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this);
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
    }

    onDestroy() {
        // Clean up event listeners
        this.node.off(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this);
        this.node.off(cc.Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
    }

    public getCurrentMode(): CursorMode {
        // Find which mode corresponds to the current state
        let foundMode: CursorMode = CursorMode.NORMAL;
        this.states.forEach((state, mode) => {
            if (state === this.currentState) {
                foundMode = mode;
            }
        });
        return foundMode;
    }

    // Method to change the current state
    public changeState(newMode: CursorMode): void {
        // Exit current state if it exists
        if (this.currentState) {
            this.currentState.exit();
        }
        
        // Get and enter the new state
        this.currentState = this.states.get(newMode);
        if (this.currentState) {
            this.currentState.enter();
        } else {
            console.error(`No state found for mode: ${newMode}`);
        }
    }

    // Event handlers that delegate to current state
    private onMouseMove(event: cc.Event.EventMouse): void {
        if (this.currentState) {
            this.currentState.onMouseMove(event);
        }
    }

    private onMouseDown(event: cc.Event.EventMouse): void {
        if (this.currentState) {
            this.currentState.onMouseDown(event);
        }
    }
}