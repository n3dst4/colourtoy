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
        var tries = 0, self = this;
        this.element.addClass("ui-colour-range");
        self.queuedUpdate = null; // used when loading excanvas late
        // Create slider
        this.sliderDiv = $("<span/>").addClass("ui-colour-slider").appendTo(this.element);
        this.slider = this.sliderDiv.slider({
            min: 0,
            max: this.options.scale,
            step: this.options.step,
            slide: function (event, ui) { self.options.update(ui.value); }
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
            .append("<img src='thumb.png' class='colour-slider-grippy'>");
        
        // Create input/spinner
        this.input = $("<input/>")
        .css("width", 50)
        .appendTo(this.element)
        .spinner({
            min: 0,
            max: this.options.scale,
            step: this.options.step,
            places: this.options.places
            
        })
        .bind("change", function () {
            self.options.update(self.input.val());
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
 * onLoad
 */
$(function () {
    var rSlider, gSlider, bSlider, hSlider, sSlider, lSlider,
        mainSwatch = $("#main-swatch"),
        updateQueued = false,
        colour = Colour("#eb2704");
        
    function queueUpdate () {
        if ( ! updateQueued ) {
            setTimeout(function () {
                mainSwatch.css({
                    "background-color": colour.toString(),
                    color: colour.contrast()
                }).html(colour.toString());
                rSlider.update(colour);
                gSlider.update(colour);
                bSlider.update(colour);
                hSlider.update(colour);
                sSlider.update(colour);
                lSlider.update(colour);
                updateQueued = false;
            }, 0);
            updateQueued = true;
        }
    }
    
    rSlider = $("#r-slider").colourSliderRGB({
        component: "red",
        getGradient: function (col) { return [col.red(0), col.red(255)]; },
        update: function (value) {
            colour = colour.red(value);
            queueUpdate();
        }
    }).data("colourSliderRGB");
    
    gSlider = $("#g-slider").colourSliderRGB({
        component: "green",
        getGradient: function (col) { return [col.green(0), col.green(255)]; },
        update: function (value) {
            colour = colour.green(value);
            queueUpdate();
        }
    }).data("colourSliderRGB");
    
    bSlider = $("#b-slider").colourSliderRGB({
        component: "blue",
        getGradient: function (col) { return [col.blue(0), col.blue(255)]; },
        update: function (value) {
            colour = colour.blue(value);
            queueUpdate();
        }
    }).data("colourSliderRGB");
    
    hSlider = $("#h-slider").colourSliderHSL({
        component: "hue",
        getGradient: function (col) {
            return [col.hue(0), col.hue(1/6), col.hue(1/3), col.hue(1/2),
                    col.hue(2/3), col.hue(5/6), col.hue(0)];
        },
        update: function (value) {
            colour = colour.hue(value);
            queueUpdate();
        }
    }).data("colourSliderHSL");
    
    sSlider = $("#s-slider").colourSliderHSL({
        component: "saturation",
        getGradient: function (col) {
            return [col.saturation(0), col.saturation(1)];
        },
        update: function (value) {
            colour = colour.saturation(value);
            queueUpdate();
        }
    }).data("colourSliderHSL");
    
    lSlider = $("#l-slider").colourSliderHSL({
        component: "lightness",
        getGradient: function (col) {
            return [col.lightness(0), col.lightness(0.5), col.lightness(1)];
        },
        update: function (value) {
            colour = colour.lightness(value);
            queueUpdate();
        }
    }).data("colourSliderHSL");
    
    queueUpdate();
});    



}(jQuery, this));



















