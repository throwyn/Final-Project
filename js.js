
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
                    "className": "Teams",//Get a list of teams(first 20)
                    "baseUri": "http://192.168.160.28/football/api/teams"
                },
                {
                    "className": "Country_Leagues",//Get country Leagues
                    "baseUri": "http://192.168.160.28/football/api/countries/countryLeagues/{id}"
                },
                {
                    "className": "Info_Country",//Get info about a country
                    "baseUri": "http://192.168.160.28/football/api/countries/{id}"
                },
                {
                    "className": "Search_For_Team",//Get a list of Teams with a name passed as input parameter
                    "baseUri": "http://192.168.160.28/football/api/teams/search?srcStr=" 
                },
                {
                    "className": "Teams_Of_League",//Get a list of league Teams
                    "baseUri": "http://192.168.160.28/football/api/teams/leagueTeams/{id}"
                },
                {
                    "className": "Matches_Of_Team",// Get a List of matches (grouped by season) to a specific Team
                    "baseUri": "http://192.168.160.28/football/api/teams/seasons/{id}"
                },
                {
                    "className": "Seasons",//Get a list of match seasons
                    "baseUri": "http://192.168.160.28/football/api/teams/seasons"
                },
                {
                    "className": "Number_Of_Teams",//Get the number of teams in the database
                    "baseUri": "http://192.168.160.28/football/api/teams/teamsCount"
                },
                {
                    "className": "Info_Team",//Get info about a Team
                    "baseUri": "http://192.168.160.28/football/api/teams/{id}"
                },
                {
                    "className": "Teams_Paged_List",//Get a paged list of teams
                    "baseUri": "http://192.168.160.28/football/api/teams?page={page}&pageSize={pageSize}"
                },
                {
                    "className": "Number_Of_Players",//Get the number of players in the database
                    "baseUri": "http://192.168.160.28/football/api/players/playersCount"
                },
                {
                    "className": "Players_With_Name",//Get a list of Players with a name passed as input parameter
                    "baseUri": "http://192.168.160.28/football/api/players/search?srcStr={srcStr}"
                },
                {
                    "className": "Players",//Get a list of players (first 20)
                    "baseUri": "http://192.168.160.28/football/api/players"
                },
                {
                    "className": "Players_Paged_List",//Get a paged list of players
                    "baseUri": "http://192.168.160.28/football/api/players?page={page}&pageSize={pageSize}"
                },
                {
                    "className": "Info_Player",//Get info about a player
                    "baseUri": "http://192.168.160.28/football/api/players/{id}"
                },
                {
                    "className": "Info_League",//Get info about a league
                    "baseUri": "http://192.168.160.28/football/api/leagues/{id}"
                },
                {
                    "className": "List_Of_Seasons",// Get a List of seasons
                    "baseUri": "http://192.168.160.28/football/api/seasons"
                },
                {
                    "className": "List_Of_Matches",//Get a list of the top(100) matches
                    "baseUri": "http://192.168.160.28/football/api/matches"
                },
                {
                    "className": "Matches_Of_Team_In_Season",//Get matches for a Team in a Season
                    "baseUri": "http://192.168.160.28/football/api/matches/{id}"
                }

            ];
        self.chosenMenuId = ko.observable();
        self.CountriesLeaguesData = ko.observable();
        self.SearchForTeamString = ko.observable();
        self.TeamsData = ko.observable();
        self.error = "Whoops! Kind of error";
        self.dupa = function () { console.log('dupa'); };


        // Behaviours  
        //self.menuGoTo = function (page) {
        //    console.log(page.toLowerCase());
        //    window.location.hash = page.toLowerCase();
        //    self.chosenMenuId(page);
        //    self.CountriesLeaguesData(null); // Stop showing actual content
        //    //console.log(self.list[0]);
        //    //console.log(page);
        //    //console.log(searchInList(self.list, page));
        //    self.get(self.list, searchInList(self.list,page));
        //};
        self.clearData = function () {
            self.CountriesLeaguesData(null); // Stop showing actual content
            self.TeamsData(null);
        };
        self.menuGoTo = function (page) {
            console.log("MENU TO GOO" + page);
            console.log(self.SearchForTeamString());
            if (page === 'Search_For_Team' && self.SearchForTeamString() === '') {
                console.log('1');
                location.hash = 'Teams';
            }
            else {
                console.log('2');
                location.hash = page;
            }
        };
        self.GoToSpecyfic = function (page) {
            console.log("MENU TO GOO" + page);
            if (page === 'Search_For_Team' && self.SearchForTeamString() === '') {
                console.log('1');
                location.hash = 'Teams';
            }
            else {
                console.log('2');
                location.hash = page + '/' + self.SearchForTeamString();
            }
        };

        self.get = function (list) {
            console.log('CALL: get' + list.className + '...');
            var URL = '';
            if (list.className === 'Search_For_Team') { URL = list.baseUri + self.SearchForTeamString(); }
            else { URL = list.baseUri; }
            console.log(list, URL);
            ajaxHelper(URL, 'GET').done(function (data) {
                self.clearData();
                if (list.className === 'Countries' || list.className === 'Leagues')
                    self.CountriesLeaguesData(data);
                if (list.className === 'Teams' || list.className === 'Search_For_Team')
                    self.TeamsData(data);
                console.log(data);
                console.log(list.className);
            });
        };
        //---- initial call
        //self.menuGoTo("Countries");

        Sammy(function () {
            this.get('#:menu', function () {
                self.chosenMenuId(this.params.menu);

               // if (this.params.menu === 'Countries' || this.params.menu === 'Leagues')
                //self.chosenMailData(null);
                console.log(self.chosenMenuId());
                console.log(self.list[searchInList(self.list, this.params.menu)]);
                self.get(self.list[searchInList(self.list, this.params.menu)]);
            });

            this.get('#:menu/:SearchForTeamString', function () {
                self.chosenMenuId(this.params.menu);

                // if (this.params.menu === 'Countries' || this.params.menu === 'Leagues')
                //self.chosenMailData(null);
                console.log(self.chosenMenuId());
                console.log(self.list[searchInList(self.list, this.params.menu)]);
                self.get(self.list[searchInList(self.list, this.params.menu)]);
            });

            this.get('', function () { this.app.runRoute('get', '#Countries'); });
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



