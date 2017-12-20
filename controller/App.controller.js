sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";
    return Controller.extend("kointrack.controller.App", {
        
        onInit: function () {
            window.This = this;
            window.l = this.getView().byId("li");
            this.oData = {};
            var self = this;

            // var oCoinList = this.getView().byId("masterPage-list-id");
            // oCoinList.getBinding("items").sort( new sap.ui.model.Sorter('CoinName'));
        //     fetch("https://www.cryptocompare.com/api/data/coinlist/", {method: 'GET',mode:'cors'}).then(function(response) {
        //       return response.json();
        //    }).then(function(data){
        //        self.oData = data;
        //    });
        var url = "https://min-api.cryptocompare.com/data/all/coinlist";
        $.ajax({
            url: url,
            async: true,
            // jsonpCallback: 'getJSON',
            contentType: "application/json",
            // dataType: 'jsonp',
            success: function(data) {
                self.oData = data;
                // var oMultiInput = sap.m.MultiInput("cur", {
                // 	suggestionItems: "{path: '/Data'}"	
                // });	
                
                // oMultiInput.placeAt("page");
                self.oModel = sap.ui.model.json.JSONModel(self.oData);
                self.oModel.setSizeLimit(10000);
                self.getView().setModel(self.oModel);
                //self.getView().getModel().refresh();
            }
        });


            // // this.onPressKoinex();
            // this.oModel = sap.ui.model.json.JSONModel(this.oData);
            
            // this.getView().setModel(this.oModel);

        },

        // onPressKoinex: function(){
        //    var self = this;
        //    fetch("https://koinex.in/api/ticker", {mode:'cors'}).then(function(response) {
        //       return response.json();
        //    }).then(function(data){
        //        self.oData.coins = self.parseData(data.prices);
        //        self.getView().getModel().refresh();
        //    });
        //    //debugger;
          
        //    self.oView.byId("tileContainer-id").refreshItems();
        // },

        // parseData: function(data){
        //     var obj = {};
        //     for(var key in data){
        //         if(data.hasOwnProperty(key)){
        //             obj[key] = {
        //                 coinName: key,
        //                 price: data[key]
        //             };
        //         }
        //     }
        //     //console.log(obj);
        //     return obj;
            
        // },

        onSearch: function(oEvent){
            //var sQuery = oEvent.getParameter('query');
            var sQuery = oEvent.getSource().getValue();
            //creating filter for model
            var aFilters = [];
            if(sQuery && sQuery.length > 0){
                var oFilter = new sap.ui.model.Filter("CoinName", sap.ui.model.FilterOperator.Contains, sQuery);
                aFilters.push(oFilter);
            }

            //update list binding with filtered values
            var oCoinList = this.getView().byId("masterPage-list-id");
            oCoinList.getBinding("items").filter(aFilters, "Application");
        }

    });


});
