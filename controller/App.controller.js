sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";
    return Controller.extend("kointrack.controller.App", {

        onInit: function () {
            window.This = this;
            this.CRYPTOCOMPARE_API_URI = "https://min-api.cryptocompare.com";
            this.CRYPTOCOMPARE_URI = "https://www.cryptocompare.com";

            //  window.l = this.getView().byId("li");
            this.initialiseModels();
            this.oData = {};
            var self = this;

            var url = "https://min-api.cryptocompare.com/data/all/coinlist";
            $.ajax({
                url: url,
                async: true,
                // jsonpCallback: 'getJSON',
                contentType: "application/json",
                // dataType: 'jsonp',
                success: function (data) {
                    self.oData = data;
                    self.oModel = new sap.ui.model.json.JSONModel(self.oData);
                    self.oModel.setSizeLimit(10000);
                    self.getView().setModel(self.oModel);
                    self.getView().getModel("busyIndicator").setProperty("/busy", false);
                }
            });
        },

        initialiseModels: function(){
            var oBusyModel = new sap.ui.model.json.JSONModel({ busy: true });
            var oDetailPageModel = new sap.ui.model.json.JSONModel(
                {
                    Symbol: "",
                    ImageUrl: "",
                    CoinName: "",
                    Price: "",
                    Currency: "INR" // default currency

                }
            );
            this.getView().setModel(oBusyModel, "busyIndicator");
            this.getView().setModel(oDetailPageModel, "detail");
        },

        onSearch: function (oEvent) {
            var sQuery = oEvent.getSource().getValue();
            
            //creating filter for model
            var aFilters = [];
            if (sQuery && sQuery.length > 0) {
                var oFilter = new sap.ui.model.Filter("CoinName", sap.ui.model.FilterOperator.Contains, sQuery);
                aFilters.push(oFilter);
            }

            //update list binding with filtered values
            var oCoinList = this.getView().byId("masterPage-list-id");
            oCoinList.getBinding("items").filter(aFilters, "Application");
        },

        onItemPress: function (oEvent) {
            var sPath = oEvent.getParameter("listItem").getBindingContext().sPath;
            var sSymbol = sPath.split("/")[2]; //eg of sPath here "/Data/BTC" so this gives the symbol BTC
            // this.getView().byId("detailPage-textArea-id").setValue(this.oData["Data"][sSymbol]["CoinName"]);
            var oDetailModel = this.getView().getModel("detail");
            //oDetailModel.setProperty("/Symbol", sSymbol);

            oDetailModel.setProperty("/ImageUrl", this.CRYPTOCOMPARE_URI + this.oData.Data[sSymbol].ImageUrl);
            oDetailModel.setProperty("/CoinName", this.oData.Data[sSymbol].CoinName);
            oDetailModel.setProperty("/Symbol", this.oData.Data[sSymbol].Symbol);
            
            //filling up
            var self = this;
            var url = this.CRYPTOCOMPARE_API_URI + "/data/price?fsym=" + sSymbol + "&tsyms=" + oDetailModel.getProperty("/Currency");
            $.ajax({
                url: url,
                async: true,
                // jsonpCallback: 'getJSON',
                contentType: "application/json",
                // dataType: 'jsonp',
                success: function (data) {
                    oDetailModel.setProperty("/Price", data[oDetailModel.getProperty("/Currency")]);
                    oDetailModel.refresh();
                }
            });
        },


            // this.getView().byId("h").setModel(oDetailModel);
            // oDetailModel.refresh();
    });


});