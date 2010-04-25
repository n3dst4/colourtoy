/*
 * jQuery UI Spinner @VERSION
 *
 * Copyright (c) 2009 AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Spinner
 *
 * Depends:
 *  ui.core.js
 */
(function($) {

// shortcut constants
var hover = 'ui-state-hover',
	active = 'ui-state-active',
	namespace = '.spinner',
	buttonDefault = 'show',
	uiSpinnerClasses = 'ui-spinner ui-widget ui-corner-all ';

$.widget('ui.spinner', {
	_create: function() {		
		this.currVal = 0;
		this._draw();
		this._mousewheel();
		if (this.options.showButtons !== "always") {
			this.buttons.hide();
		}
		this._aria();
	},
	_draw: function() {
		var self = this,
			o = self.options,
			outerWidth = self.element.outerWidth(),
			inputWidth = self.element.width() - o.buttonWidth,
			marginLeft = self.element.css("margin-left"),
			marginRight = self.element.css("margin-right");

		
		var uiSpinner = self.element
			.addClass('ui-spinner-input')
			.attr('autocomplete', 'off') // switch off autocomplete in opera
			.wrap(self._uiSpinnerHtml())
			.css({
				"margin-left": "0px",
				"margin-right": "0px",
				"width": inputWidth
			})
			.bind('keydown'+namespace, function(event) {
				return self._keyDown(event);
			})
			.bind('keyup'+namespace, function(event) {
				return self._keyUp(event);
			})
			.bind('blur'+namespace, function(event) {
				if (self.source == "keyboard") { self._stop(); }
				self._readValue();
			})
			.parent()
				// add buttons
				.append(self._buttonHtml())
				.width(outerWidth)
				.css({
					"margin-left": marginLeft,
					"margin-right": marginRight				
				})				
				.hover(function() {
					//self._hide(false);
				}, function() {
					if (self.source == "mouse") { self._stop(); }
				});

		// TODO: need a better way to exclude IE8 without resorting to $.browser.version
		// fix inline-block issues for IE. Since IE8 supports inline-block we need to exclude it.
		if (!$.support.opacity && uiSpinner.css('display') == 'inline-block' && $.browser.version < 8) {
			uiSpinner.css('display', 'inline');
		}

		// element bindings
		this.element
			// Give the spinner casing a unique id only if one exists in original input 
			// - this should aid targetted customisations if a page contains multiple instances
			.attr('id', function(){
				if (this.id) {
					uiSpinner.attr('id', 'ui-spinner-'+ this.id);
				}
			});

		// disable spinner if element was already disabled
		if (o.disabled) {
			this.disable();
		}
		
		// button bindings
		this.buttons = uiSpinner.find('.ui-spinner-button')
			.css("width", o.buttonWidth)
			.bind('mousedown', function (event) {
				var direction = $(this).hasClass('ui-spinner-up') ? 1 : -1;
				self._stop();
				self.source = "mouse";
				self._spin(direction, event.shiftKey);
				
				if (!self.options.disabled) {
					$(this).addClass(active);
				}
				return true;
			})
			.bind('mouseup', function (event) {
				self._stop();
				self.element.focus();
				$(this).removeClass(active);
			})
			.hover(function () {
				if (!self.options.disabled) {
					$(this).addClass(hover);					
				}
			}, function (event) {
				$(this).removeClass(active + ' ' + hover);
			});
			
		// ie doesn't fire mousedown on 2nd click, so have to fake it
		if ($.browser.msie) {
			this.buttons.bind("dblclick", function () {
				$(this).trigger("mousedown")
					.trigger("mouseup");
			});
		}
		self.uiSpinner = uiSpinner;
	},
	_uiSpinnerHtml: function () {
		return '<span role="spinbutton" class="' + uiSpinnerClasses + 
				(this.options.spinnerClass || '') + 
				' ui-spinner-' + this.options.dir + 
				'"></span>';
	},
	_buttonHtml: function () {
		return '<a class="ui-spinner-button ui-spinner-up ui-state-default ui-corner-t' + this.options.dir.substr(-1,1) + 
				'"><span class="ui-icon ui-icon-triangle-1-n">&#9650;</span></a>' +
				'<a class="ui-spinner-button ui-spinner-down ui-state-default ui-corner-b' + this.options.dir.substr(-1,1) + 
				'"><span class="ui-icon ui-icon-triangle-1-s">&#9660;</span></a>';
	},
	_keyDown: function (event) {
		var paging, direction,
			key = event.keyCode,
			o = this.options,
			KEYS = $.ui.keyCode;
			
		if (this.timer) { return false; }
			
		if 	(key == KEYS.UP || key == KEYS.DOWN || key == KEYS.PAGE_UP ||
				key == KEYS.PAGE_DOWN || key == KEYS.RIGHT || key == KEYS.LEFT) {
			paging = key == KEYS.PAGE_UP
					|| key == KEYS.PAGE_DOWN
					|| event.shiftKey;
			direction = (key == KEYS.UP
						|| key == KEYS.PAGE_UP
						|| key == KEYS.RIGHT) ? 1 : -1;
			this.source = "keyboard";
			this._spin(direction, paging);
			return false;
		}
		else if (key == KEYS.HOME && ! event.shiftKey && o.max !== null)  {
			this.value(o.max);
			return false;
		}
		else if (key == KEYS.END && ! event.shiftKey && o.min !== null)  {
			this.value(o.min);
			return false;
		}
		else if (key == KEYS.ENTER) {
			this._readValue();
			return false;
		}
		else {
			return true;
		}
	},
	
	_keyUp: function(event) {
		this._stop();
	},
	
	_spin: function (direction, paging) {
		var inc, next,
			o = this.options,
			self = this;
		this.spinCounter = this.spinCounter || 0;
		this.spinStage = this.spinStage || 0;
		inc = o.increments[this.spinStage];
		if (inc.count && this.spinCounter >= inc.count) {
			this.spinStage++;
		}
		inc = o.increments[this.spinStage];

		next = o.next(this.currVal, inc[paging?"page":"increment"], direction, o.min, o.max, o.step);
		if (next !== false) {
			this.timer = setTimeout(function () {self._spin(direction, paging)}, inc.delay);
			this.value(next);
			this.spinCounter++;
		}
	},
	
	_stop: function () {
		if (this.timer) {
			clearTimeout (this.timer);
			this.source = this.timer = this.spinCounter = this.spinStage = null;
			this._trigger("stop", null, {value: this.currVal});
		}
	},
	
	value: function (newVal, suppressEvent) {
		if (arguments.length == 0) {
			return this.currVal;
		}
		else {
			this.currVal = newVal;
			if (! suppressEvent) {
				this._trigger("change", null,
					{value: newVal, spinning: !!this.timer});
			}
			this.element.val(this._formatted());
			this._aria();
		}
	},
	
	_readValue: function () {
		var newVal = this.options.parse(this.element.val());
		if (newVal != this._formatted()) {
			this.value(newVal);
		}
	},
	
	
	_formatted: function () {
		var o = this.options;
		return o.format(this.currVal, o.precision, o.radixPoint);
	},
	
	/// XXX next
	_mousewheel: function() {
		var self = this;
		if ($.fn.mousewheel && self.options.mouseWheel) {
			this.element.mousewheel(function(event, delta) {
				delta = ($.browser.opera ? -delta / Math.abs(delta) : delta);
				if (!self._start(event)) {
					return false;
				}
				self._spin((delta > 0 ? 1 : -1) * self._step(), event);					
				if (self.timeout) {
					window.clearTimeout(self.timeout);
				}
				self.timeout = window.setTimeout(function() {
					if (self.spinning) {
						self._stop(event);
						self._change(event);						
					}
				}, 400);
				event.preventDefault();			
			});			
		}
	},
	
	_aria: function() {
		var opts = this.options;
		this.uiSpinner 
			&& this.uiSpinner
				.attr('aria-valuemin', opts.format(opts.min))
				.attr('aria-valuemax', opts.format(opts.max))
				.attr('aria-valuenow', this._formatted());
	},
	
	destroy: function() {
		if ($.fn.mousewheel) {
			this.element.unmousewheel();
		}
		
		this.element
			.removeClass('ui-spinner-input')
			.removeAttr('disabled')
			.removeAttr('autocomplete')
			.removeData('spinner')
			.unbind(namespace);
		
		if (this.uiSpinner) {
			if (this.uiSpinner.parent()[0] != null) {
				this.uiSpinner.replaceWith(this.element);	
			}
			else {
				return this.element.clone(true);
			}
		}
	},
	
	enable: function() {
		this.element
			.removeAttr('disabled')
			.siblings()
				.removeAttr('disabled')
			.parent()
				.removeClass('ui-spinner-disabled ui-state-disabled');
		this.options.disabled = false;
	},
	
	disable: function() {
		this.element
			.attr('disabled', true)
			.siblings()
				.attr('disabled', true)
			.parent()
				.addClass('ui-spinner-disabled ui-state-disabled');
		this.options.disabled = true;
	}
});

$.extend($.ui.spinner.prototype, {
	version: "@VERSION",
	eventPrefix: "spin",
	options: {
		initValue: 0,
		defaultValue: 0,
		precision: 0,
		radixPoint: ".",
		min: null,
		max: null,
		dir: "ltr",
		step: 1,
		showButtons: "always",
		buttonWidth: 16,
		increments: [{count: 2, increment: 1, page: 10, delay: 500},
					 {count: 50, increment: 1, page: 10, delay: 50},
					 {count: null, increment: 10, page: 50, delay: 50}],
		format: function (value, precision, radixPoint) {
			return value.toFixed(precision).replace(".", radixPoint);
		},
		parse: function (text) {
			return parseFloat(text);
		},
		next: function (currentValue, amount, direction, min, max, step) {
			return ((direction > 0 && currentValue == max)
					|| (direction < 0 && currentValue == min)) ? false :
				Math.max(min, Math.min(max, currentValue + amount * step * direction)); 
		}		
	}
});

})(jQuery);
