sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, History) {
        "use strict";

        return Controller.extend("login.controller.Join", {
            onInit: function () {
                var oData = {
                        CustName : "",
                        CustAddr : "",
                        CustTel : "",
                        CustBirth : "",
                        Postcode : "",
                        DetailAddr : "",
                        MemberjoinDate : "",
                        Email : "",
                        Gender : "",
                        MemberJoinSet : [{
                            Loginid : "",
                            Password : ""
                        }]
                    };
                var oModel = new sap.ui.model.json.JSONModel(oData);
                this.getView().setModel(oModel, 'member');

                var oRouter = this.getOwnerComponent().getRouter();
                //Detail 라우터에 Pattern Matched 이벤트 붙이기
                oRouter.getRoute('RouteJoin').attachPatternMatched(this._patternMatched, this);
            },
            //라우터 패턴이 "일치할때마다" 실행
            _patternMatched : function(oEvent) {

            },
            onidChange : function(oEvent) {
                var oDataModel = this.getView().getModel();  
                var id = oEvent.getParameters().value;
                var body = "";

                body = `/MemberJoinSet(Loginid='${id}',Password='CHECKID')`;

                oDataModel.read(body, {
                    success : function(oReturn) {
                        this._setInputValueState(oReturn.Loginid);

                    }.bind(this),
                    error : function(oReturn)
                    {

                    }.bind(this)
                });
                    
            },
            _setInputValueState : function(value) {
                var message = '';

                this.byId("idLoginid").setValueState(value);

                if(value == 'Error')
                {
                    message = "이미 등록된 아이디가 있습니다. 5이상 12이하의 아이디를 입력하세요."
                }

                this.byId("idLoginid").setValueStateText(message);
            },
            onNamechanged : function() {
                var oDataModel = this.getView().getModel('member');

                if(oDataModel.oData.CustName == ""){
                    sap.m.MessageToast.show("이름은 필수 입력값 입니다.");
                    this.byId("idCustName").setValueState('Error');

                    message = "이름은 필수 입력값 입니다. 이름을 입력하세요."

                    this.byId("idCustName").setValueStateText(message);
                }
                else{
                    this.byId("idCustName").setValueState('Success');
                }
            },
            onJoinus : function() {
                var message = "";
                var oDataModel = this.getView().getModel('member');
                var birth = "";
                var birth_year = "";
                var birth_month = "";
                var birth_date = "";

                // ID CHECK
                if( this.byId("idLoginid")._getInputValue() == ""){
                    sap.m.MessageToast.show("아이디는 필수 입력값 입니다.");
                    this.byId("idLoginid").setValueState('Error');

                    message = "아이디는 필수 입력값 입니다. 5 이상 12 이하의 아이디를 입력하세요."

                    this.byId("idLoginid").setValueStateText(message);
                    return false;
                }
                // PW CHECK
                if( this.byId("idPassword1")._getInputValue() == ""){
                    sap.m.MessageToast.show("비밀번호는 필수 입력값 입니다.");
                    this.byId("idPassword1").setValueState('Error');

                    message = "비밀번호는 필수 입력값 입니다. 비밀번호를 입력하세요."

                    this.byId("idPassword1").setValueStateText(message);
                    return false;
                }
                    
                     // PW CHECK
                if( this.byId("idPassword2")._getInputValue() == ""){
                    sap.m.MessageToast.show("비밀번호는 필수 입력값 입니다.");
                    this.byId("idPassword2").setValueState('Error');

                    message = "비밀번호는 필수 입력값 입니다. 비밀번호를 입력하세요."

                    this.byId("idPassword2").setValueStateText(message);
                    return false;
                }

                if( this.byId("idPassword1")._getInputValue() != this.byId("idPassword2")._getInputValue()){
                    sap.m.MessageToast.show("비밀번호가 일치 하지 않습니다.");
                    this.byId("idPassword2").setValueState('Error');

                    message = "비밀번호가 일치하지 않습니다. 비밀번호를 확인 후 입력하세요."

                    this.byId("idPassword2").setValueStateText(message);
                    return false;
                }
                
                // NAME CHECK

                if(oDataModel.oData.CustName == ""){
                    sap.m.MessageToast.show("이름은 필수 입력값 입니다.");
                    this.byId("idCustName").setValueState('Error');

                    message = "이름은 필수 입력값 입니다. 이름을 입력하세요."

                    this.byId("idCustName").setValueStateText(message);
                    return false;
                }

                // Gender CHECK
                if( this.byId("rbg2").mProperties.selectedIndex == 0 )
                {
                    oDataModel.oData.Gender = 'M';
                }

                if( this.byId("rbg2").mProperties.selectedIndex == 1 )
                {
                    oDataModel.oData.Gender = 'F';
                }

                //BIRTH CHECK
                if( oDataModel.oData.CustBirth == "" || oDataModel.oData.CustBirth == undefined ){

                    oDataModel.oData.CustBirth = new Date('9999-12-31');
                }
                //SUNMIT
                this.onCreateEntity();
            },
            onCheckPW : function() {
                var message = '';

                if( this.byId("idPassword1").mProperties.value !== this.byId("idPassword2").mProperties.value)
                {
                    this.byId("idPassword2").setValueState('Error');

                    message = "비밀번호가 일치하지 않습니다. 확인 후 다시 입력 해주세요"

                    this.byId("idPassword2").setValueStateText(message);
                }
                else{
                    this.byId("idPassword1").setValueState('Success');
                    this.byId("idPassword2").setValueState('Success');
                }
            },
            //생성(POST) - Create EntitySet /MemberSet + Body(Json)
            onCreateEntity : function() {
                var oMainModel = this.getView().getModel('member');
                var oData = oMainModel.getData();

                debugger;
                //PW SHA256
                // oData.LOGIN_PW
                oData.MemberJoinSet[0].Loginid = this.byId("idLoginid").mProperties.value;
                oData.MemberJoinSet[0].Password = sha256(this.byId("idPassword1").mProperties.value);
                oData.MemberjoinDate = new Date();


                debugger;
                this.getView().getModel().create("/MemberJoinCustSet", oData, {
                    success: function(oReturn) {
                        sap.m.MessageToast.show("환영합니다! 잠시후 로그인 페이지로 이동합니다.");

                        setTimeout(this.onBack, 3000);

                    }.bind(this),
                    error : function(oError) {
                        // 에러 처리
                        console.log(oError);
                    }
                })
            },
            //뒤로가기
            onBack : function() {
                var oHistory = History.getInstance();
                var sPreviousHash = oHistory.getPreviousHash();

                if(sPreviousHash !== undefined){
                    //sap router 히스토리가 없는 경우에는
                    //window 히스토리에서 뒤로 가기
                    window.history.go(-1);
                }
                else{
                    // sap router 히스토리가 있으면 메인 화면으로 이동
                    var oRouter = this.getOwnerComponent().getRouter();
                    oRouter.navTo("RouteNorthwind",{});
                }
            }
        });
    });
