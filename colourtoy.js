(function ($, global) {
    
var updateSwatch, needUpdate = false,
    console = global.console || {log: function(){}},
    settings = new Settings(),
    histSize = 250, // fits in a cookie nicely
    colour;


////////////////////////////////////////////////////////////////////////////////
// Theme
$(function () {
    var themeButtons = $("[name=theme]"),
        themeName = settings.get("theme", "dark-theme");
        
    if (themeName == "light-theme") {
        $("#select-light").attr("checked", "checked");
    }
    else {
        $("#select-dark").attr("checked", "checked");
    }
    
    $("#theme-select").buttonset({text: true});
    themeButtons.change(function (event) { selectTheme(event.target.value); });
    selectTheme(themeName);
    
    function selectTheme (themeName) {
        $("link.theme").each(function () {
            var el = $(this);
            if (el.hasClass(themeName)) {
                el.attr("media", "screen");
            }
            else {
                el.attr("media", "none");
            }
        });
        settings.set("theme", themeName);
    }
});


////////////////////////////////////////////////////////////////////////////////
// Main swatch, readout, and history
$(function () {
    var i, h, rSlider, gSlider, bSlider, hSlider, sSlider, lSlider, invert,
        mainSwatch = $("#main-swatch"),
        mainReadOut = $("#main-readout"),
        historyPane = $("#history");
        updateQueued = false,
        histCookie = readCookie("colour-history"),
        histList = histCookie?histCookie.split(","):[];
    colour = new ColourProxy(settings.get("current-colour", "hotpink"));
        
    mainReadOut.change(function () {
        try {
            colour.set(new Colour(mainReadOut.val()).alpha(null));
        }
        catch (e) {
            try {
                colour.set(new Colour("#" + mainReadOut.val()).alpha(null));
            }
            catch (e2) { /* can't interpret entry, so do nothing */ }
        }
    });
    
    colour.history(function(history) {
        $("<div/>")
            .addClass("colour-history-swatch ui-corner-all")
            .css({
                "background-color": history.slice(-1)[0].toString()
            })
            .prependTo(historyPane)
            .hide()
            .slideDown()
        historyPane.children(":gte("+histSize+")").remove();
    });
    
    colour.history(function(history, newColour) {
        createCookie("colour-history", $.map(history, function(colour){
            return colour.toString()}
        ).slice(-histSize).join(","), 365);
        updateUrl(newColour);
    });
    
    historyPane.delegate(".colour-history-swatch", "click", function (event) {
        colour.set(Colour($(event.target).css("background-color")));
    });

    // restore history    
    h = [];
    colour.historyList = $.map(histList, function(str){return Colour(str);});
    i = histList.length;
    while (i--) {
        h.push("<div class='colour-history-swatch ui-corner-all' style='background-color: ", histList[i],
               ";'/>");
    }
    historyPane.append(h.join(""));
    
    
    colour.change(function () {
        mainSwatch.css({
            "background-color": colour.toString(),
            color: colour.contrast()
        });
        mainReadOut.css({
            "border-color": colour.contrast().toString(),
            "background": colour.toString() + " none",
            "color": colour.contrast().toString()
        }).val(colour.toString());
        settings.set("current-colour", colour.toString());
    });
});
    
    
////////////////////////////////////////////////////////////////////////////////
// Sliders and swatches
$(function(){
    rSlider = $("#r-slider").colourComponentRGB({
        title: "Red",
        component: "red",
        getGradient: function (col) { return [col.red(0), col.red(255)]; },
        colourProxy: colour
    }).data("colourComponentRGB");
    
    // Sliders
    gSlider = $("#g-slider").colourComponentRGB({
        title: "Green",
        component: "green",
        getGradient: function (col) { return [col.green(0), col.green(255)]; },
        colourProxy: colour
    }).data("colourComponentRGB");

    bSlider = $("#b-slider").colourComponentRGB({
        title: "Blue",
        component: "blue",
        getGradient: function (col) { return [col.blue(0), col.blue(255)]; },
        colourProxy: colour
    }).data("colourComponentRGB");
    
    hSlider = $("#h-slider").colourComponentHSL({
        title: "Hue",
        component: "hue",
        getGradient: function (col) {
            return [col.hue(0), col.hue(1/6), col.hue(1/3), col.hue(1/2),
                    col.hue(2/3), col.hue(5/6), col.hue(0)];
        },
        colourProxy: colour
    }).data("colourComponentHSL");
    
    sSlider = $("#s-slider").colourComponentHSL({
        title: "Saturation",
        component: "saturation",
        getGradient: function (col) {
            return [col.saturation(0), col.saturation(1)];
        },
        colourProxy: colour
    }).data("colourComponentHSL");
    
    lSlider = $("#l-slider").colourComponentHSL({
        title: "Lightness",
        component: "lightness",
        getGradient: function (col) {
            return [col.lightness(0), col.lightness(0.5), col.lightness(1)];
        },
        colourProxy: colour
    }).data("colourComponentHSL");

    // Swatches
    variants = $("#swatch-variants").colourSwatchGroup({
        makeColours: function (colour) {
            return [colour, colour.invert(), colour.complement(), colour.desaturate()];
        },
        colourProxy: colour
    }).data("colourSwatch");

    analagous = $("#swatch-analagous").colourSwatchGroup({
        makeColours: function (colour) {
            return colour.analagous();
        },
        colourProxy: colour
    }).data("colourSwatchGroup");

    tetrad = $("#swatch-tetrad").colourSwatchGroup({
        makeColours: function (colour) {
            return colour.tetrad();
        },
        colourProxy: colour
    }).data("colourSwatchGroup");

    rectTerad = $("#swatch-rect-tetrad").colourSwatchGroup({
        makeColours: function (colour) {
            return colour.rectTetrad();
        },
        colourProxy: colour
    }).data("colourSwatchGroup");

    triad = $("#swatch-triad").colourSwatchGroup({
        makeColours: function (colour) {
            return colour.triad();
        },
        colourProxy: colour
    }).data("colourSwatchGroup");

    split = $("#swatch-split").colourSwatchGroup({
        makeColours: function (colour) {
            return colour.splitComplementary();
        },
        colourProxy: colour
    }).data("colourSwatchGroup");

    shades = $("#swatch-shades").colourSwatchGroup({
        makeColours: function (colour) {
            return [
                colour.darken(0.5),
                colour.darken(0.25),
                colour,
                colour.lighten(0.25),
                colour.lighten(0.5)
            ];
        },
        colourProxy: colour
    }).data("colourSwatchGroup");

    colour.change();
});


////////////////////////////////////////////////////////////////////////////////
// Accordion
$(function(){
    var resizeTimer,
        accordionSelection = settings.get("accordion");
        
    if (accordionSelection) {
        accordionSelection = $(accordionSelection).prev();
    }
    else {
        accordionSelection = 0;
    }

    $("#swatches").accordion({
        header: "> h3",
        autoHeight: false,
        fillSpace: true,
        active: accordionSelection,
        changestart: function (event, ui) {
            ui.newContent.colourSwatchGroup("update", colour, true);
            settings.set("accordion", "#" + ui.newContent.attr("id"));
        }
    });
    
    $(window).bind("resize", function (event) {
        if (resizeTimer) {clearTimeout(resizeTimer);}
        resizeTimer = setTimeout(function(){
            $("#swatches").accordion("resize");
            resizeTimer = null;
        }, 50);
    });
});


////////////////////////////////////////////////////////////////////////////////
// Palette
$(function(){

    var i,
        savedPalette = settings.get("palette"),
        urlPalette = getPaletteFromUrl(),
        paletteBag = $("#palette-bag");
    
    if (urlPalette && urlPalette.length > 0) {
        colour.set(urlPalette[0], true);
        i = urlPalette.length;
        while (i --> 1) {
            addToPalette(urlPalette[i], true);
        }
        savePalette();
    }
    else if (savedPalette) {
        savedPalette = savedPalette.split(",");
        i = savedPalette.length;
        while (i--) { addToPalette(new Colour(savedPalette[i]), true); }
    }
    
    function savePalette () {
        var list = [];
        $("#palette-bag .colour-swatch").each(function () {
            list.push($(this).colourSwatch("option", "colour").toString());
        });
        settings.set("palette", list.join(","));
        updateUrl(colour);
    }

    function refreshDeleteButton () {    
        if ($("#palette-bag .ui-selected").length === 0) {
            $("#delete-colour").button("disable");
        }
        else {
            $("#delete-colour").button("enable");
        }
    }
    
    function addToPalette (newColour, noSave) {
        $("<span/>")
            .colourSwatch({
                click: function (event, ui) {
                    colour.set(this.colour);
                    if (event.ctrlKey || event.shiftKey) {
                        ui.element.toggleClass("ui-selected");
                    }
                    else {
                        $("#palette-bag .ui-selected").removeClass("ui-selected");
                        ui.element.addClass("ui-selected");                        
                    }
                    refreshDeleteButton();
                }
            })
            .colourSwatch("update", newColour)
            .css("opacity", 0)
            .prependTo(paletteBag)
            .animate({"opacity": 1})
            ;
        if (!noSave) { savePalette(); }
    }
    
    $("#save-colour")
        .button({
            icons: {primary: 'ui-icon-disk'}    
        })
        .click(function(){
            addToPalette(colour.getColour());
        });
    $("#palette-bag")
        .sortable({
            forcePlaceholderSize: true,
            scroll: false,
            tolerance: "pointer",
            stop: savePalette            
        })
        .selectable({
            filter: ".colour-swatch",
            unselected: refreshDeleteButton,
            selected: refreshDeleteButton
            
        })
        ;
    $("#delete-colour")
        .button({
            disabled: true,
            icons: {primary: 'ui-icon-trash'}    
        })
        .click(function(){
            $("#palette-bag .ui-selected").remove();
            savePalette();
            refreshDeleteButton();
        });
        
});


////////////////////////////////////////////////////////////////////////////////
// Other toolbar button
$(function(){
    
    $("#disqus_thread").dialog({
        width: 600,
        height: 450,
        autoOpen: false,
        title: "Comment on The Colour Toy"
        //modal: true
    });
    $("#help-frame").dialog({
        width: 600,
        height: 450,
        autoOpen: false,
        title: "Colour Toy Help",
        //resizable: false,
        autoResize: true
    });
    
    $("#share-frame").dialog({
        width: 600,
        height: 130,
        autoOpen: false,
        title: "Save & share"
    });
    

    
    $("#save-button").button({
            icons: {primary: 'ui-icon-star'}    
    }).click(function(event){
        $("#share-frame").dialog("open");
    });
    
    
    $("#help-button").button({
        icons: {primary: 'ui-icon-info'}    
    })
    .click(function(event){
        $("#help-frame").attr("src", "http://docs.google.com/View?id=dc4kk99z_56c7zkfhdx")
        .dialog("open").width(590).height(440);
        //$("#help-frame").attr("src", "http://lumphammer.com/dl").dialog("open");
    });
});

////////////////////////////////////////////////////////////////////////////////
// Discussion
$(function () {
    global.disqus_developer = true;
    var disqusEnabled = false;
    
    $("#discuss-button").button({
        icons: {primary: 'ui-icon-person'}    
    })
    .click(function(event){
        if (!disqusEnabled) { enableDisqus(); }
        $("#disqus_thread").dialog("open");
    });
    
    function enableDisqus () {
        /**
          * var disqus_identifier; [Optional but recommended: Define a unique identifier (e.g. post id or slug) for this thread] 
          */
        
        var dsq = document.createElement('script');
        dsq.type = 'text/javascript';
        dsq.async = true;
        dsq.src = 'http://colourtoy.disqus.com/embed.js';
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
      
        disqusEnabled = true;
      
        /*  
        var links = document.getElementsByTagName('a');
        var query = '?';
        for(var i = 0; i < links.length; i++) {
        if(links[i].href.indexOf('#disqus_thread') >= 0) {
            query += 'url' + i + '=' + encodeURIComponent(links[i].href) + '&';
        }
        }
        document.write('<script charset="utf-8" type="text/javascript" src="http://disqus.com/forums/colourtoy/get_num_replies.js' + query + '"></' + 'script>');
        //*/
    }
});


////////////////////////////////////////////////////////////////////////////////
// IE6
/*
$(function(){
    if ($.browser.msie && $.browser.version < 7) {
        $("#ie6-warning").dialog({
            width: 600,
            title: "Very old browser detected"
            
        });
    }
});
//*/

function updateUrl (newColour) {
    var newUrl,
        currentUrl = window.location.toString(),
        baseUrl = currentUrl.replace(/#[^#]*$/, ""),
        frags = [newColour.toHexString().substring(1)],
        palette = settings.get("palette");
    if (palette !== null) {
        palette = palette.split(","); 
        $.each(palette, function(i, frag) {
            frags.push(frag.substring(1));
        });
    }
    newUrl = [baseUrl, "#", frags.join("-")].join("");
    $("#share-url").attr("value", newUrl);
    window.location = newUrl;    
}

function getPaletteFromUrl () {
    return $.map(
            window.location.toString().replace(/^[^#]+(#|$)/, "").split("-"),
            function (hex, i) {
                return hex.length? new Colour("#" + hex): null;
            }
        )
}

function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}


}(jQuery, this));



















