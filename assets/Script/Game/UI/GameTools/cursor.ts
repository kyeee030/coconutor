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
        const mousePos = event.getLocation();
        const worldPos = this.cursor.cursorNode.parent.convertToNodeSpaceAR(mousePos);
        this.cursor.mouse_x = worldPos.x;
        this.cursor.mouse_y = worldPos.y;
        this.cursor.cursorNode.setPosition(worldPos);
    }

    onMouseDown(event: cc.Event.EventMouse): void {
        // Handle normal click if needed
    }
}

// Building cursor state
class BuildingState extends CursorState {
    private buildingPreview: cc.Node = null;

    enter(): void {
        // Create preview block
        if (this.cursor.canBuildBlock) {
            this.buildingPreview = cc.instantiate(this.cursor.canBuildBlock);
            this.cursor.node.parent.addChild(this.buildingPreview);
            
            // Set initial position to current mouse position
            this.buildingPreview.setPosition(this.cursor.mouse_x, this.cursor.mouse_y);
            cc.systemEvent.on(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this);
        }
    }

    exit(): void {
        // Remove preview
        cc.systemEvent.off(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this);
        if (this.buildingPreview) {
            this.buildingPreview.destroy();
            this.buildingPreview = null;
        }
    }

    onMouseMove(event: cc.Event.EventMouse): void {
        const mousePos = event.getLocation();
        const worldPos = this.cursor.cursorNode.parent.convertToNodeSpaceAR(mousePos);
        this.cursor.mouse_x = worldPos.x;
        this.cursor.mouse_y = worldPos.y;
        this.cursor.cursorNode.setPosition(worldPos);
        console.log(`BuildingState: Mouse moved to (${worldPos.x}, ${worldPos.y})`);
        // Update preview position
        if (this.buildingPreview) {
            this.buildingPreview.setPosition(worldPos);
        }
    }

    onMouseDown(event: cc.Event.EventMouse): void {
        // Place building at current position
        const building = cc.instantiate(this.cursor.canBuildBlock);
        this.cursor.node.parent.addChild(building);
        building.setPosition(this.cursor.mouse_x, this.cursor.mouse_y);
        
        // Return to normal state
        this.cursor.changeState(CursorMode.NORMAL);
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

    // Public method to enter building mode
    public enterBuildingMode(): void {
        this.changeState(CursorMode.BUILDING);
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