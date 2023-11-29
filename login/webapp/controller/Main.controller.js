sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/json/JSONModel'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("login.controller.Main", {
            onInit: function () {
              var oModel = new JSONModel({logoPath:"/assets/image/logo.png"});
              var oLoginUserModel = new JSONModel({CustID:""});

              this.getView().setModel(oModel,"Logo");
              this.getView().setModel(oLoginUserModel,"CustID");

              var oRouter = this.getOwnerComponent().getRouter();
              //Detail 라우터에 Pattern Matched 이벤트 붙이기
              oRouter.getRoute('RouteMain').attachPatternMatched(this._patternMatched, this);
          },
          //라우터 패턴이 "일치할때마다" 실행
          _patternMatched : function(oEvent) {
            let oData = this.getView().getModel('Logo').getData().logoPath;
            this.fnImageSet(oData);
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

                      let oData = this.getView().getModel('CustID').getData().CustID;

                      // 로그인 성공 메인 페이지 이동 로직 추가하기
                      if(oReturn.Loginid == '0000')
                      {
                        sap.m.MessageToast.show("아이디나 비밀번호를 확인 후 다시 로그인해주세요.");
                      }
                      else{
                        this.getView().getModel('CustID').getData().CustID = oReturn.CustId
                        this.onMoveApp();
                      }
                        
                    }.bind(this)
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
                      params: { CustID: this.getView().getModel('CustID').getData() },
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
