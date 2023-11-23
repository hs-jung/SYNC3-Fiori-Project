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

                body = `/MemberSet(Loginid='${oID.getValue()}',Password='${sha256PW}')`;
                // body = `/MemberSet`;
                oDataModel.read(body, {
                    success : function(oReturn) {
                        // oModel.setProperty("/list", oReturn.results);
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
