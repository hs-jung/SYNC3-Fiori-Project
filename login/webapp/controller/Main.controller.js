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
                        debugger;
                        console.log("로그인 성공!!");
                        console.log(oReturn);
                        // 로그인 성공 메인 페이지 이동 로직 추가하기
                        this.onMoveApp();
                    }.bind(this),
                    Error : function(oError) {

                        sap.m.MessageToast.show("아이디나 비밀번호를 확인 후 다시 로그인해주세요.");

                    }
                });
            },
            onJoinus : function() {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteJoin");
            },
            fnImageSet: function(path) {
                if(path)
                {
                    return _rootPath + path;
                }
                return _rootPath + '/assets/image/logo.png';
            },
            onMoveApp: function () {
                const oCrossAppNavigator = sap.ushell.Container.getService(
                  "CrossApplicationNavigation"
                );
        
                const hash =
                  (oCrossAppNavigator &&
                    oCrossAppNavigator.hrefForExternal({
                      target: {
                        semanticObject: "Z03SE_HOME",
                        action: "display",
                      },
                      params: { CustID: "test1111" },
                    })) ||
                  "";
        
                oCrossAppNavigator.toExternal({
                  target: {
                    shellHash: hash,
                  },
                });
              }
        });
    });
