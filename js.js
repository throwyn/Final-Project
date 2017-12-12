
//--- Internal functions
function searchInList(list, page) {
    for (var i = 0; i < list.length; i++)
        if (list[i].className === page)
            return i;
}
function ajaxHelper(uri, method, data) {
    //self.error(''); // Clear error message
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
    function vm() {
        console.log('ViewModel initiated...');
        //---Variáveis locais
        var self = this;
        self.menu = ['Countries', 'Leagues', 'Teams'];
        self.list =
            [
                {
                    "className": "Countries",
                    "baseUri": "http://192.168.160.28/football/api/countries"
                },
                {
                    "className": "Leagues",
                    "baseUri": "http://192.168.160.28/football/api/leagues"
                },
                {
                    "className": "Teams",
                    "baseUri": "http://192.168.160.28/football/api/teams"
                }

            ];
        self.chosenMenuId = ko.observable();
        self.chosenMenuData = ko.observable();
        self.error = "Whoops! Kind of error";
        self.dupa = function () { console.log('dupa'); };


        // Behaviours  
        self.menuGoTo = function (page) {
            self.chosenMenuId(page);
            self.chosenMenuData(null); // Stop showing actual content
            //console.log(self.list[0]);
            //console.log(page);
            //console.log(searchInList(self.list, page));
            self.get(self.list, searchInList(self.list,page));
        };

        self.get = function (list, page) {
            console.log('CALL: get' + list[page].className+'...');
            ajaxHelper(list[page].baseUri, 'GET').done(function (data) {
                console.log(data);
                self.chosenMenuData(data);
            });
        };
        //---- initial call
        //self.menuGoTo("Countries");
    }
    ko.applyBindings(vm);
});

//$(window).on("hashchange", function () {
//    console.log(vm);
//        var hash = window.location.hash;
//        if (hash !== "") {
//            console.log(window.location.hash);
//            $(".pages").hide();
//            $(hash).show();
//        }
//        if (hash === "#leagues") {
//            vm = function () {
//                console.log('ViewModel updating...');
//                //---Variáveis locais
//                vm.baseUri = 'http://192.168.160.28/football/api/leagues';
//                vm.className = 'Leagues';
//                vm.description = 'This page aims to demonstrate the use of the football web API for countries and the interconnection with other entities.<br > Called method(s): <ul><li>' + baseUri + '</li></ul>';
//                vm.error = ko.observable();
//                vm.leagues = ko.observableArray([]);
//                //---- initial call
//                vm.get();
//            };
//        }
//        if (window.location.hash === "#countries") {
//            vm = function () {
//                console.log('ViewModel initiated...');
//                //---Variáveis locais
//                var self = this;
//                var baseUri = 'http://192.168.160.28/football/api/countries';
//                self.className = 'Countries';
//                self.description = 'This page aims to demonstrate the use of the football web API for countries and the interconnection with other entities.<br > Called method(s): <ul><li>' + baseUri + '</li></ul>';
//                self.error = ko.observable();
//                self.countries = ko.observableArray([]);
//                //--- Externel functions (accessible outside)
//                self.getCountries = function () {
//                    console.log('CALL: getCountries...');
//                    ajaxHelper(baseUri, 'GET').done(function (data) {
//                        self.countries(data);
//                    });
//                };
//                //---- initial call
//                self.getCountries();
//            };
//        }
//    });

