var TestPageView = Backbone.View.extend({
    initialize: function() {
        $(window).resize(_.bind(this._onWindowResize, this));
        this.model.on('change:targetData', this.updateTargetEnvironment, this);
    },
    render: function() {
        var iframe = $('<iframe>')
            .addClass('testPage')
            .attr('src', this.model.get('pageUrl'))
            .appendTo(this.$el);

        iframe.getDocument = function() {
            return $(iframe[0].contentDocument || iframe[0].contentWindow.document);
        }

        this.getFrame = function() {
            return iframe;
        }

        this._onWindowResize();

        var loadingElements = $('<div>')
            .html('Please wait while the page is loaded...')
            .addClass('loadingMessage')
            .appendTo('body')
            .center()
            .add(
                $('<div>')
                    .addClass('loadingBackground')
                    .appendTo(this.$el)
            );

        iframe.load(_.bind(function(e) {
            var body = iframe.getDocument().find('body');

            $('<link>').attr({
                href: 'css/editor.css',
                rel: 'stylesheet'
            }).prependTo(body);

            body.append($('<div>').html($('#frameTargetElements').html()));

            body.mouseover(_.bind(this._mouseover, this))
                .mousedown(_.bind(this._mousedown, this))
                .click(function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                });

            loadingElements.fadeOut(150);
        }, this));

        return this;
    },
    _onWindowResize: function() {
        this.getFrame().height($(window).height() - this.getFrame().offset().top);

        return this;
    },
    _mouseover: function(e) {
        var target = $(e.target);
        var model = this.model;
        if (!target.hasClass('elementOutline') && !model.get('targetData'))
            this._selectElement(target);
    },
    _mousedown: function(e) {
        this.model.set('targetData', this.model.get('targetData') ? null : e);

        e.preventDefault();
        e.stopPropagation();
    },
    _selectElement: function(target) {
        var offset = target.offset();
        var border = 2;
        var width = target.outerWidth();
        var height = target.outerHeight();

        var body = this.getFrame().getDocument().find('body');

        body.find('.elementOutline').show();

        body.find('.leftOutline')
            .css({
                left: offset.left - border,
                top: offset.top,
                height: height
            })
        .end()
        .find('.rightOutline')
            .css({
                left: offset.left + width,
                top: offset.top,
                height: height
            })
        .end()
        .find('.topOutline')
            .css({
                left: offset.left - border,
                top: offset.top,
                width: 2 * border + width
            })
        .end()
        .find('.bottomOutline')
            .css({
                left: offset.left - border,
                top: offset.top + height,
                width: 2 * border + width
            })
        .end();
    },
    updateTargetEnvironment: function() {
        var doc = this.getFrame().getDocument(), body = doc.find('body');
        if (this.model.get('targetData')) {
            var el = $(this.model.get('targetData').target),
                offset = el.offset(),
                docH = doc.height(),
                docW = doc.width(),
                height = el.outerHeight();

            if (el.is(':hidden')) {
                body.find('.elementOutlineBackground,.elementGlassBackground,.elementOutline').hide();
                return;
            }

            this._selectElement(el);

            body.find('.elementOutlineBackground,.elementGlassBackground').show();

            body.find('.topOutlineBackground')
                .css({
                    top: 0,
                    left: 0,
                    height: offset.top,
                    width: docW
                })
            .end()
            .find('.leftOutlineBackground')
                .css({
                    top: offset.top,
                    left: 0,
                    height: height,
                    width: offset.left
                })
            .end()
            .find('.bottomOutlineBackground')
                .css({
                    top: offset.top + height,
                    left: 0,
                    width: docW,
                    height: (docH - offset.top - height)
                })
            .end()
            .find('.rightOutlineBackground')
                .css({
                    top: offset.top,
                    left: offset.left + el.outerWidth(),
                    height: height,
                    width: (docW - offset.left - el.outerWidth())
                })
            .end()
            .find('.elementGlassBackground')
                .css({
                    top: offset.top,
                    left: offset.left,
                    height: el.outerHeight(),
                    width: el.outerWidth()
                });
        } else {
            body.find('.elementOutlineBackground,.elementGlassBackground').hide();
        }
    }
});