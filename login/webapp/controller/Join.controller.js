sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("login.controller.Join", {
            onInit: function () {
                var oData = {
                    "Member" : {
                        LOGIN_ID : "",
                        LOGIN_PW : "",
                        CUST_NAME : "",
                        CUST_ADDR : "",
                        CUST_TEL : "",
                        CUST_BIRTH : "",
                        POSTCODE : "",
                        DETAIL_ADDR : "",
                        MEMBERJOIN_DATE : "",
                        EMAIL : "",
                        GENDER : ""
                    }
                };
                var oModel = new sap.ui.model.json.JSONModel(oData);
                this.getView().setModel(oModel, 'member');

                var oRouter = this.getOwnerComponent().getRouter();
                //Detail 라우터에 Pattern Matched 이벤트 붙이기
                oRouter.getRoute('RouteJoin').attachPatternMatched(this._patternMatched, this);
            },
            //라우터 패턴이 "일치할때마다" 실행
            _patternMatched : function(oEvent) {
                //이벤트 객체의 파라미터 정보에 arguments 에서 넘겨받은 데이터 확인
                var oArgu = oEvent.getParameters().arguments;
                // oArgu => { OrderID : 'hihi', option : 123 }
                
            },
            onidChange : function(oEvent) {
                var oDataModel = this.getView().getModel();  
                var id = oEvent.getParameters().value;
                var body = "";

                

                body = `/MemberSet(Loginid='${id}',Password='CHECKID')`;
                console.log(body);

                // body = `/MemberSet`;
                oDataModel.read(body, {
                    success : function(oReturn) {
                        // oModel.setProperty("/list", oReturn.results);
                        this._setInputValueState(oReturn.Loginid);
                        
                        console.log(oReturn);

                    }.bind(this),
                    error : function(oReturn)
                    {
                        console.log(oReturn);

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
            onJoinus : function() {
                var message = "";
                var oDataModel = this.getView().getModel('member');
                var birth = "";
                var birth_year = "";
                var birth_month = "";
                var birth_date = "";

                // ID CHECK
                if(oDataModel.oData.Member.LOGIN_ID == ""){
                    sap.m.MessageToast.show("아이디는 필수 입력값 입니다.");
                    this.byId("idLoginid").setValueState('Error');

                    message = "아이디는 필수 입력값 입니다. 5 이상 12 이하의 아이디를 입력하세요."

                    this.byId("idLoginid").setValueStateText(message);
                    return false;
                }
                // PW CHECK
                if(oDataModel.oData.Member.LOGIN_PW == ""){
                    sap.m.MessageToast.show("비밀번호는 필수 입력값 입니다.");
                    this.byId("idPassword1").setValueState('Error');

                    message = "비밀번호는 필수 입력값 입니다. 비밀번호를 입력하세요."

                    this.byId("idPassword1").setValueStateText(message);
                    return false;
                }
                    
                     // PW CHECK
                if( this.byId("idPassword2")._getInputValue()== ""){
                    sap.m.MessageToast.show("비밀번호는 필수 입력값 입니다.");
                    this.byId("idPassword2").setValueState('Error');

                    message = "비밀번호는 필수 입력값 입니다. 비밀번호를 입력하세요."

                    this.byId("idPassword2").setValueStateText(message);
                    return false;
                }

                if( this.byId("idPassword2")._getInputValue() != oDataModel.oData.Member.LOGIN_PW){
                    sap.m.MessageToast.show("비밀번호가 일치 하지 않습니다.");
                    this.byId("idPassword2").setValueState('Error');

                    message = "비밀번호가 일치하지 않습니다. 비밀번호를 확인 후 입력하세요."

                    this.byId("idPassword2").setValueStateText(message);
                    return false;
                }
                
                
                // NAME CHECK

                if(oDataModel.oData.Member.CUST_NAME == ""){
                    sap.m.MessageToast.show("이름은 필수 입력값 입니다.");
                    this.byId("idCustName").setValueState('Error');

                    message = "이름은 필수 입력값 입니다. 이름을 입력하세요."

                    this.byId("idCustName").setValueStateText(message);
                    return false;
                }

                // GENDER CHECK
                if( this.byId("rbg2").mProperties.selectedIndex == 0 )
                {
                    oDataModel.oData.Member.GENDER = 'M';
                }

                if( this.byId("rbg2").mProperties.selectedIndex == 1 )
                {
                    oDataModel.oData.Member.GENDER = 'F';
                }

                //BIRTH CHECK
                if( oDataModel.oData.CUST_BIRTH !== "" && oDataModel.oData.CUST_BIRTH !== undefined ){
                  birth_year  = oDataModel.oData.Member.CUST_BIRTH.getFullYear();
                  birth_month = oDataModel.oData.Member.CUST_BIRTH.getMonth()+1
                  if(birth_month < 10)
                  {
                    birth_month = "0" + birth_month;
                  }
                  birth_date   = oDataModel.oData.Member.CUST_BIRTH.getDate();
                  if(birth_date < 10)
                  {
                    birth_date = "0" + birth_date;
                  }
                  
                  oDataModel.oData.Member.CUST_BIRTH = birth_year.toString() + birth_month.toString() + birth_date.toString();
                }

                //PW SHA256
                oDataModel.oData.Member.LOGIN_PW =  sha256(oDataModel.oData.Member.LOGIN_PW);

                //SUNMIT
                onCreateEntity();
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

                /** oData 변수에 들어가 있는 json Data
                 * {
                 *      memID : 'Input Value'
                 *      Memnm : ''
                 *      Telno : ''
                 *      Email : ''
                 * }
                 */
                this.getView().getModel().create("/MemberJoinSet", oData, {
                    success: function(oReturn) {
                        sap.m.MessageToast.show("데이터 생성 완료");

                    },
                    error : function(oError) {
                        // 에러 처리
                        debugger;
                    }
                })

                /**
                 * Deep Create
                 * {
                 *  HeaderID : "0001",
                 * Items : [
                 *  {}, {}, {}, {}
                 * ]
                 * }
                 */


            }
        });
    });
