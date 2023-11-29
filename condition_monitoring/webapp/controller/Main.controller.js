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
                var uri = "";
                var oDataModel = this.getView().getModel();
                
                var oModel = new JSONModel({selectedBackground:"Dashboard"})
                this.getView().setModel(oModel);

                //자재 마스터 데이터 가져오기
                uri = "/ItemsSet";

                oDataModel.read(uri, {
                    success : function(oReturn) {

                     debugger;

                    }.bind(this)
                });

                //온도, 습도, Co2 데이터 가져오기


                // document.getElementById('idDashboard').onclick();

            },
            onSliderMoved: function (oEvent) {
                var fValue = oEvent.getParameter("value");
                this.byId("containerLayout").setWidth(fValue + "%");
            }
        });
    });
