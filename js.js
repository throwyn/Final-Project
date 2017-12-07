
//--- Internal functions
function ajaxHelper(uri, method, data) {
    self.error(''); // Clear error message
    return $.ajax({
        type: method,
        url: uri,
        dataType: 'json',
        contentType: 'application/json',
        data: data ? JSON.stringify(data) : null,
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("AJAX Call[" + uri + "] Fail...");
            self.error(errorThrown);
        }
    });
}

$(document).ready(function () {
    
    $(window).on("hashchange", function () {
        var hash = window.location.hash;
        if (hash !== "") {
            console.log(window.location.hash);
            $(".pages").hide();
            $(hash).show();
        }
    });
    $(window).on("hashchange", function () {

        if (window.location.hash === "#leagues") {
            var leagues = function () {
                console.log('ViewModel initiated...');
                //---Variáveis locais
                var self = this;
                var baseUri = 'http://192.168.160.28/football/api/leagues';
                self.className = 'Leagues';
                self.description = 'This page aims to demonstrate the use of the football web API for countries and the interconnection with other entities.<br > Called method(s): <ul><li>' + baseUri + '</li></ul>';
                self.error = ko.observable();
                self.leagues = ko.observableArray([]);
                //--- Externel functions (accessible outside)
                self.getLeagues = function () {
                    console.log('CALL: getLeagues...');
                    ajaxHelper(baseUri, 'GET').done(function (data) {
                        self.leagues(data);
                    });
                };
                //---- initial call
                self.getLeagues();
            };
            ko.applyBindings(leagues);
            ko.cleanNode(leagues);
        }
        if (window.location.hash === "#countries") {
            var vm = function () {
                console.log('ViewModel initiated...');
                //---Variáveis locais
                var self = this;
                var baseUri = 'http://192.168.160.28/football/api/countries';
                self.className = 'Countries';
                self.description = 'This page aims to demonstrate the use of the football web API for countries and the interconnection with other entities.<br > Called method(s): <ul><li>' + baseUri + '</li></ul>';
                self.error = ko.observable();
                self.countries = ko.observableArray([]);
                //--- Externel functions (accessible outside)
                self.getCountries = function () {
                    console.log('CALL: getCountries...');
                    ajaxHelper(baseUri, 'GET').done(function (data) {
                        self.countries(data);
                    });
                };
                //---- initial call
                self.getCountries();
            };
            ko.applyBindings(vm);
            ko.cleanNode(vm);
        }
    });
});

$(function () {

});