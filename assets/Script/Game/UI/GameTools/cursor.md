# How to add a new mode to cursor

## add the mode to the enum
```typeScript
export enum CursorMode {
    NORMAL,
    BUILDING,
    TARGETING,
}
```

## Register the state in the onLoad method
```typeScript
this.states.set(CursorMode.TARGETING, new TargetingState(this));
```

## Add a public method to enter the new mode
```typeScript
public enterTargetingMode(): void {
    this.changeState(CursorMode.TARGETING);
}
```