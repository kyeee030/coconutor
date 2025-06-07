const {ccclass , property} = cc._decorator;

@ccclass
export default class Warning extends cc.Component {
    @property(cc.Label)
    warningLabel: cc.Label = null;

    @property(cc.Node)
    warningNode: cc.Node = null; // The parent node containing the warning UI elements

    @property
    defaultDisplayTime: number = 3; // Default time in seconds to show warnings

    private hideTimer: number = null; // To track the auto-hide timer

    start(){
        // Initially hide the warning
        this.hideWarning();
    }

    public showWarning(message: string, displayTime: number = this.defaultDisplayTime): void {
        // Clear any existing timer
        if (this.hideTimer !== null) {
            clearTimeout(this.hideTimer);
            this.hideTimer = null;
        }

        if (this.warningLabel) {
            this.warningLabel.string = message;
        } else {
            console.warn("warningLabel is not set!");
        }

        // Show the warning node
        if (this.warningNode) {
            this.warningNode.active = true;
        } else if (this.warningLabel) {
            this.warningLabel.node.active = true;
        }

        // Set timer to hide the warning after displayTime seconds
        if (displayTime > 0) {
            this.hideTimer = setTimeout(() => {
                this.hideWarning();
                this.hideTimer = null;
            }, displayTime * 1000);
        }
    }

    public hideWarning(): void {
        // Clear any existing timer
        if (this.hideTimer !== null) {
            clearTimeout(this.hideTimer);
            this.hideTimer = null;
        }

        // Hide the warning node
        if (this.warningNode) {
            this.warningNode.active = false;
        } else if (this.warningLabel) {
            this.warningLabel.node.active = false;
        }
    }
}