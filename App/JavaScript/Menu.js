var Menu = Class.extend({

    construct: function () {
        this.svgMenu = null;
        this.myTag = "";
        this.menu = null;
        this.options = null;
        this.selectedIndex = null;
    },

    /////////////////////////////////////////////////////////////

    startup: function (whereToRender) {
        this.myTag = whereToRender;
        this.updateScreen();
    },

    /////////////////////////////////////////////////////////////

    //Drawing the bar chart for Origin distribution for the first visualization group.
    drawMenu: function (error, data) {
        this.menu = d3.select(this.myTag).append("select").attr("name", "communityselection");
        this.options = this.menu.selectAll("option").data(data).enter().append("option");
        this.options.text(function (d) {
            return d.COMMUNITY;
        });
        this.menu.on("change", function () {
            this.selectedIndex = d3.event.target.value;
        });
    },

    /////////////////////////////////////////////////////////////

    updateWindow: function () {
        var xWin, yWin;

        xWin = d3.select(this.myTag).style("width");
        yWin = d3.select(this.myTag).style("height");
    },

    /////////////////////////////////////////////////////////////

    updateData: function () {
        var fileToLoad = "json/menu.php";
        this.inDataCallbackFunc = this.drawMenu.bind(this);
        d3.json(fileToLoad, this.inDataCallbackFunc);

    },

    /////////////////////////////////////////////////////////////

    updateScreen: function () {
        this.updateWindow();
        this.updateData();
    },

    getSelectedIndex: function () {
        return this.selectedIndex;
    }
});