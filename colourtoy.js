(function ($, global) {
    
var updateSwatch, needUpdate = false,
    console = global.console || {log: function(){}},
    maxTries = 8,
    tryDelayFactor = 50;


/*
 * $.ui.colourComponent
 * UI widget which has a gradiented slider and a spinner for updating a colour
 * component
 */
$.widget("ui.colourComponent", {
    _create: function () {
        var self = this;
        this.element.addClass("colour-component");
        self.queuedUpdate = null; // used when loading excanvas late
        // Create slider
        this.sliderDiv = $("<span/>")
            .addClass("colour-component-slider")
            .appendTo(this.element);
        this.slider = this.sliderDiv.slider({
            min: 0,
            max: this.options.scale,
            step: this.options.step,
            slide: function (event, ui) {
                self.options.colourProxy.set(
                    self.options.colourProxy[self.options.component](ui.value), true);
            },
            stop: function (event, ui) {
                self.options.colourProxy.set(
                    self.options.colourProxy[self.options.component](ui.value));
            }
        }).data("slider");
        
        // Create canvas within slider
        this.canvas = $("<canvas/>")
        .addClass('ui-corner-all')
        .attr({
            width: 255,
            height: 20
        })
        .appendTo(this.sliderDiv);
        this._acquireCtx();
        this.handle = this.sliderDiv.find(".ui-slider-handle")
            .append("<img src='thumb.png' class='colour-component-grippy'>");
        
        // Create input/spinner
        this.input = $("<input/>")
        .appendTo(this.element);
        //*
        this.input.spinner({
            min: 0,
            max: this.options.scale,
            step: this.options.step,
            precision: this.options.places,
            change: function (event, ui) {
                //console.log("changed " + ui.spinning);
                self.options.colourProxy.set(
                    self.options.colourProxy[self.options.component](
                        self.input.spinner("value")
                   ), ui.spinning
                );
            },
            stop: function (event, ui) {
                //console.log("stopped");
                self.options.colourProxy.set(
                    self.options.colourProxy[self.options.component](
                        self.input.spinner("value")
                   )
                );
            }
        });
        //*/
        /*
        this.input.bind("change", function () {
            //debugger;
            console.log("spinner change " + self.input.data("spinner").selfChange);
            //if (self.input.data("spinner").selfChange) return;
            self.options.colourProxy.set(
                self.options.colourProxy[self.options.component](
                    self.input.val()
               )
            );
        });
        //*/
        ;
        
        // Create titles
        this.leftHeader = $("<h4/>")
        .addClass("slider-label")
        .html(this.options.title)
        .appendTo(this.sliderDiv);
        
        this.rightHeader = $("<div/>")
        .addClass("slider-label").addClass("slider-label-spare")
        .html(this.options.title)
        .appendTo(this.sliderDiv)
        .hide();
        
        this.shownHeader = "left";
        
        // register with colour proxy
        this.options.colourProxy.change(function (colour) {
            self.update(colour);
        });
    },
    
    _acquireCtx: function () {
        var self = this, tries = 0;
        function getCtx () {
            try {
                self.ctx = self.canvas[0].getContext('2d');
                if (self.queuedUpdate) { (self.update(self.queuedUpdate)); }
            }
            catch (e) {
                if (tries < maxTries) {
                    if (typeof(G_vmlCanvasManager) != "undefined") {
                        G_vmlCanvasManager.initElement(self.canvas.get(0));
                    }
                    setTimeout(getCtx, (Math.pow(2, tries) - 1) * tryDelayFactor);
                    tries++;
                }
            }
        }
        getCtx();        
    },
    
    update: function (colour) {
        var stops, value = colour[this.options.component]();
        this.slider.value(value);
        if (this.ctx) {
            stops = this.options.getGradient(colour);
            var grad = this.ctx.createLinearGradient(0,0,255,0);
            for (i=0; i < stops.length; i++) {
                try {
                    grad.addColorStop(i * (1/(stops.length-1)), stops[i].toString());
                } catch (e) {
                    return; // can't do anything - bail
                }
            }
            this.ctx.fillStyle = grad;
            this.ctx.fillRect(0,0,255,20);
        }
        else {
            this.queuedUpdate = colour;
        }
        this.input.spinner("value", value, true);
        var leftHeaderColour = stops[0].contrast().toString();
        var rightHeaderColour = stops.slice(-1)[0].contrast().toString();
        
        var handlePos = this.handle.position().left;
        
        if (handlePos > 120 && this.shownHeader == "right") {
            this.rightHeader.stop(false, true).hide();
            this.leftHeader.stop(false, true).show();
            this.shownHeader = "left";
        }
        if (handlePos < 120 && this.shownHeader == "left") {
            this.rightHeader.stop(false, true).show();
            this.leftHeader.stop(false, true).hide();
            this.shownHeader = "right";
        }
        
        this.leftHeader.css("color", leftHeaderColour);
        this.rightHeader.css("color", rightHeaderColour);
    }
});
$.ui.colourComponent.prototype.options = {
    scale: 255,
    step: 1,
    places: 0
};


$.widget("ui.colourComponentRGB", $.ui.colourComponent.prototype);
$.ui.colourComponentRGB.prototype.options = {
    scale: 255,
    step: 1,
    places: 0
};


$.widget("ui.colourComponentHSL", $.ui.colourComponent.prototype);
$.ui.colourComponentHSL.prototype.options = {
    scale: 1,
    step: 0.01,
    places: 2
};


/*
 * $.ui.colourSwatch
 * UI widget for displaying a swatch based on a master colour
 */
$.widget("ui.colourSwatch", {
    _create: function () {
        var self = this;
        this.element.addClass("colour-swatch ui-corner-all");
        this.readout = $("<span class='colour-swatch-readout'/>")
            .click (function(){return false;})
            .appendTo(this.element);
        this.title = $("<h3 class='colour-swatch-title ui-corner-top'/>")
            .html(this.options.title)
            .appendTo(this.element);

        if (this.options.colourProxy) {
            this.options.colourProxy.change(function (colour) {
                self.update(colour);
            });
        }
        this.element.click(function (event) {
            self.options.click();
        });
    },
    update: function (colour) {
        this.options.colour = this.options.makeColour(colour);
        this.element.css({
            "background-color": this.options.colour.toString()
            //"color": this.options.colour.contrast().toString()
        });
        this.readout.html(this.options.colour.toString());
    }
});
$.ui.colourSwatch.prototype.options = {
    title: "",
    colour: new Colour("black"),
    makeColour: function (colour) { return colour; },
    click: function () {
        if (this.colourProxy) {this.colourProxy.set(this.colour);}
    }
};


$.widget("ui.colourSwatchGroup", {
    _create: function () {
        var self = this;
        this.swatches = [];
        $("<h2/>").html(this.options.title).appendTo(this.element);
        this.options.colourProxy.change(function (colour) {
            self.update(colour);
        });
        this.element.addClass("colour-swatch-group");

    },
    update: function (colour, force) {
        var self = this;
        if ( ! (force || this.element.is(":visible"))) { return; }
        this.colours = this.options.makeColours(colour);
        while (this.swatches.length < this.colours.length) {
            this.swatches.push(
                $("<span/>")
                    .colourSwatch({click: function () {self.options.colourProxy.set(this.colour);}})
                    .appendTo(self.element)
                    .data("colourSwatch")
            );
        }
        while (this.swatches.length > this.colours.length) {
            this.swatches.pop().element.remove();
        }
        $.each(this.swatches, function (i, swatch) {
            swatch.update(self.colours[i]);
        });
    }
});
$.ui.colourSwatchGroup.prototype.options = {
    title: ""
};




/*
 * Mutable proxy for Colour objects
 */
function ColourProxy (colour) {
    var f, self = this;
    this.colour = new Colour(colour || "#000");
    this.updateQueued = false;
    this.changeCallbacks = [];
    this.historyCallbacks = [];
    this.historyList = [];
    for (f in Colour.prototype) {
        if (Object.prototype.toString.call(Colour.prototype[f]) === "[object Function]") {
            (function (f) {
                self[f] = function () {
                    var c = self.colour[f].apply(self.colour, arguments);
                    return c;
                };
            }(f));
        }
    }
}
ColourProxy.prototype = {
    set: function (colour, noHistory) {
        var self = this;
        // history
        if (noHistory) {
            if ( ! self.histColour) { self.histColour = self.colour; }
        }
        else {
            self.historyList.push(self.histColour || self.colour);
            self.histColour = null;
            self._history();
        }
        // update
        this.colour = colour;
        this._change();
    },
    getColour: function () {
        return this.colour;
    },
    change: function (f) {
        if (f) this.changeCallbacks.push(f);
        else this._change();
    },
    _change: function () {
        var i, self = this;
        if ( ! this.updateQueued) {
            setTimeout(function () {
                self.updateQueued = false;
                for (i=0; i < self.changeCallbacks.length; i++) {
                    self.changeCallbacks[i].call(self.colour, self.colour);
                }
            }, 0);
            this.updateQueued = true;
        }        
    },
    history: function (f) {
        if (f) this.historyCallbacks.push(f);
        else this._history();
    },
    _history: function () {
        var i, self = this;
        for (i=0; i < self.historyCallbacks.length; i++) {
            self.historyCallbacks[i].call(self.historyList, self.historyList);
        }
    },
    undo: function () {
        
    },
    toString: function () {
        return this.colour.toString();
    }
};



/*
 * onLoad
 */
$(function () {
    var themeButtons = $("[name=theme]");
    $("#select-dark").attr("checked", "checked");
    $("#theme-select").buttonset({text: true});
    function selectTheme (event) {
        $("link[class*=theme]").each(function () {
            var el = $(this);
            if (el.attr("class") == event.target.value) {
                el.attr("media", "screen");
            }
            else {
                el.attr("media", "none");
            }
            console.log(event.target.value);
        });
    }
    themeButtons.change(selectTheme);
});


$(function () {
    var rSlider, gSlider, bSlider, hSlider, sSlider, lSlider, invert,
        mainSwatch = $("#main-swatch"),
        mainReadOut = $("#main-readout"),
        historyPane = $("#history");
        updateQueued = false,
        colour = new ColourProxy("hotpink");
        
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
        //debugger;
        //historyPane.animate({"background-color": "#ff0"}, "fast").animate({"background-color": "#000"}, "fast");
        historyPane.append($("<p/>").html(
            "X"//$.map(history, function (c) { return c.toString(); }).join(", ")
        ));
    });
        
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
    });
    
    rSlider = $("#r-slider").colourComponentRGB({
        title: "Red",
        component: "red",
        getGradient: function (col) { return [col.red(0), col.red(255)]; },
        colourProxy: colour
    }).data("colourComponentRGB");
    
    
    gSlider = $("#g-slider").colourComponentRGB({
        title: "Green",
        component: "green",
        getGradient: function (col) { return [col.green(0), col.green(255)]; },
        colourProxy: colour
    }).data("colourComponentRGB");
    //* 
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
    //*/
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

    $("#swatches").accordion({
        header: "> h3",
        autoHeight: false,
        fillSpace: true,
        changestart: function (event, ui) {
            ui.newContent.colourSwatchGroup("update", colour, true);
        }
    });
    
    console.log("about to fire first global boot change");
    colour.change();
});    



}(jQuery, this));



















