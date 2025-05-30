const {ccclass, property} = cc._decorator;


export enum IncidentType {
    NONE = 0,
    FIRE = 1,
    FLOOD = 2,
    EARTHQUAKE = 3,
}

@ccclass
export default class IncidentSystem extends cc.Component {
        @property
        incidentInterval: number = 10; // Time interval between incidents in seconds

        @property
        incidentRate: number = 0.1; // Probability of an incident occurring each interval

        private incidentTimer: number = 0;
        private currentIncident: IncidentType = IncidentType.NONE;

        onLoad() {
            this.incidentTimer = 0;
            this.currentIncident = IncidentType.NONE;
        }

        start() {
            this.incidentTimer = 0;
        }

        public updateIncidentSystem(dt: number) {
            this.incidentTimer += dt;
            if (this.incidentTimer >= this.incidentInterval) {
                this.incidentTimer = 0;
                this.checkForIncident();
            }

            switch (this.currentIncident) {
                case IncidentType.FIRE:
                    // Handle fire incident logic here
                    // console.log("Handling fire incident...");
                    break;
                case IncidentType.FLOOD:
                    // Handle flood incident logic here
                    // console.log("Handling flood incident...");
                    break;
                case IncidentType.EARTHQUAKE:
                    // Handle earthquake incident logic here
                    // console.log("Handling earthquake incident...");
                    break;
                case IncidentType.NONE:
                default:
                    // No incident to handle
                    break;
            }
        }

        private checkForIncident() {
            if (Math.random() < this.incidentRate) {
                this.currentIncident = this.generateRandomIncident();
                // console.log("Incident occurred: " + IncidentType[this.currentIncident]);
                // Here you can trigger the incident handling logic
            } else {
                this.currentIncident = IncidentType.NONE;
            }
        }

        private generateRandomIncident(): IncidentType {
            const incidentValues = Object.values(IncidentType).filter(value => typeof value === 'number' && value > 0);
            const randomIndex = Math.floor(Math.random() * incidentValues.length);
            return incidentValues[randomIndex] as IncidentType;
        }

        public getCurrentIncident(): IncidentType {
            return this.currentIncident;
        }
}