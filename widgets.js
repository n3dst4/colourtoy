

(function ($) {

var maxTries = 8,
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
                self.options.colourProxy.set(
                    self.options.colourProxy[self.options.component](
                        self.input.spinner("value")
                   ), ui.spinning
                );
            },
            stop: function (event, ui) {
                self.options.colourProxy.set(
                    self.options.colourProxy[self.options.component](
                        self.input.spinner("value")
                   )
                );
            }
        });
        //*/
        ;
        
        // Create titles
        this.leftHeader = $("<h4/>")
        .addClass("slider-label")
        .html(this.options.title)
        .appendTo(this.sliderDiv);
        
        this.rightHeader = $("<div/>")
        .addClass("slider-label").addClass("slider-label-secondary")
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
            this.ctx.fillRect(0,0,256,20);
            var leftHeaderColour = stops[0].contrast().toString();
            var rightHeaderColour = stops.slice(-1)[0].contrast().toString();
            this.leftHeader.css("color", leftHeaderColour);
            this.rightHeader.css("color", rightHeaderColour);        
        }
        else {
            this.queuedUpdate = colour;
        }
        this.input.spinner("value", value, true);
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
        this.swatch = $("<div/>")
            .addClass("colour-swatch-inner ui-corner-all")
            .appendTo(this.element);
        this.readout = $("<span class='colour-swatch-readout'/>")
            .click (function(){return false;})
            .appendTo(this.element);

        if (this.options.colourProxy) {
            this.options.colourProxy.change(function (colour) {
                self.update(colour);
            });
        }
        this.element.click(function (event) {
            self.options.click.call(self.options, event,
                    {element: self.element, swatch: self.swatch});
        });
        //this.update(this.options.colour);
    },
    update: function (colour) {
        this.options.colour = this.options.makeColour(colour);
        this.swatch.css({
            "background-color": this.options.colour.toString()
            //"color": this.options.colour.contrast().toString()
        });
        this.readout.html(this.options.colour.toString());
    }
});
$.ui.colourSwatch.prototype.options = {
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



}(jQuery));