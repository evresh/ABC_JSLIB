var EditorView = Backbone.View.extend({
    events: {
        'click .saveChanges': '_save'
    },
    initialize: function() {
        this._menuView = new EditorMenuView({
            el: this.$('.editorMenu'),
            model: this.model.get('menu')
        });
        this._operationViews = {};

        this.model.on('change:target', this._targetChanged, this);
        this.model.on('change:currentOperation', this._currentOperationChanged, this);
        $(window).resize(_.bind(this._onWindowResize, this));
    },
    render: function() {
        this._renderIframe();
        this._menuView.render();

        return this;
    },
    _renderIframe: function() {
        var iframe = $('.testPage').attr('src', this.model.get('pageUrl'));

        this._onWindowResize();
        $('.loadingMessage, .loadingBackground').show();
        $('.loadingMessage').center();

        iframe.load(_.bind(function(e) {
            var doc = $(iframe[0].contentDocument || iframe[0].contentWindow.document);
            var body = doc.find('body');

            $('<link>').attr({
                href: 'css/editor.css',
                rel: 'stylesheet'
            }).prependTo(body);

            body.mouseover(_.bind(this._iframeMouseover, this))
                .mousedown(_.bind(this._iframeMousedown, this))
                .click(function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                });

            $('.loadingMessage, .loadingBackground').fadeOut(150);
        }, this));
    },
    _onWindowResize: function() {
        $('.testPage').height($(window).height() - $('.testPage').offset().top);
    },
    _iframeMouseover: function(e) {
        if (!this.model.get('target'))
            TargetHighlighter.highlight($(e.target));
    },
    _iframeMousedown: function(e) {
        if (this.model.get('target')) {
            this.model.set('target', null);
        } else {
            this.model.set('target', new EditorTarget({
                element: $(e.target),
                pageX: e.pageX,
                pageY: e.pageY
            }));
        }

        e.preventDefault();
        e.stopPropagation();
    },
    _targetChanged: function() {
        var target = this.model.get('target');
        var prevTarget = this.model.previous('target');
        if (target)
            new EditorTargetView({ model: target }).render();
        else if (prevTarget)
            prevTarget.destroy();
    },
    _currentOperationChanged: function() {
        var operation = this.model.get('currentOperation');
        if (operation) {
            var type = operation.get('type');
            var viewName = type.substr(0, 1).toUpperCase() + type.substr(1) + 'View';
            var viewCtor = window[viewName];
            if (viewCtor) {
                var view = this._operationViews[viewName];
                if (!view)
                    view = this._operationViews[viewName] = new (viewCtor)({
                        model: operation
                    }).render();
                else
                    view.setModel(operation);

                var prevOperationView = this._currentOperationView;
                if (prevOperationView)
                    view.maximized(prevOperationView.maximized());

                this._currentOperationView = view;
                return;
            }
        }

        this._currentOperationView = null;
    },
    _save: function() {
        this.model.save();
    }
})