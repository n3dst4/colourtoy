(function ($) {
    
var updateSwatch, needUpdate = false;

$.widget("ui.colourSlider", {
    _create: function () {},
    update: function (colour) {}
});
$.ui.colourSlider.prototype.options = {
    // getGradient
};


$(function () {
    var opts = {
    };
    
    $("#r-slider").colourSlider({
        getGradient: function (colour) {
            return [colour.red(0), colour.red(255)];
        },
        getValue: function (colour) {
            return colour.red();
        }
    });
    
    $("#rgb-sliders .slider").slider($.extend({}, opts, {
        min: 0,
        max: 255,
        slide: updateRGB,
        stop: updateRGB
    }));
    $("#hsl-sliders .slider").slider($.extend({}, opts, {
        min: 0,
        max: 1,
        step: 0.01,
        slide: updateHSL,
        stop: updateHSL
    }));
    $("#input-r").spinner({min:0, max: 255});
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



















