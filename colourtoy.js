(function ($) {
    
var updateSwatch, needUpdate = false;

$.widget("ui.colourSlider", {
    _init: function () {
        var self = this;
        this.element.addClass("ui-colour-range");
        
        // Create slider
        this.sliderDiv = $("<span/>").addClass("ui-colour-slider").appendTo(this.element);
        this.slider = this.sliderDiv.slider({
            min: 0,
            max: this.options.scale,
            step: this.options.step,
            slide: function (event, ui) {
                self.options.update(ui.value);
            }
        }).data("slider");
        
        // Create canvas within slider
        this.canvas = $("<canvas/>").attr({
            width: 255,
            height: 10
        }).appendTo(this.sliderDiv);
        
        // Create input/spinner
        this.input = $("<input/>").css("width", 50);
        this.element.append(this.input);
        this.spinner = this.input.spinner({
            min: 0,
            max: this.options.scale,
            step: this.options.step,
            places: this.options.places,
            change: function () {
                debugger;
                self.options.update(self.input.val());
            }
        }).data("spinner");
        this.input.change(function () {
            self.spinner.selfUpdate = true;
            self.options.update(self.input.val());
            self.spinner.selfUpdate = false;
        });
    },
    update: function (colour) {
        var stops = this.options.getGradient(colour),
            value = this.options.getValue.call(this.options, colour);
        this.slider.value(value);
        //this.spinner.value(value);
        this.input.val(value.toFixed(this.options.places));
        //draw gradient
        this.ctx = this.ctx || this.canvas[0].getContext('2d');
        var grad = this.ctx.createLinearGradient(0,0,255,0);
        for (i=0; i < stops.length; i++) {
            grad.addColorStop(i * (1/(stops.length-1)), stops[i].toString());
        }
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0,0,255,20);
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
    places: 0,
    getValue: function (colour) { return colour[this["component"]](); }
    //format: function (num, places, element) {
    //    return num//Math.round(num);
    //}
};

$.widget("ui.colourSliderHSL", $.ui.colourSlider.prototype);
$.ui.colourSliderHSL.defaults = {
    scale: 1,
    step: 0.01,
    places: 2,
    getValue: function (colour) { return colour[this["component"]](); }
    //format: function (num, places, element) {
    //    return num//.toFixed(10);
    //}
};



$(function () {
    var rSlider, gSlider, bSlider, hSlider, sSlider, lSlider,
        mainSwatch = $("#main-swatch"),
        needUpdate = false,
        colour = Colour("#eb2704");
        
    function updateAll () {
        if ( ! needUpdate) {
            needUpdate = true;
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
                needUpdate = false;
            }, 0);
        }
    }
    
    rSlider = $("#r-slider").colourSliderRGB({
        component: "red",
        getGradient: function (col) { return [col.red(0), col.red(255)]; },
        update: function (value) {
            colour = colour.red(value);
            updateAll();
        }
    }).data("colourSliderRGB");
    
    gSlider = $("#g-slider").colourSliderRGB({
        component: "green",
        getGradient: function (col) { return [col.green(0), col.green(255)]; },
        update: function (value) {
            colour = colour.green(value);
            updateAll();
        }
    }).data("colourSliderRGB");
    
    bSlider = $("#b-slider").colourSliderRGB({
        component: "blue",
        getGradient: function (col) { return [col.blue(0), col.blue(255)]; },
        update: function (value) {
            colour = colour.blue(value);
            updateAll();
        }
    }).data("colourSliderRGB");
    
    hSlider = $("#h-slider").colourSliderHSL({
        component: "hue",
        getGradient: function (col) {
            return [col.hue(0),
                    col.hue(1/6),
                    col.hue(1/3),
                    col.hue(1/2),
                    col.hue(2/3),
                    col.hue(5/6),
                    col.hue(0)
                    ];
        },
        update: function (value) {
            colour = colour.hue(value);
            updateAll();
        }
    }).data("colourSliderHSL");
    
    sSlider = $("#s-slider").colourSliderHSL({
        component: "saturation",
        getGradient: function (col) {
            return [col.saturation(0), col.saturation(1)];
        },
        update: function (value) {
            colour = colour.saturation(value);
            updateAll();
        }
    }).data("colourSliderHSL");
    
    lSlider = $("#l-slider").colourSliderHSL({
        component: "lightness",
        getGradient: function (col) {
            return [col.lightness(0), col.lightness(0.5), col.lightness(1)];
        },
        update: function (value) {
            colour = colour.lightness(value);
            updateAll();
        }
    }).data("colourSliderHSL");
    
    setTimeout(updateAll, 0);
});    



}(jQuery));



















