// Lobby.ts
const { ccclass, property } = cc._decorator;

@ccclass
export default class Lobby extends cc.Component {

    start() {
        
    }

    handle_sign_in() {
        var txtname = cc.find("Canvas/sign_in_board/board/name");
        var txtEmail = cc.find("Canvas/sign_in_board/board/mail");
        var txtPassword = cc.find("Canvas/sign_in_board/board/password");
        var username = txtname.getComponent(cc.EditBox).string;
        var email = txtEmail.getComponent(cc.EditBox).string;
        var passeord = txtPassword.getComponent(cc.EditBox).string;
        
        firebase.auth().createUserWithEmailAndPassword(email, passeord)
            .then((userCredential) => {
                userCredential.user.updateProfile({
                    displayName: username
                });
                alert("success");
                
                cc.find("Canvas/sign_in_board").active = false;
                cc.director.loadScene("Select");
            })
            .catch(e => {
                cc.find("Canvas/sign_in_board/board/name").getComponent(cc.EditBox).string = '';
                cc.find("Canvas/sign_in_board/board/mail").getComponent(cc.EditBox).string = '';
                cc.find("Canvas/sign_in_board/board/password").getComponent(cc.EditBox).string = '';
  
                alert("failed");
            });
            cc.find("Canvas/sign_in_board").active = false;
            cc.director.loadScene("Select");
        
    }

    sign_in() {
        cc.find("Canvas/sign_in_board").active = true;
    }

    sign_out(){
        cc.director.loadScene("start");
    }

    back() {
        cc.find("Canvas/sign_in_board").active = false;
    }

    enter(){
        this.handle_sign_in();
    }
}
