var EditorOverlayView = Backbone.View.extend({
    className: 'editorOverlay',
    events: {
        'click .closeButton': '_innerClose',
        'click .maximizeButton': '_toggleMaximizing'
    },
    render: function() {
        this.$el
            .html(_.template($('#overlayTemplate').html(), {
                maximizable: !!this.options.maximizable,
                showFooter: !!this.options.showFooter
            }))
            .hide()
            .appendTo('body');

        return this;
    },
    setTitle: function(title) {
        this.$('.overlayTitle .titleText').html(title);
        return this;
    },
    setContent: function(content) {
        this.$('.overlayContent').empty().append(content);
        return this;
    },
    show: function() {
        this.$el.toggleClass('maximized', false);
        this.$el.fadeIn(150);
        if (this.options.maximizable)
            this._toggleMaximizing(!!this.options.maximized);
        this.attachToTarget();
    },
    _innerClose: function(e, skipEvent) {
        var _this = this;
        return this.$el.fadeOut(150, function(){
            if (!skipEvent)
                _this.trigger('close');
        });
    },
    _toggleMaximizing: function(value) {
        if (_.isBoolean(value))
            this.$el.toggleClass('maximized', value);
        else
            this.$el.toggleClass('maximized');
        var info = {
            maximized: this.$el.hasClass('maximized'),
            availableHeight: this.$el.height() - this.$('.overlayTitle').outerHeight() - this.$('.overlayFooter').outerHeight()
        }
        this.trigger('toggleMaximizing', info);

        this.options.maximized = info.maximized;
    },
    close: function(skipEvent) {
        this._innerClose(null, skipEvent);
    },
    attachToTarget: function() {
        var top, left, menu = this.$el,
        elem = $(this.model.get('element')),
        frame = this.model.getParentIframe(),
        frameDoc = this.model.getDocument()[0],
        x = parseInt(this.model.get('pageX') || 0, 10) - window.pageXOffset,
        y = parseInt(this.model.get('pageY') || 0, 10) - window.pageYOffset,
        margin = 8,
        flag = false,
        eoW = elem.outerWidth(),
        eoH = elem.outerHeight(),
        eO = elem.offset(),
        eoL = eO.left,
        eoT = eO.top,
        fO = frame.offset(),
        foL = fO.left,
        foT = fO.top,
        foH = frame.outerHeight(),
        foW = frame.outerWidth(),
        moW = menu.outerWidth(),
        moH = menu.outerHeight(),
        tagName = elem.get(0).tagName;
        if ((x != 0 || y != 0 || tagName != 'HEAD') && tagName != 'BODY') {
            var adjustLeft = foL - (frame[0].contentWindow.pageXOffset || frameDoc.body.scrollLeft),
            adjustTop = foT - (frame[0].contentWindow.pageYOffset || frameDoc.body.scrollTop);
            var rspace = foW + foL - eoL - eoW;
            var lspace = foW - eoW - rspace;
            if (rspace > lspace) {
                left = eoL + eoW + margin + adjustLeft + 0/*VWO.dragX*/;
                //if (rearrange) left = left + 0.75 * margin;
            }
            else {
                left = eoL - moW - margin + adjustLeft + 0 /*VWO.dragX*/;
                //if (rearrange) left = left - 0.75 * margin;
            }
            if (eoW > 0.95 * foW || (moW > rspace && moW > lspace)) flag = true;
            top = eoT + adjustTop + 0/*VWO.dragY*/;
            if (flag) {
                var tspace = eoT - (frame[0].contentWindow.pageYOffset || frameDoc.body.scrollTop),
                bspace = foH - tspace - eoH;
                if (bspace > tspace)
                    top += eoH + margin;
                else
                    top = eoT + adjustTop - moH - margin;
            }
            //if (rearrange) top = top - 0.75 * margin;
            if (top + moH + margin > foH + foT)
                top = foH + foT - moH - margin;
            else if (top < foT + margin)
                top = foT + margin;
            if (left < foL)
                left = foL + margin;
            if (left + moW + margin > foW)
                left = foW - moW - margin;
        }
        else
            flag = true;
        if (flag) {
            left = x + foL + margin;
            if (top + moH > foH + foT) {
                top = foH + foT - moH;
            }
            if (top < foT + margin)
                top = foT + margin;
            if (left + moW > foW + foL)
                left = foW + foL - moW;
        }
        if (! ((left > eoL + eoW) || (left + moW < eoL)) && (/*VWO.dragX*/0 == 0) && (/*VWO.dragY*/0 == 0) && (top + moH + margin > foH + foT))
            top = top + margin;
        menu.get(0).style.left = left + 'px';
        menu.get(0).style.top = top + 'px';
    }
});
_.extend(EditorOverlayView, Backbone.Events);
