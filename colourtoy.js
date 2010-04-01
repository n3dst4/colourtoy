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
            stop:  updateFromSlider
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
        this.slider.value(this.options.getValue(colour));
        this.input.val(this.options.getValue(colour));
        //draw gradient
        var stops = this.options.getGradient(colour);
        var ctx = this.canvas[0].getContext('2d');
        var grad = ctx.createLinearGradient(0,0,400,0);
        for (i=0; i < stops.length; i++) {
            if (stops[i].toString().length > 7) debugger;
            grad.addColorStop(i * (1/(stops.length-1)), stops[i].toString());
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0,0,400,20);

    }
});
$.ui.colourSlider.defaults = {
    scale: 255,
    step: 1
};


$(function () {
    var colour = Colour("#eb2704"),
        updateAll = function () {
            $("#main-swatch").css({
                "background-color": colour.toString(),
                color: colour.contrast()
            }).html(colour.toString());
            $("#r-slider").colourSlider("update", colour);
            $("#g-slider").colourSlider("update", colour);
            $("#b-slider").colourSlider("update", colour);
            $("#h-slider").colourSlider("update", colour);
            $("#s-slider").colourSlider("update", colour);
            $("#l-slider").colourSlider("update", colour);
        };
    
    $("#r-slider").colourSlider({
        scale: 255,
        step: 1,
        getGradient: function (col) { return [col.red(0), col.red(255)]; },
        getValue: function (colour) { return colour.red(); },
        update: function (value) {
            colour = colour.red(value);
            updateAll();
        }
    });
    
    $("#g-slider").colourSlider({
        scale: 255,
        step: 1,
        getGradient: function (col) { return [col.green(0), col.green(255)]; },
        getValue: function (colour) { return colour.green(); },
        update: function (value) {
            colour = colour.green(value);
            updateAll();
        }
    });
    
    $("#b-slider").colourSlider({
        scale: 255,
        step: 1,
        getGradient: function (col) { return [col.blue(0), col.blue(255)]; },
        getValue: function (colour) { return colour.blue(); },
        update: function (value) {
            colour = colour.blue(value);
            updateAll();
        }
    });
    
    $("#h-slider").colourSlider({
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
    });
    
    $("#s-slider").colourSlider({
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
    });
    
    $("#l-slider").colourSlider({
        scale: 1,
        step: 0.01,
        getGradient: function (col) {
            return [col.lightness(0), col.lightness(1)];
        },
        getValue: function (colour) { return colour.lightness(); },
        update: function (value) {
            colour = colour.lightness(value);
            updateAll();
        }
    });
    
    updateAll();

    
});    


updateRGB = function (event) {
    var r = $("#r-slider").slider("value"),
        g = $("#g-slider").slider("value"),
        b = $("#b-slider").slider("value"),
        c = new Colour({r: r, g: g, b: b});
    $("#main-swatch").css("background", c.toString());
    $("#h-slider").slider("value", c.h);
    $("#s-slider").slider("value", c.s);
    $("#l-slider").slider("value", c.l);
    updateColourRanges(c.h, c.s, c.l);
};

updateHSL = function (event) {
    var h = $("#h-slider").slider("value"),
        s = $("#s-slider").slider("value"),
        l = $("#l-slider").slider("value"),
        c = new Colour({h: h, s: s, l: l}),
        rgb = Colour.hslToRGB(c);
    $("#main-swatch").css("background", c.toString());
    $("#r-slider").slider("value", rgb.r);
    $("#g-slider").slider("value", rgb.g);
    $("#b-slider").slider("value", rgb.b);
    updateColourRanges(h, s, l);
};

updateColourRanges = function (h, s, l) {
    var i, ctx, grad, c = new Colour({h: 0, s:0, l: l});
    needUpdate = true;
    setTimeout(function () {
        if ( ! needUpdate) return;
        // hue
        ctx = document.getElementById('colour-range-h').getContext('2d');
        grad = ctx.createLinearGradient(0,0,400,0);
        for (i=0; i < 7; i++) {
            grad.addColorStop(i * (1/6), new Colour({h: i * (1/6), s:s, l:l}).toString());
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0,0,400,20);
        // saturation
        ctx = document.getElementById('colour-range-s').getContext('2d');
        grad = ctx.createLinearGradient(0,0,400,0);
        grad.addColorStop(0, new Colour({h: h, s:0, l:l}).toString());
        grad.addColorStop(1, new Colour({h: h, s:1, l:l}).toString());
        ctx.fillStyle = grad;
        ctx.fillRect(0,0,400,20);
        //lightness
        ctx = document.getElementById('colour-range-l').getContext('2d');
        grad = ctx.createLinearGradient(0,0,400,0);
        grad.addColorStop(0, '#000');
        grad.addColorStop(0.5, new Colour({h: h, s: s, l: 0.5}).toString());
        grad.addColorStop(1, '#fff');
        ctx.fillStyle = grad;
        ctx.fillRect(0,0,400,20);
        // red
        var components = ["r", "g", "b"];
        var rgb = Colour.hslToRGB({h:h, s:s, l:l});
        for (i=0; i < 3; i++) {
            component = components[i];
            ctx = document.getElementById('colour-range-' + component).getContext('2d');
            grad = ctx.createLinearGradient(0,0,400,0);
            rgb2 = $.extend({}, rgb);
            rgb2[component] = 0;
            grad.addColorStop(0, new Colour(rgb2).toString());
            rgb2[component] = 255;
            grad.addColorStop(1, new Colour(rgb2).toString());
            ctx.fillStyle = grad;
            ctx.fillRect(0,0,400,20);        
        }
        needUpdate = false;
    }, 0);
};


//        h = $("#h-slider").slider("value"),
//        s = $("#s-slider").slider("value"),
//        l = $("#l-slider").slider("value");


}(jQuery));



















