(function ($) {
    
var updateSwatch;

$(function () {
    var opts = {
    };
    
    $("#rgb-sliders .slider").slider($.extend({}, opts, {
        min: 0,
        max: 255,
        range: "min",
        slide: updateRGB,
        stop: updateRGB
    }));
    $("#hsl-sliders .slider").slider($.extend({}, opts, {
        min: 0,
        max: 1,
        step: 0.01,
        range: "min",
        slide: updateHSL,
        stop: updateHSL
    }));
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
    var c = new Colour({h: 0, s:0, l: l});
    // hue
    $("#h-full-spectrum-shading").css({
        "background-color": c.toString(),
        opacity: Math.max(1 - s, Math.abs(0.5 - l) * 2)
    });
    // saturation
    $("#s-base-colour").css("background-color", new Colour({h: h, s: 1, l: 0.5}).toString());
    $("#s-shading").css({
        "background-color": (l < 0.5)?"#000":"#fff",
        opacity: Math.abs(0.5 - l) * 2
    });
    //lightness
    $("#l-base-colour").css("background-color", new Colour({h: h, s: s, l: 0.5}).toString());    
};


//        h = $("#h-slider").slider("value"),
//        s = $("#s-slider").slider("value"),
//        l = $("#l-slider").slider("value");


}(jQuery));



















