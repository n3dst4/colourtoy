(function ($) {
    
var updateSwatch, needUpdate = false;

$.widget("ui.colourSlider", {
    _init: function () {
        var self = this,
            updateFromSlider = function () {
                self.options.update(self.slider.value());
            },
            updateFromInput = function () {
                self.options.update(self.input.val());
            };
        
        this.element.addClass("ui-colour-range");
        this.sliderDiv = $("<span/>").addClass("ui-colour-slider").appendTo(this.element);
        this.slider = this.sliderDiv.slider({
            min: 0,
            max: this.options.scale,
            step: this.options.step,
            slide: updateFromSlider,
            change:  updateFromSlider
        }).data("slider");
        
        this.canvas = $("<canvas/>").attr({
            width: 400,
            height: 10
        }).appendTo(this.sliderDiv);
        
        this.input = $("<input/>").attr("size", 4);
        this.element.append(this.input);
        this.input.spinner({
            min: 0,
            max: this.options.scale,
            step: this.options.step
        });
        this.input.change(updateFromInput);
    },
    update: function (colour) {
        var stops = this.options.getGradient(colour);
        this.slider.value(this.options.getValue(colour));
        this.input.val(this.options.getValue(colour));
        //draw gradient
        this.ctx = this.ctx || this.canvas[0].getContext('2d');
        var grad = this.ctx.createLinearGradient(0,0,400,0);
        for (i=0; i < stops.length; i++) {
            if (stops[i].toString().length > 7) debugger;
            grad.addColorStop(i * (1/(stops.length-1)), stops[i].toString());
        }
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0,0,400,20);

    }
});
$.ui.colourSlider.defaults = {
    scale: 255,
    step: 1
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
                needUpdate = false;
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
            }, 0);
        }
    }
    
    rSlider = $("#r-slider").colourSlider({
        scale: 255,
        step: 1,
        getGradient: function (col) { return [col.red(0), col.red(255)]; },
        getValue: function (colour) { return colour.red(); },
        update: function (value) {
            colour = colour.red(value);
            updateAll();
        }
    }).data("colourSlider");
    
    gSlider = $("#g-slider").colourSlider({
        scale: 255,
        step: 1,
        getGradient: function (col) { return [col.green(0), col.green(255)]; },
        getValue: function (colour) { return colour.green(); },
        update: function (value) {
            colour = colour.green(value);
            updateAll();
        }
    }).data("colourSlider");
    
    bSlider = $("#b-slider").colourSlider({
        scale: 255,
        step: 1,
        getGradient: function (col) { return [col.blue(0), col.blue(255)]; },
        getValue: function (colour) { return colour.blue(); },
        update: function (value) {
            colour = colour.blue(value);
            updateAll();
        }
    }).data("colourSlider");
    
    hSlider = $("#h-slider").colourSlider({
        scale: 1,
        step: 0.01,
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
        getValue: function (colour) { return colour.hue(); },
        update: function (value) {
            colour = colour.hue(value);
            updateAll();
        }
    }).data("colourSlider");
    
    sSlider = $("#s-slider").colourSlider({
        scale: 1,
        step: 0.01,
        getGradient: function (col) {
            return [col.saturation(0), col.saturation(1)];
        },
        getValue: function (colour) { return colour.saturation(); },
        update: function (value) {
            colour = colour.saturation(value);
            updateAll();
        }
    }).data("colourSlider");
    
    lSlider = $("#l-slider").colourSlider({
        scale: 1,
        step: 0.01,
        getGradient: function (col) {
            return [col.lightness(0), col.lightness(0.5), col.lightness(1)];
        },
        getValue: function (colour) { return colour.lightness(); },
        update: function (value) {
            colour = colour.lightness(value);
            updateAll();
        }
    }).data("colourSlider");
    
    updateAll();

    
});    



}(jQuery));



















