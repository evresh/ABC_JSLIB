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
        .end();
            
        this._updateCover(doc.find('.elementGlassBackground,.resizeGlassLayer,.moveGlassLayer'));
    },
    _hide: function() {
        $(this.model.getDocument())
            .find('.elementOutlineBackground,.elementGlassBackground').hide().end()
            .find('.resizeGlassLayer').remove().end()
            .find('.moveGlassLayer').remove();


        TargetHighlighter.removeHighlight(this.model.get('element'));
    },
    _modeChanged: function() {
        var editMode = this.model.get('editMode');
        var doc = this.model.getDocument();
        var targetElement = this.model.get('element');
        var _this = this;

        if (editMode == EditorTargetMode.resize) {
            if (!doc.find('.resizeGlassLayer').length)
                doc.find('body').append($('#resizeTargetElements').html())

            this._updateCover(doc.find('.resizeGlassLayer')).drag('start', function(ev, dd) {
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
                height += 'px';
                width += 'px';
                targetElement.css('width', width).css('height', height);
                _this.model.updated();
            });
        } else if (editMode == EditorTargetMode.move) {
            if (!doc.find('.moveGlassLayer').length)
                doc.find('body').append($('<div>').addClass('moveGlassLayer'));

            var original_top, original_left;

            function updateOriginalValues() {
                original_top = parseInt(targetElement.css('top'), 10) || 0;
                original_left = parseInt(targetElement.css('left'), 10) || 0;
            }

            updateOriginalValues();

            this._updateCover(doc.find('.moveGlassLayer')).drag(function(ev, dd) {
                targetElement.css('top', original_top + dd.deltaY).css('left', original_left + dd.deltaX);
                _this.model.updated();
            }).drop(function() {
                updateOriginalValues();
            });
        }
    },
    _updateCover: function(cover) {
        var targetElement = this.model.get('element');
        if (cover.length > 0) {
            cover.css({
                left: targetElement.offset().left,
                top: targetElement.offset().top,
                height: targetElement.outerHeight(),
                width: targetElement.outerWidth()
            });
        }

        return cover;
    },
    _destroy: function() {
        this.model
            .off('updated', this._select, this)
            .off('destroy', this._destroy, this)
            .off('change:editMode', this._modeChanged, this);

        this._hide();
    }
});