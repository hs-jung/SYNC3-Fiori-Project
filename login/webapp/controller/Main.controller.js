sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,CryptoJS) {
        "use strict";

        return Controller.extend("login.controller.Main", {
            onInit: function () {

            },
            onLogin : function() {
                var oDataModel = this.getView().getModel();
                var oID = this.getView().byId("idLoginid");
                var oPW = this.getView().byId("idPassword");
                var body = "";

                const password = oPW.getValue();
                var sha256PW = sha256(password);

                console.log(sha256PW);

                body = `/MemberJoinSet(Loginid='${oID.getValue()}',Password='${sha256PW}')`;

                oDataModel.read(body, {
                    success : function(oReturn) {
                        // oModel.setProperty("/list", oReturn.results);
                        // 로그인 성공 메인 페이지 이동 로직 추가하기
                        console.log("로그인 성공!!");
                        console.log(oReturn);
                    }
                });
            },
            onJoinus : function() {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteJoin");
            }
        });
    });
