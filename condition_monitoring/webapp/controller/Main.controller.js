sap.ui.define([
    "sap/ui/core/mvc/Controller",
	'sap/ui/model/json/JSONModel',
    'sap/m/FlexItemData',
    'sap/ui/model/FilterOperator',
    'sap/ui/model/Filter',
    'sap/viz/ui5/data/FlattenedDataset',
    'sap/viz/ui5/controls/common/feeds/FeedItem',
    'sap/viz/ui5/controls/Popover',
    'sap/viz/ui5/controls/VizFrame',
    'sap/viz/ui5/controls/VizSlider',
    'sap/viz/ui5/format/ChartFormatter',
    'sap/viz/ui5/api/env/Format'
    
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel,FlexItemData,
        FilterOperator,
        Filter,
        FlattenedDataset,
        FeedItem,
        Popover,
        VizFrame,
        VizSlider,
        ChartFormatter,
        Format) {
        "use strict";

        return Controller.extend("conditionmonitoring.controller.Main", {
            
            onInit: function () {
                var oModel = new JSONModel({selectedBackground:"Dashboard"})
                this.getView().setModel(oModel,'/theme');

                var oMasterDataModel = new JSONModel({});
                        this.getView().setModel(oMasterDataModel, 'MTMASTER');

                // document.getElementById('idDashboard').onclick();
                var oRouter = this.getOwnerComponent().getRouter();
                //Detail 라우터에 Pattern Matched 이벤트 붙이기
                oRouter.getRoute('RouteMain').attachPatternMatched(this._patternMatched, this);
            },
            //라우터 패턴이 "일치할때마다" 실행
            _patternMatched : function(oEvent) {
                //자재 마스터 데이터 가져오기
                this.getMasterInfo();
                
                //온도, 습도, Co2 데이터 가져오기
                this.getCondition();

                //images path 가져오기
                this.getImagePath();

                //main chart setting
                this.setMainChart();

                //실시간 데이터 받기
                setInterval(() => this.getRealTimeData(), 3000);

            },
            setMainChart : function() {
             

                //Chart
                var oChart = this.getView().byId("idChart");
                var oChart2 = this.getView().byId("idChart2");

                //Dataset
                var oDataSet = new FlattenedDataset({
                    dimensions : [ {name : 'Time',
                            value : '{data>Time}'
                        }],
                    measures : [{
                        name : 'Temperature',
                        value : '{data>Temperature}'
                    },
                    {
                        name : 'Humidity',
                        value : '{data>Humidity}'
                    }],
                    data : { path : 'data>/'}
                });

                var oDataSet2 = new FlattenedDataset({
                    dimensions : [ {name : 'Time',
                            value : '{data>Time}'
                        }],
                    measures : [{
                        name : 'Co2',
                        value : '{data>Co2}'
                    }],
                    data : { path : 'data>/'}
                });

                oChart.setDataset(oDataSet);
                oChart2.setDataset(oDataSet2);

                //feed
                var feedValueAxis = new FeedItem({
                    uid : "valueAxis",
                    type : "Measure",
                    values : ['Temperature','Humidity']
                });

                var feedChategoryAxis = new FeedItem({
                    uid : "categoryAxis",
                    type : "Dimension",
                    values : ['Time']
                });

                //feed2
                var feedValueAxis2 = new FeedItem({
                    uid : "valueAxis",
                    type : "Measure",
                    values : ['Co2']
                });

                var feedChategoryAxis2 = new FeedItem({
                    uid : "categoryAxis",
                    type : "Dimension",
                    values : ['Time']
                });


                oChart.addFeed(feedValueAxis);
                oChart.addFeed(feedChategoryAxis);

                oChart2.addFeed(feedValueAxis2);
                oChart2.addFeed(feedChategoryAxis2);
            },
            getImagePath : function() {
                // debugger;
                var oData = {
                    str : "/assets/images/str.jpg",
                    ccb : "/assets/images/ccb.jpg",
                    tmt : "/assets/images/tmt.jpg",
                    ac  : "/assets/images/ac.png",
                    hum : "/assets/images/humidifier.png",
                    acl : "/assets/images/aircleaner.png"
                };

                var oModel = new JSONModel(oData);
                this.getView().setModel(oModel, 'images');
            },
            getMasterInfo : function() {

                var uri = "/ItemsSet";
                // var oDataModel = this.getOwnerComponent().getModel();
                var oDataModel = this.getView().getModel();
                
                oDataModel.read( uri, {
                    success : function(oReturn) {
                        // debugger;

                        console.log(oReturn.results);

                        var oMainModel = new JSONModel(
                            {
                                bst_temperature : "",
                                bst_humidity : "",
                                bst_co2 : "",
                                crt_temperature : "",
                                crt_humidity : "",
                                crt_co2 : "",
                                avr_temperature : "",
                                avr_humidity : "",
                                avr_co2 : "",
                                mtname_kor : "",
                                mtcode : ""
                            });

                        var oStrModel = new JSONModel(
                            {
                                bst_temperature : "",
                                bst_humidity : "",
                                bst_co2 : "",
                                crt_temperature : "",
                                crt_humidity : "",
                                crt_co2 : "",
                                avr_temperature : "",
                                avr_humidity : "",
                                avr_co2 : "",
                                mtname_kor : "딸기",
                                mtcode : "MM00000002",
                                imagepath : "/assets/images/str.jpg"
                            });
                        var oCcbModel = new JSONModel(
                            {
                                bst_temperature : "",
                                bst_humidity : "",
                                bst_co2 : "",
                                crt_temperature : "",
                                crt_humidity : "",
                                crt_co2 : "",
                                avr_temperature : "",
                                avr_humidity : "",
                                avr_co2 : "",
                                mtname_kor : "오이",
                                mtcode : "MM00000007",
                                imagepath : "/assets/images/ccb.jpg"
                            });
                        var oTmtModel = new JSONModel(
                            {
                                bst_temperature : "",
                                bst_humidity : "",
                                bst_co2 : "",
                                crt_temperature : "",
                                crt_humidity : "",
                                crt_co2 : "",
                                avr_temperature : "",
                                avr_humidity : "",
                                avr_co2 : "",
                                mtname_kor : "토마토",
                                mtcode : "MM00000012",
                                imagepath : "/assets/images/tmt.jpg"
                            });

                        this.getView().setModel(oReturn.results,"MTMASTER");
                        oStrModel.oData.bst_temperature = this.getView().getModel('MTMASTER')[2].Tem;
                        oCcbModel.oData.bst_temperature = this.getView().getModel('MTMASTER')[7].Tem;
                        oTmtModel.oData.bst_temperature = this.getView().getModel('MTMASTER')[12].Tem;

                        oStrModel.oData.bst_humidity = this.getView().getModel('MTMASTER')[2].Hum;
                        oCcbModel.oData.bst_humidity = this.getView().getModel('MTMASTER')[7].Hum;
                        oTmtModel.oData.bst_humidity = this.getView().getModel('MTMASTER')[12].Hum;

                        oStrModel.oData.bst_co2 = this.getView().getModel('MTMASTER')[2].Co2
                        oCcbModel.oData.bst_co2 = this.getView().getModel('MTMASTER')[7].Co2
                        oTmtModel.oData.bst_co2 = this.getView().getModel('MTMASTER')[12].Co2

                        this.getView().setModel(oMainModel, 'main');
                        this.getView().setModel(oStrModel, 'str');
                        this.getView().setModel(oCcbModel, 'ccb');
                        this.getView().setModel(oTmtModel, 'tmt');

                    }.bind(this)
                });
            },
            getCondition : function() {

                var uri = "/ConditionSet";
                // var oDataModel = this.getOwnerComponent().getModel();
                var oDataModel = this.getView().getModel();
                
                //
                oDataModel.read( uri, {
                    success : function(oReturn) {
                        // debugger;

                        console.log(oReturn.results);

                        var oLastDataModel = new JSONModel(oReturn.results[0]);
                        this.getView().setModel(oLastDataModel, 'lastdata');

                        oReturn.results.sort(function(a, b) {
                            return a.Time - b.Time;
                        });

                        var oDataModel = new JSONModel(oReturn.results);
                        console.log(oReturn.results);
                        this.getView().setModel(oDataModel, 'data');
                        
                        //set Power
                        this.setPower();

                    }.bind(this)
                });
            },
            onSliderMoved: function (oEvent) {
                var fValue = oEvent.getParameter("value");
                this.byId("containerLayout").setWidth(fValue + "%");
            },
            fnImageSet : function(path) {
                if(path){
                    // debugger;
                    return _rootPath + path;
                }
            },
            pressOnstr : function() {
                var oMainData = this.getView().getModel('main').getData();
                var oStrData = this.getView().getModel('str').getData();

                oMainData.bst_temperature = oStrData.bst_temperature; 
                oMainData.bst_humidity    = oStrData.bst_humidity; 
                oMainData.bst_co2         = oStrData.bst_co2; 
                oMainData.crt_temperature = oStrData.crt_temperature; 
                oMainData.crt_humidity    = oStrData.crt_humidity; 
                oMainData.crt_co2         = oStrData.crt_co2; 
                oMainData.avr_temperature = oStrData.avr_temperature; 
                oMainData.avr_humidity    = oStrData.avr_humidity; 
                oMainData.avr_co2         = oStrData.avr_co2; 
                oMainData.mtname_kor      = oStrData.mtname_kor; 
                oMainData.mtcode          = oStrData.mtcode; 

                this.getView().getModel('main').setData(oMainData);
                this.setPower();
            },
            pressOnccb : function() {
                var oMainData = this.getView().getModel('main').getData();
                var oCcbData = this.getView().getModel('ccb').getData();

                oMainData.bst_temperature = oCcbData.bst_temperature; 
                oMainData.bst_humidity    = oCcbData.bst_humidity; 
                oMainData.bst_co2         = oCcbData.bst_co2; 
                oMainData.crt_temperature = oCcbData.crt_temperature; 
                oMainData.crt_humidity    = oCcbData.crt_humidity; 
                oMainData.crt_co2         = oCcbData.crt_co2; 
                oMainData.avr_temperature = oCcbData.avr_temperature; 
                oMainData.avr_humidity    = oCcbData.avr_humidity; 
                oMainData.avr_co2         = oCcbData.avr_co2; 
                oMainData.mtname_kor      = oCcbData.mtname_kor; 
                oMainData.mtcode          = oCcbData.mtcode; 

                this.getView().getModel('main').setData(oMainData);
                this.setPower();
            },
            pressOntmt : function() {
                var oMainData = this.getView().getModel('main').getData();
                var oTmtData = this.getView().getModel('tmt').getData();

                oMainData.bst_temperature = oTmtData.bst_temperature; 
                oMainData.bst_humidity    = oTmtData.bst_humidity; 
                oMainData.bst_co2         = oTmtData.bst_co2; 
                oMainData.crt_temperature = oTmtData.crt_temperature; 
                oMainData.crt_humidity    = oTmtData.crt_humidity; 
                oMainData.crt_co2         = oTmtData.crt_co2; 
                oMainData.avr_temperature = oTmtData.avr_temperature; 
                oMainData.avr_humidity    = oTmtData.avr_humidity; 
                oMainData.avr_co2         = oTmtData.avr_co2; 
                oMainData.mtname_kor      = oTmtData.mtname_kor; 
                oMainData.mtcode          = oTmtData.mtcode; 

                this.getView().getModel('main').setData(oMainData);
                this.setPower();
            },
            setPower : function() {


                var oDataStrTemp = this.getView().getModel('MTMASTER')[2].Tem;
                var oDataCcbTemp = this.getView().getModel('MTMASTER')[7].Tem;
                var oDataTmtTemp = this.getView().getModel('MTMASTER')[12].Tem;

                var oDataStrHum = this.getView().getModel('MTMASTER')[2].Hum;
                var oDataCcbHum = this.getView().getModel('MTMASTER')[7].Hum;
                var oDataTmtHum = this.getView().getModel('MTMASTER')[12].Hum;

                var oDataStrCo2 = this.getView().getModel('MTMASTER')[2].Co2;
                var oDataCcbCo2 = this.getView().getModel('MTMASTER')[7].Co2;
                var oDataTmtCo2 = this.getView().getModel('MTMASTER')[12].Co2;

                var oDataCurrentData = this.getView().getModel('lastdata').getData();

                //딸기 온풍기/에어컨
                if( oDataCurrentData.Temperature * 1  > oDataStrTemp * 1){
                    //에어컨 On
                    $("#__content14").css({'filter':'grayscale(0)'});

                    //온풍기 Off
                    $("#__content8").css({'filter':'grayscale(100)'});
                }else if( oDataCurrentData.Temperature * 1 < oDataStrTemp * 1){
                    //온풍기 On__content8
                    $("#__content8").css({'filter':'grayscale(0)'});
                    //에어컨 Off
                    $("#__content14").css({'filter':'grayscale(100)'});
                }else{
                     //온풍기 Off
                     $("#__content8").css({'filter':'grayscale(100)'});
                      //에어컨 Off
                    $("#__content14").css({'filter':'grayscale(100)'});
                }

                //오이 온풍기/에어컨
                if( oDataCurrentData.Temperature * 1 > oDataCcbTemp * 1){
                    //에어컨 On
                    $("#__content16").css({'filter':'grayscale(0)'});

                    //온풍기 Off
                    $("#___content10").css({'filter':'grayscale(100)'});
                }else if( oDataCurrentData.Temperature * 1 < oDataCcbTemp * 1){
                    //온풍기 On___content10
                    $("#___content10").css({'filter':'grayscale(0)'});
                    //에어컨 Off
                    $("#__content16").css({'filter':'grayscale(100)'});
                }else{
                     //온풍기 Off
                     $("#___content10").css({'filter':'grayscale(100)'});
                      //에어컨 Off
                    $("#__content16").css({'filter':'grayscale(100)'});
                }

                //토마토 온풍기/에어컨
                if( oDataCurrentData.Temperature * 1 > oDataTmtTemp * 1){
                    //에어컨 On
                    $("#__content18").css({'filter':'grayscale(0)'});

                    //온풍기 Off
                    $("#__content12").css({'filter':'grayscale(100)'});
                }else if( oDataCurrentData.Temperature * 1 < oDataTmtTemp * 1){
                    //온풍기 On__content12
                    $("#__content12").css({'filter':'grayscale(0)'});
                    //에어컨 Off
                    $("#__content18").css({'filter':'grayscale(100)'});
                }else{
                     //온풍기 Off
                     $("#__content12").css({'filter':'grayscale(100)'});
                      //에어컨 Off
                    $("#__content18").css({'filter':'grayscale(100)'});
                }



                //가습기

                 //딸기 가습기
                 if( oDataCurrentData.Humidity * 1 < oDataStrHum * 1){
                    //가습기 On
                    $("#__content20").css({'filter':'grayscale(0)'});
                }else{
                    //가습기 Off
                    $("#__content20").css({'filter':'grayscale(100)'});
                }

                //오이 가습기
                if( oDataCurrentData.Humidity * 1 < oDataCcbHum * 1){
                    //가습기 On
                    $("#__content22").css({'filter':'grayscale(0)'});
                }else{
                    //가습기 Off
                    $("#__content22").css({'filter':'grayscale(100)'});
                }

                //토마토 가습기
                if( oDataCurrentData.Humidity * 1 < oDataTmtHum * 1){
                    //가습기 On
                    $("#__content24").css({'filter':'grayscale(0)'});
                }else{
                    //가습기 Off
                    $("#__content24").css({'filter':'grayscale(100)'});
                }


                //공기청정기

                 //딸기 공기청정기
                 if( oDataCurrentData.Co2 * 1 > oDataStrCo2 * 1){
                    //공기청정기 On
                    $("#__content26").css({'filter':'grayscale(0)'});
                }else{
                    //공기청정기 Off
                    $("#__content26").css({'filter':'grayscale(100)'});
                }

                //오이 공기청정기
                if( oDataCurrentData.Co2 * 1 > oDataCcbCo2 * 1){
                    //공기청정기 On
                    $("#__content28").css({'filter':'grayscale(0)'});
                }else{
                    //공기청정기 Off
                    $("#__content28").css({'filter':'grayscale(100)'});
                }

                //토마토 공기청정기
                if( oDataCurrentData.Co2 * 1 > oDataTmtCo2 * 1){
                    //공기청정기 On
                    $("#__content30").css({'filter':'grayscale(0)'});
                }else{
                    //공기청정기 Off
                    $("#__content30").css({'filter':'grayscale(100)'});
                }


            },
            getRealTimeData : function() {
                var uri = "/ConditionSet";
                // var oDataModel = this.getOwnerComponent().getModel();
                var oDataModel = this.getView().getModel();

                var isRealTimeExe = this.byId('realTime');
                var oLastData = this.getView().getModel('lastdata').getData();
                var oDataList = this.getView().getModel('data').getData();
                
                if(isRealTimeExe.getState())
                {
                    oDataModel.read( uri, {
                        success : function(oReturn) {
                            // debugger;
                            var oLastDataModel = new JSONModel(oReturn.results[0]);
                            
                            console.log("old Last time : ", oLastData.Time);
                            console.log("new last Time : ", oLastDataModel.oData.Time);
                            console.log(oLastDataModel.oData.Time > oLastData.Time);
                            
                            if( oLastDataModel.oData.Time > oLastData.Time)
                            {
                                console.log(oReturn.results);
                                this.getView().setModel(oLastDataModel, 'lastdata');
    
                                oDataList.push(oLastDataModel);

                                var onewDataModel = new JSONModel(oDataList);
                                this.getView().setModel(onewDataModel, 'data');
    
                                //set Power
                                this.setPower();
    
                            }

                        }.bind(this)
                    });
                }
                
                
            }
        });
    });
