var EditorTargetView = Backbone.View.extend({
    initialize: function() {
        this.model.on('updated', this._show, this);
        this.model.on('destroy', this._destroy, this);
    },
    render: function() {
        var body = this.model.getDocument().find('body');
        if (!body.find('.elementOutlineBackground').length)
            body.append($('#selectedTargetElements').html());

        this._show();

        return this;
    },
    _show: function() {
        var doc = this.model.getDocument();

        var el = this.model.get('element'),
            offset = el.offset(),
            docH = doc.height(),
            docW = doc.width(),
            height = el.outerHeight();

        if (el.is(':hidden')) {
            this._hide();
            return;
        }

        TargetHighlighter.highlight(el);

        doc.find('.elementOutlineBackground,.elementGlassBackground').show();

        doc.find('.topOutlineBackground')
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
    },
    _hide: function() {
        $(this.model.getDocument())
            .find('.elementOutlineBackground,.elementGlassBackground').hide();
        TargetHighlighter.removeHighlight(this.model.get('element'));
    },
    _destroy: function() {
        this.model.off('updated', this._show, this);
        this.model.off('destroy', this._destroy, this);
        this._hide();
    }
});