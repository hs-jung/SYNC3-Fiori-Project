sap.ui.define([
    "sap/ui/core/mvc/Controller",
	'sap/ui/model/json/JSONModel'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("conditionmonitoring.controller.Main", {
            onInit: function () {
                var oModel = new JSONModel({selectedBackground:"Dashboard"})
                this.getView().setModel(oModel);

                var oMTDataModel = new JSONModel(
                    {
                        str: {
                                bst_temperature : "",
                                bst_humidity : "",
                                bst_co2 : "",
                                crt_temperature : "",
                                crt_humidity : "",
                                crt_co2 : "",
                                avr_temperature : "",
                                avr_humidity : "",
                                avr_co2 : "",
                                mtname_kor : "딸기"

                            },   
                            tmt: {
                                bst_temperature : "",
                                bst_humidity : "",
                                bst_co2 : "",
                                crt_temperature : "",
                                crt_humidity : "",
                                crt_co2 : "",
                                avr_temperature : "",
                                avr_humidity : "",
                                avr_co2 : "",
                                mtname_kor : "토마토"

                            },   
                            ccb: {
                                bst_temperature : "",
                                bst_humidity : "",
                                bst_co2 : "",
                                crt_temperature : "",
                                crt_humidity : "",
                                crt_co2 : "",
                                avr_temperature : "",
                                avr_humidity : "",
                                avr_co2 : "",
                                mtname_kor : ""

                            },   
                    })
                this.getView().setModel(oMTDataModel, 'data');

                var uri = "";
                var oDataModel = this.getOwnerComponent().getModel();
                
                //자재 마스터 데이터 가져오기
                uri = '/ItemsSet';

                oDataModel.read( uri, {
                    success : function(oReturn) {
                        console.log(oReturn);
                        this.getView().setModel(oReturn.results,"/MTMASTER");
                        this.getView().getModel('data').oData.str.bst_temperature = this.getView().getModel('MTMASTER').getData()[2].Tem;
                        debugger;

                    }.bind(this)
                });
              
                //온도, 습도, Co2 데이터 가져오기


                // document.getElementById('idDashboard').onclick();

            },
            onSliderMoved: function (oEvent) {
                var fValue = oEvent.getParameter("value");
                this.byId("containerLayout").setWidth(fValue + "%");
            },
            fnImageSet : function(path) {
                return _rootPath + path;

            }
        });
    });
