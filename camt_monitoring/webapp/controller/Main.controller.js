sap.ui.define([
    "sap/ui/core/mvc/Controller",
	'sap/ui/model/json/JSONModel'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel) {
        "use strict";

        return Controller.extend("camtmonitoring.controller.Main", {
            onInit: function () {
                 //Data 설정
                 var oData = {  selectedBackground : "Dashboard" };         //json data
                var oModel = new JSONModel(oData); 
                //jsonModel을 View에서 사용하고 싶으면 => Data Binding.
                this.getView().setModel(oModel, 'selectedBackground');
                
                var oModel = new JSONModel(sap.ui.require.toUrl("sap/ui/demo/mock/products.json"));
                this.getView().setModel(oModel);

                // document.getElementById('idDashboard').onclick();
            },
            onSliderMoved: function (oEvent) {
                var fValue = oEvent.getParameter("value");
                this.byId("containerLayout").setWidth(fValue + "%");
            }
        });
    });
