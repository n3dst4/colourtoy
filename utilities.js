

(function (global) {

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
    toString: function () {
        return this.colour.toString();
    }
};



/*
 * Settings holder
 */
function Settings (cookieName, days) {
    this._cookieName = cookieName = cookieName || "settings";
    this._days = days || 100
    try {
        this._settings = JSON.parse(this._readCookie());
    }
    catch (e) {}
    this._settings = this._settings || {};
}
Settings.prototype = {
    get: function (key, defaultValue) {
        return this._settings[key] || defaultValue || null;
    },
    set: function (key, value) {
        this._settings[key] = value;
        this._createCookie(JSON.stringify(this._settings), 365);
    },
    destroy: function () {
        this._eraseCookie();
        this._settings = {};
    },
    _createCookie: function (value) {
        var date = new Date();
        date.setTime(date.getTime() + (this._days * 24 * 60 * 60 * 1000));
        var expires = "; expires="+date.toGMTString();
        document.cookie = this._cookieName+"="+value+expires+"; path=/";
    },
    _readCookie: function (name) {
        var nameEQ = this._cookieName + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') { c = c.substring(1, c.length); }
            if (c.indexOf(nameEQ) == 0) {
                return c.substring(nameEQ.length, c.length);
            }
        }
        return null;
    },
    _eraseCookie: function () {
        createCookie(this._cookieName,"",-1);
    }
};

global.ColourProxy = ColourProxy;
global.Settings = Settings;


}(this));