var ChangeCSSView = OperationView.extend({
    _getExtendedEvents: function() {
        return {
            'click .cssGroupTitle': '_groupSelected',
            'click .addCustomCss': '_addCustomStyle'
        };
    },
    _afterRender: function() {
        this._overlay.setTitle('Change CSS');
        this._overlay.setContent($('<div>').addClass('cssList'));
    },
    _reset: function() {
        var cssList = this.$('.cssList');
        cssList.empty();
        this.model.get('tempItems').each(_.bind(function(item) {
            var group = item.get('group');
            var selector = group.substr(0, 1).toLowerCase() + group.substr(1) + 'CssGroup';
            if (!this.$('.' + selector).length) {
                $(_.template($('#cssGroup').html(), {
                    title: group,
                    selector: selector
                }))
                .appendTo(cssList);
            }

            var itemViewCtor = StyleItemView;
            if (item.isCustom())
                itemViewCtor = CustomStyleItemView;
            else if (item instanceof ColorItemOperation)
                itemViewCtor = ColorItemView;
            new (itemViewCtor)({ model: item }).render().$el.appendTo(this.$('.' + selector).find('.cssGroupItems'));
        }, this));

        if (!cssList.find('.customCssGroup').length) {
            $(_.template($('#cssGroup').html(), {
                title: 'Custom',
                selector: 'customCssGroup'
            }))
            .appendTo(cssList);
        }

        $('<div>').addClass('addCustomCss').append($('<a>Add</a>')).appendTo(cssList.find('.customCssGroup .cssGroupItems'));

        this.$('.cssGroupTitle:eq(0)').click();
    },
    _groupSelected: function(e) {
        var el = $(e.target);
        if (!el.closest('.cssGroup').hasClass('openCssGroup')) {
            this.$('.openCssGroup').removeClass('openCssGroup').find('.cssGroupItems').slideUp(250);
            var deferred = el.closest('.cssGroup').addClass('openCssGroup').find('.cssGroupItems').slideDown(250);
            $.when(deferred).done(_.bind(this._updateOverlayPosition, this));
        }
        this.model.resetEdit();
        //this._overlay.attachToTarget();
    },
    _addCustomStyle: function() {
        var model = this.model.createCustomItem();
        new CustomStyleItemView({ model: model })
            .render().$el.insertBefore(this.$('.addCustomCss'));
        model.set('isEditing', true);
    }
});