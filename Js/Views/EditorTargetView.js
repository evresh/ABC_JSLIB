var EditorTargetView = Backbone.View.extend({
    initialize: function() {
        this.model
            .on('updated', this._select, this)
            .on('destroy', this._destroy, this)
            .on('change:editMode', this._modeChanged, this);
    },
    render: function() {
        var body = this.model.getDocument().find('body');
        if (!body.find('.elementOutlineBackground').length)
            body.append($('#selectedTargetElements').html());

        this._select();

        return this;
    },
    _select: function() {
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
            .find('.elementOutlineBackground,.elementGlassBackground').hide().end()
            .find('.resizeGlassLayer').remove();


        TargetHighlighter.removeHighlight(this.model.get('element'));
    },
    _modeChanged: function() {
        if (this.model.get('editMode') == EditorTargetMode.resizing) {
            var doc = this.model.getDocument();
            if (!doc.find('.resizeGlassLayer').length)
                doc.find('body').append($('#resizeTargetElements').html())

            var _this = this;
            var targetElement = this.model.get('element');
            var layer = doc.find('.resizeGlassLayer').css({
                left: targetElement.offset().left,
                top: targetElement.offset().top,
                height: targetElement.outerHeight(),
                width: targetElement.outerWidth()
            })
            .drag('start', function(ev, dd) {
                dd.attr = ev.target.className;
                dd.width = targetElement.width();
                dd.height = targetElement.height();
            }, { handle: '.resizeHandle' }).drag(function(ev, dd) {
                var width, height;
                if (dd.attr.indexOf("E") > -1) {
                    width = Math.max(20, dd.width + dd.deltaX);
                }
                if (dd.attr.indexOf("S") > -1) {
                    height = Math.max(20, dd.height + dd.deltaY);
                }
                if (dd.attr.indexOf("W") > -1) {
                    width = Math.max(20, dd.width - dd.deltaX);
                }
                if (dd.attr.indexOf("N") > -1) {
                    height = Math.max(20, dd.height - dd.deltaY);
                }
                //props['z-index'] = targetElement.css('z-index');
                height += 'px';
                width += 'px';
                targetElement.css('width', width).css('height', height);
                layer.css({
                    left: targetElement.offset().left,
                    top: targetElement.offset().top,
                    height: targetElement.outerHeight(),
                    width: targetElement.outerWidth()
                });
                _this.model.updated();
            });
        }
    },
    _destroy: function() {
        this.model
            .off('updated', this._select, this)
            .off('destroy', this._destroy, this)
            .off('change:editMode', this._modeChanged, this);

        this._hide();
    }
});