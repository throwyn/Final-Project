

//--- Internal functions
function searchInList(list, page) {
    for (var i = 0; i < list.length; i++)
        if (list[i].className === page)
            return list[i];
}
function loaded(obj) {
    document.getElementById(obj).style.display = '';
}
function KitsError(obj){

}
function searchForDataOfSeason(list, year) {
    for (var i = 0; i < list.length; i++)
        if (list[i].Label === year)
            return list[i];
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
                    "baseUri": "http://192.168.160.28/football/api/countries/countryLeagues/"
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
                    "baseUri": "http://192.168.160.28/football/api/teams/"
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
                    "baseUri": "http://192.168.160.28/football/api/leagues/"
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
                    "className": "Match",//Get matches for a Team in a Season
                    "baseUri": "http://192.168.160.28/football/api/matches/"
                },
                {
                    "className": "Welcome"//Get to "welcome"
                }

            ];

        //Main page
        self.mainPage = ko.observable();

        //countries and leagues
        self.chosenMenuTitle = ko.observable();
        self.CountriesData = ko.observable();
        self.LeaguesData = ko.observable();

        //Specyfic team
        self.SpecificTeamID = ko.observable();
        self.SpecificTeamData = ko.observable();
        self.SpecificTeamSeasonsData = ko.observable();
        self.SpecificTeamImageUrl = ko.observable();
        self.SetSpecificTeamImageUrl = function (id) {
            self.SpecificTeamImageUrl("https://cdn.sofifa.org/18/teams/" + id + ".png");
            console.log(self.SpecificTeamImageUrl());
        };

        self.SpecificTeamSelectedSeasonData = ko.observable();
        self.AttributesOfTeam = function () {if(self.SpecificTeamSelectedSeasonData().Attributes !== null) { return self.SpecificTeamSelectedSeasonData().Attributes; }};
        self.MatchesOfTeam = function () { return self.SpecificTeamSelectedSeasonData().Matches; };
        self.SpecificTeamSelectedSeason = ko.observable();
        self.SpecificTeamSeasonsSet = function (season) {
            document.getElementById("KitArea1").style.display = '';
            document.getElementById("KitArea2").style.display = '';
            document.getElementById("KitArea3").style.display = '';
            document.getElementById("KitArea4").style.display = '';
            self.SpecificTeamSelectedSeason(season);
            self.SpecificTeamSelectedSeasonData(searchForDataOfSeason(self.SpecificTeamSeasonsData(), season));
        };
        //Leagues of Country
        self.LeaguesOfCountryID = ko.observable();
        self.LeaguesOfCountryData = ko.observable();
        self.NameOfSelectedCountry = ko.observable();
        self.SetNameOfSelectedCountry = function () { self.NameOfSelectedCountry(self.LeaguesOfCountryData().countryName); };

        //League
        self.LeagueID = ko.observable();
        self.LeagueData = ko.observable();
        self.NameOfLeague = ko.observable();
        self.SetNameOfLeague = function () { self.NameOfLeague(self.LeaguesyData().name); };

        //Match
        self.MatchID = ko.observable();
        self.MatchData = ko.observable();
        self.NameOfLeague = ko.observable();
        self.SetNameOfLeague = function () { self.NameOfLeague(self.LeaguesyData().name); };


        // Seasons
        self.SeasonsData = ko.observable();

        //Teams
        self.SearchForTeamString = ko.observable();
        self.TeamsData = ko.observable();

        //Other functions
        self.error = function () { console.log("Whoops! Kind of error"); };
        self.dupa = function () { console.log(self.SpecificTeamSelectedSeasonData().Attributes); };


        // Behaviours  
        //self.menuGoTo = function (page) {
        //    console.log(page.toLowerCase());
        //    window.location.hash = page.toLowerCase();
        //    self.chosenMenuTitle(page);
        //    self.CountriesLeaguesData(null); // Stop showing actual content
        //    //console.log(self.list[0]);
        //    //console.log(page);
        //    //console.log(searchInList(self.list, page));
        //    self.get(self.list, searchInList(self.list,page));
        //};
        self.NormalizeDateOfMatch = function (date) { return date.split("T")[0]; };
        self.CreateURLOfLogoImg = function (id) { return "https://cdn.sofifa.org/18/teams/" + id + ".png"; };
        self.DownloadSeasons = function () {
            ajaxHelper("http://192.168.160.28/football/api/teams/seasons", 'GET').done(function (data) {
                self.SeasonsData(data);
                console.log(self.SeasonsData());
            });
        };
        self.DownloadSpecificTeamSeasonsData = function () {
            ajaxHelper("http://192.168.160.28/football/api/teams/seasons/" + self.SpecificTeamID(), 'GET').done(function (data) {
                self.SpecificTeamSeasonsData(data);
                self.SpecificTeamSelectedSeasonData(self.SpecificTeamSeasonsData()[0]);
                console.log(self.SpecificTeamSelectedSeasonData());
            });
        };
        self.clearData = function () {
            self.CountriesData(null);
            self.LeaguesData(null); // Stop showing actual content
            self.TeamsData(null);
            self.SpecificTeamData(null);
            self.SpecificTeamSelectedSeasonData(null); 
            self.SpecificTeamSeasonsData(null);
            self.SpecificTeamSelectedSeasonData(null);
            self.LeaguesOfCountryData(null);
            self.LeagueData(null);
            self.MatchData(null);
        };
        self.menuGoTo = function (page) {
            console.log("MENU TO GOO" + page);
            location.hash = page;
        };
        self.GoToTeam = function (obj) {
            console.log("Go to team id: " + obj.id);
            self.SpecificTeamID(obj.id);
            SetSpecificTeamImageUrl(obj.team_fifa_api_id);
            location.hash = '#Info_Team/' + obj.id;

        };
        self.GoToMatch = function (id) {
            console.log("Go to match id: " + id);
            self.MatchID(id);
            location.hash = '#Match/' + id;

        };
        self.GoToSpecyfic = function (page) {
            self.SearchForTeamString(document.getElementById("SearchForTeamString").value);
            console.log("MENU TO GOO" + SearchForTeamString());
            if (page === 'Search_For_Team' && (self.SearchForTeamString() === '' || self.SearchForTeamString() === null )) {
                console.log('1');
                location.hash = 'Teams';
            }
            else {
                console.log(self.SearchForTeamString());
                console.log('2');
                location.hash = page + '/' + self.SearchForTeamString();
            }
        };

        self.GoToLeaguesOfCountry = function (page) {
            //self.chosenMenuTitle(page.name);
            console.log("Go To Leagues Of Country:  " + page.name);
            location.hash = 'Country_Leagues' + '/' + page.id;
        };
        self.GoToLeague = function (page) {
            console.log("Go To League:  " + page.name);
            location.hash = 'Info_League' + '/' + page.id;
        };
        self.GoToSpecificTeam = function (page) {
            console.log("Go To Team " + page.id);
            self.SpecificTeamID(page.id);
            self.SetSpecificTeamImageUrl(page.team_fifa_api_id);
            console.log(self.SpecificTeamID());
            location.hash = 'Info_Team' + '/' + self.SpecificTeamID();
        };

        self.get = function (list) {
            self.clearData; 
            console.log('CALL: get' + list.className + '...');
            console.log(list);
            var URL = '';
            switch (list.className) {
                case 'Search_For_Team':
                    URL = list.baseUri + self.SearchForTeamString();
                    console.log(SearchForTeamString());
                    break;

                case 'Info_Team':
                    URL = list.baseUri + self.SpecificTeamID();
                    break;
                case 'Country_Leagues':
                    URL = list.baseUri + self.LeaguesOfCountryID();
                    break;
                case 'Info_League':
                    URL = list.baseUri + self.LeagueID();
                    break;
                case 'Match':
                    URL = list.baseUri + self.MatchID();
                    break;
                    
                case 'Welcome':
                    URL = list.baseUri + self.Welcome();
                    break;
                
                default: 
                    URL = list.baseUri;
                
            }
            console.log(list, URL);
            ajaxHelper(URL, 'GET').done(function (data) {
                self.clearData();
                if (list.className === 'Countries') {
                    self.chosenMenuTitle('Countries');
                    self.CountriesData(data);
                }
                if ( list.className === 'Leagues') {
                    self.chosenMenuTitle('Leagues');
                    self.LeaguesData(data);
                }
                if (list.className === 'Teams' || list.className === 'Search_For_Team') {
                    self.chosenMenuTitle('Teams');
                    self.TeamsData(data);
                }
                if (list.className === 'Info_Team') {
                    self.chosenMenuTitle(data.team_long_name + '  [' + data.team_short_name+']');
                    self.SpecificTeamData(data);
                    self.DownloadSeasons();
                    self.DownloadSpecificTeamSeasonsData();
                    console.log(data);
                }
                if (list.className === 'Country_Leagues') {
                    self.chosenMenuTitle(data[0].countryName);
                    self.LeaguesData(data);
                }
                if (list.className === 'Info_League') {
                    self.chosenMenuTitle(data.name);
                    self.LeagueData(data);
                    console.log(data.name);
                }
                if (list.className === 'Match') {
                    self.chosenMenuTitle(data.home_team.team_long_name + '[' + data.home_team.team_short_name + ']' + '  VS  ' + data.away_team.team_long_name + '[' + data.away_team.team_short_name + ']');
                    self.MatchData(data);
                }
                


                //console.log(self.SpecificTeamImageUrl());
                console.log(data);
                console.log(list.className);
            });
        };
        //---- initial call
        //self.menuGoTo("Countries");

        Sammy(function () {
            this.get('#:menu', function () {
                //self.chosenMenuTitle(this.params.menu);

               // if (this.params.menu === 'Countries' || this.params.menu === 'Leagues')
                //self.chosenMailData(null);
                //console.log(self.chosenMenuTitle());
                //console.log(searchInList(self.list, this.params.menu));
                self.get(searchInList(self.list, this.params.menu));
            });

            this.get('#:menu/:id', function () {
                //console.log(self.SearchForTeamString());
                console.log(this.params);
                if (this.params.menu === 'Country_Leagues') {
                    self.LeaguesOfCountryID(this.params.id);
                }
                if (this.params.menu === 'Search_For_Team') {
                    self.SearchForTeamString(this.params.id);
                    console.log(this.params.id);
                }
                if (this.params.menu === 'Info_League') {
                    self.LeagueID(this.params.id);
                    console.log(this.params.id);
                }
                if (this.params.menu === 'Info_Team') {
                    self.SpecificTeamID(this.params.id);
                }
                if (this.params.menu === 'Match') {
                    self.MatchID(this.params.id);
                }
                //console.log(self.chosenMenuTitle());
                //console.log(self.list[searchInList(self.list, this.params.menu)]);
                self.get(searchInList(self.list, this.params.menu));
            });

           // this.get('', function () { this.app.runRoute('get', '#Countries'); });
            this.get('', function () {
                self.clearData();
                //this.app.runRoute('get', '#Welcome');
            });
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
//$("img").on('error', function () {
//    $(this.parentNode.parentNode.removeChild(this.parentNode);).hide();
//});