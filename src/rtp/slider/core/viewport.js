/*

  Copyright (c) Marcel Greter 2012 - rtp.ch - RTP jQuery Slider Core Viewport Functions
  This is free software; you can redistribute it and/or modify it under the terms
  of the [GNU General Public License](http://www.gnu.org/licenses/gpl-3.0.txt),
  either version 3 of the License, or (at your option) any later version.

*/

// extend class prototype
(function (prototype, jQuery)
{

	'use strict';


	// @@@ plugin: config @@@
	prototype.plugin('config', function (extend)
	{

		// add defaults
		extend({

			// link wrapper dimension to viewport
			linkWrapperToViewportDim: true,
			// link wrapper opposition to viewport
			linkWrapperToViewportOpp: false

		});

	});
	// @@@ EO plugin: config @@@


	// @@@ plugin: init @@@
	prototype.plugin('init', function ()
	{

		// closure object
		var slider = this;

		// create closure function
		function changedViewport (evt, widget)
		{
			// trigger adjust viewport hook
			// integrates ocbnet layout manager
			slider.trigger('adjustViewport');
			// do not propagate any further
			// we may emit another event if needed
			evt.stopPropagation();
		}

		// event is emmited on wrapper, not on viewport
		// otherwise we would handle our own event again
		slider.viewport.bind('changedViewport', changedViewport)

	});
	// @@@ EO plugin: init @@@


	// @@@ method: getViewportOffset @@@
	prototype.getViewportOffset = function ()
	{

		// get the viewport offset
		var offset = this.viewport.offset();

		// normalize drag and scroll axis
		return this.conf.vertical
			? { x : offset.top, y : offset.left }
			: { x : offset.left, y : offset.top };

	}
	// @@@ EO method: getViewportOffset @@@


	// @@@ private fn: setViewportSize @@@
	// this may not work as other css might overrule us
	// the implementer has to make sure this does not happen
	function setViewportSize (value, invert)
	{

		// get local variable
		var conf = this.conf,
		    wrapper = this.wrapper,
		    viewport = this.viewport;

		// set the height
		if (conf.vertical ^ invert)
		{
			viewport.height(value);
			if (conf.linkWrapperToViewportOpp)
			{ wrapper.height(viewport.outerHeight(true)); }
		}
		// set the width
		else
		{
			viewport.width(value);
			if (conf.linkWrapperToViewportDim)
			{ wrapper.width(viewport.outerWidth(true)); }
		}

	}
	// @@@ EO private fn: setViewportSize @@@

	// @@@ method: updateViewportDim @@@
	prototype.updateViewportDim = function (value)
	{

		// development assertion
		if (isNaN(value)) eval('debugger');

		// check if we are allowed to read from ua
		// this should not happen, remove when use case emerges
		if (this.conf.sizerDim != 'viewportByPanels') eval('debugger');

		// does the value really change
		if (this.vp_x == value) return;

		// assign given viewport dimension
		setViewportSize.call(this, value, 0);

		// remember old value to pass to hook
		var before = this.vp_x; this.vp_x = value;

		// now trigger the updatedViewportDim hook
		this.trigger('updatedViewportDim', value, before);

		// issue an event for any outside listeners
		this.wrapper.trigger('changedViewport', this);

	}
	// @@@ EO method: updateViewportDim @@@

	// @@@ method: updateViewportOpp @@@
	prototype.updateViewportOpp = function (value)
	{

		// development assertion
		if (isNaN(value)) eval('debugger');

		// check if we are allowed to read from ua
		// this should not happen, remove when use case emerges
		if (this.conf.sizerOpp != 'viewportByPanels') eval('debugger');

		// does the value really change
		if (this.vp_y == value) return;

		// assign given viewport dimension
		setViewportSize.call(this, value, 1);

		// remember old value to pass to hook
		var before = this.vp_y; this.vp_y = value;

		// now trigger the updatedViewportOpp hook
		this.trigger('updatedViewportOpp', value, before);

		// issue an event for any outside listeners
		this.wrapper.trigger('changedViewport', this);

	}
	// @@@ EO method: updateViewportOpp @@@


	// @@@ private fn: getViewportSize @@@
	function getViewportSize (invert)
	{

		// get local variable
		var viewport = this.viewport;

		// return the viewport axis size
		return this.conf.vertical ^ invert
			? viewport.height() : viewport.width();

	}
	// @@@ EO private fn: getViewportSize @@@

	// @@@ method: getViewportDim @@@
	prototype.getViewportDim = function ()
	{ return getViewportSize.call(this, 0); }
	// @@@ EO method: getViewportDim @@@

	// @@@ method: getViewportOpp @@@
	prototype.getViewportOpp = function ()
	{ return getViewportSize.call(this, 1); }
	// @@@ EO method: getViewportOpp @@@

	// @@@ method: readViewportDim @@@
	prototype.readViewportDim = function ()
	{

		// check if we are allowed to read from ua
		if (this.conf.sizerDim == 'viewportByPanels') eval('debugger');

		// store the current viewport dimension
		this.vp_x = getViewportSize.call(this, 0);
		// throw an error if we cannot get a valid size
		// this is mostly due missing or confusing css styles
		// in vertical mode you must give it some height value
		// if (this.vp_x == 0) throw('viewport size is empty');

	}
	// @@@ EO method: readViewportDim @@@

	// @@@ method: readViewportOpp @@@
	prototype.readViewportOpp = function ()
	{

		// check if we are allowed to read from ua
		if (this.conf.sizerOpp == 'viewportByPanels') eval('debugger');

		// store the current viewport opposition
		this.vp_y = getViewportSize.call(this, 1);

	}
	// @@@ EO method: readViewportOpp @@@

	// @@@ plugin: changedViewport @@@
	prototype.plugin('changedViewport', function ()
	{

		// read viewport so we can use it to layout panels
		if (this.conf.sizerDim == 'panelsByViewport') this.readViewportDim();
		if (this.conf.sizerOpp == 'panelsByViewport') this.readViewportOpp();

	}, -9999);
	// @@@ EO plugin: changedViewport @@@

	// @@@ plugin: changedViewport @@@
	prototype.plugin('changedViewport', function ()
	{

		// read viewport after everything else is done
		if (this.conf.sizerDim == 'none') this.readViewportDim();
		if (this.conf.sizerOpp == 'none') this.readViewportOpp();

	}, 9999);
	// @@@ EO plugin: changedViewport @@@


	// @@@ plugin: updatedPanelsOpp @@@
	prototype.plugin('updatedPanelsOpp', function ()
	{

		// read viewport after panels have changed
		if (this.conf.sizerOpp == 'none') this.readViewportOpp();

	})
	// @@@ EO plugin: updatedPanelsOpp @@@


	// @@@ plugin: updatedPanelsDim @@@
	prototype.plugin('updatedPanelsDim', function ()
	{

		// read viewport after panels have changed
		if (this.conf.sizerDim == 'none') this.readViewportDim();

	})
	// @@@ EO plugin: updatedPanelsDim @@@

// EO extend class prototype
})(RTP.Slider.prototype, jQuery);