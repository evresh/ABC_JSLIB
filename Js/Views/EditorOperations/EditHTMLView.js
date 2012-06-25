var EditHTMLView = OperationView.extend({
    maximizable: true,
    _afterRender: function() {
        var _this = this;

        this._overlay.setTitle('Edit HTML');
        var mirrorContainer = $('<div>').addClass('mirrorContainer')
        this._overlay.setContent(mirrorContainer);

        this._mirror = CodeMirror(function(el) {
            mirrorContainer.append(el);
        },
        {
            mode: 'text/html',
            lineNumbers: true,
            lineWrapping: false,
            reindentOnLoad: true,
            onChange: function() {
                _this.model.apply(_this._mirror.getValue());
            },
            onFocus: function() {
            }
        });
    },
    _showInternal: function() {
        this._mirror.setValue(this.model.getValue());
        this._mirror.focus();
        this._mirror.refresh();
    },
    _toggleMaximizing: function(info) {
        var element = this.$('.CodeMirror-scroll');
        if (info.maximized) {
            element.attr('actualHeight', element.height()).attr('actualWidth', element.width());
            element.css('height', info.availableHeight);
        } else if (element.attr('actualHeight')) {
            element.css('height', element.attr('actualHeight')).css('width', element.attr('actualWidth'));
        }
        element.toggleClass('maximized', info.maximized);
        this._mirror.refresh();
    }
})