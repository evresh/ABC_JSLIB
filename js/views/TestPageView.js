var TestPageView = Backbone.View.extend({
    initialize: function() {
        $(window).resize(_.bind(this._onWindowResize, this));
    },
    render: function() {
        var iframe = $('<iframe>')
            .attr('src', this.model.get('pageUrl'))
            .appendTo(this.$el);

        iframe.load(_.bind(function(e) {
            this._iframeContent = $(iframe[0].contentDocument || iframe[0].contentWindow.document).find('body');

            $('<link>').attr({
                href: 'css/editor.css',
                rel: 'stylesheet'
            }).prependTo(this._iframeContent);

            this._iframeContent
                .append($('<div>').addClass('elementOutline').addClass('leftOutline'))
                .append($('<div>').addClass('elementOutline').addClass('rightOutline'))
                .append($('<div>').addClass('elementOutline').addClass('topOutline'))
                .append($('<div>').addClass('elementOutline').addClass('bottomOutline'));

            this._iframeContent
                .mouseover(_.bind(this._mouseover, this))
                .mousedown(_.bind(this._mousedown, this));
        }, this));

        this._onWindowResize();

        return this;
    },
    _onWindowResize: function() {
        this.$('iframe').height($(window).height() - $(this.options.excludeHeightSelector).outerHeight());

        return this;
    },
    _mouseover: function(e) {
        var target = $(e.target);
        var model = this.model;
        if (!target.hasClass('elementOutline') && !model.get('isSelected') && (!model.get('target') || model.get('target')[0] != target[0])) {
            model.set('target', target);

            var offset = target.offset();
            var border = 2;
            var width = target.outerWidth();
            var height = target.outerHeight();

            this._iframeContent.find('.elementOutline').show();

            this._iframeContent.find('.leftOutline')
                .css({
                    left: offset.left - border,
                    top: offset.top,
                    height: height
                });
            this._iframeContent.find('.rightOutline')
                .css({
                    left: offset.left + width,
                    top: offset.top,
                    height: height
                });
            this._iframeContent.find('.topOutline')
                .css({
                    left: offset.left - border,
                    top: offset.top,
                    width: 2 * border + width
                });
            this._iframeContent.find('.bottomOutline')
                .css({
                    left: offset.left - border,
                    top: offset.top + height,
                    width: 2 * border + width
                });
        }
    },
    _mousedown: function(e) {
        this.model.set('isSelected', !this.model.get('isSelected'));
        if (!this.model.get('isSelected'))
            this._mouseover(e);
    }
});