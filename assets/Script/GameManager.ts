// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        const firebaseConfig = {
        apiKey: "AIzaSyA4SkWugH4h2TIzu5FEzomcmWPVtLdlPOI",
        authDomain: "coconuter-fbad6.firebaseapp.com",
        projectId: "coconuter-fbad6",
        storageBucket: "coconuter-fbad6.firebasestorage.app",
        messagingSenderId: "735738737798",
        appId: "1:735738737798:web:eb50c1be86c6922c1a4d07"
        };

        const app = firebase.initializeApp(firebaseConfig);
    }

    // update (dt) {}
}
