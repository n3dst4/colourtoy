(function ($, global) {
    
var updateSwatch, needUpdate = false,
    console = global.console || {log: function(){}},
    maxTries = 8,
    tryDelayFactor = 50;


/*
 * $.ui.colourSlider
 * UI widget which has a gradiented slider and a spinner for updating a colour
 * component
 */
$.widget("ui.colourSlider", {
    
    _init: function () {
        var self = this;
        this.element.addClass("colour-component");
        self.queuedUpdate = null; // used when loading excanvas late
        // Create slider
        this.sliderDiv = $("<span/>").addClass("colour-component-slider").appendTo(this.element);
        this.slider = this.sliderDiv.slider({
            min: 0,
            max: this.options.scale,
            step: this.options.step,
            slide: function (event, ui) {
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
        this.sliderDiv.find(".ui-slider-handle")
            .append("<img src='thumb.png' class='colour-component-grippy'>");
        
        // Create input/spinner
        this.input = $("<input/>")
        .css({
            "width": 42,
            "margin-left": "3px",
            "font-size": "small",
            "height": "16px",
            padding: "1px"
        })
        .appendTo(this.element)
        .spinner({
            min: 0,
            max: this.options.scale,
            step: this.options.step,
            places: this.options.places
            
        })
        .bind("change", function () {
            self.options.colourProxy.set(self.options.colourProxy[self.options.component](self.input.val()));
        });
        
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
        this.input.val(value.toFixed(this.options.places));
        this.slider.value(value);
        if (this.ctx) {
            stops = this.options.getGradient(colour);
            var grad = this.ctx.createLinearGradient(0,0,255,0);
            for (i=0; i < stops.length; i++) {
                grad.addColorStop(i * (1/(stops.length-1)), stops[i].toString());
            }
            this.ctx.fillStyle = grad;
            this.ctx.fillRect(0,0,255,20);
        }
        else {
            this.queuedUpdate = colour;
        }
    }
});
$.ui.colourSlider.defaults = {
    scale: 255,
    step: 1,
    places: 0
};


$.widget("ui.colourSliderRGB", $.ui.colourSlider.prototype);
$.ui.colourSliderRGB.defaults = {
    scale: 255,
    step: 1,
    places: 0
};


$.widget("ui.colourSliderHSL", $.ui.colourSlider.prototype);
$.ui.colourSliderHSL.defaults = {
    scale: 1,
    step: 0.01,
    places: 2
};



/*
 * Mutable proxy for Colour objects
 */
function ColourProxy (colour) {
    var f, self = this;
    this.colour = new Colour(colour || "#000");
    this.updateQueued = false;
    this.changeCallbacks = [];
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
    set: function (colour) {
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
    toString: function () {
        return this.colour.toString();
    }
};



/*
 * onLoad
 */
$(function () {
    var rSlider, gSlider, bSlider, hSlider, sSlider, lSlider,
        mainSwatch = $("#main-swatch"),
        mainReadOut = $("#main-readout"),
        updateQueued = false,
        colour = new ColourProxy("#eb2704");
        
    mainReadOut.change(function () {
        try {
            colour = new Colour(mainReadOut.val()).alpha(null);
            queueUpdate();
        }
        catch (e) {
            try {
                colour = new Colour("#" + mainReadOut.val()).alpha(null);
                queueUpdate();
            }
            catch (e2) {
                // pass
            }
        }
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
    
    rSlider = $("#r-slider").colourSliderRGB({
        component: "red",
        getGradient: function (col) { return [col.red(0), col.red(255)]; },
        colourProxy: colour
    }).data("colourSliderRGB");
    
    gSlider = $("#g-slider").colourSliderRGB({
        component: "green",
        getGradient: function (col) { return [col.green(0), col.green(255)]; },
        colourProxy: colour
    }).data("colourSliderRGB");
    
    bSlider = $("#b-slider").colourSliderRGB({
        component: "blue",
        getGradient: function (col) { return [col.blue(0), col.blue(255)]; },
        colourProxy: colour
    }).data("colourSliderRGB");
    
    hSlider = $("#h-slider").colourSliderHSL({
        component: "hue",
        getGradient: function (col) {
            return [col.hue(0), col.hue(1/6), col.hue(1/3), col.hue(1/2),
                    col.hue(2/3), col.hue(5/6), col.hue(0)];
        },
        colourProxy: colour
    }).data("colourSliderHSL");
    
    sSlider = $("#s-slider").colourSliderHSL({
        component: "saturation",
        getGradient: function (col) {
            return [col.saturation(0), col.saturation(1)];
        },
        colourProxy: colour
    }).data("colourSliderHSL");
    
    lSlider = $("#l-slider").colourSliderHSL({
        component: "lightness",
        getGradient: function (col) {
            return [col.lightness(0), col.lightness(0.5), col.lightness(1)];
        },
        colourProxy: colour
    }).data("colourSliderHSL");
    
    colour.change();
});    



}(jQuery, this));



















