
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
        //self.menuGoTo = function (page) {
        //    console.log(page.toLowerCase());
        //    window.location.hash = page.toLowerCase();
        //    self.chosenMenuId(page);
        //    self.chosenMenuData(null); // Stop showing actual content
        //    //console.log(self.list[0]);
        //    //console.log(page);
        //    //console.log(searchInList(self.list, page));
        //    self.get(self.list, searchInList(self.list,page));
        //};
        self.menuGoTo = function (page) {
            location.hash = page;
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

        Sammy(function () {
            this.get('#:menu', function () {
                self.chosenMenuId(this.params.menu);
                self.chosenMenuData(null); // Stop showing actual content
                //self.chosenMailData(null);
                self.get(self.list, searchInList(self.list, this.params.menu));
            });

            //this.get('#:folder/:mailId', function () {
            //    self.chosenFolderId(this.params.folder);
            //    self.chosenFolderData(null);
            //    $.get("/mail", { mailId: this.params.mailId }, self.chosenMailData);
            //});

            this.get('', function () { this.app.runRoute('get', '#Menu'); });
        }).run();    
    }
    ko.applyBindings(vm);

    //$(window).on("hashchange", function () {
    //    var hash = window.location.hash;
    //    if (hash !== "") {
    //        console.log(window.location.hash);
    //        $(hash).show();
    //    }
    //    if (hash === "#leagues") {

    //    }
    //    if (hash === "#countries") {

    //    }
    //});
});



