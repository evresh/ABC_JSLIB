var ChangeCSSView = OperationView.extend({
    events: {
        'click .cssGroupTitle': '_groupSelected'
    },
    _afterRender: function() {
        this._overlay.setTitle('Change CSS');
    },
    _reset: function() {
        this.model.get('items').each(_.bind(function(item) {
            var group = item.get('group');
            var selector = group.substr(0, 1).toLowerCase() + group.substr(1) + 'CssGroup';
            if (!this.$('.' + selector).length) {
                $(_.template($('#cssGroup').html(), {
                    title: group,
                    selector: selector
                }))
                .appendTo(this.$('.cssList'));
            }
            new StyleItemView({ model: item }).render().$el.appendTo(this.$('.' + selector).find('.cssGroupItems'));
        }, this));

        this.$('.cssGroupTitle:eq(0)').click();
    },
    _groupSelected: function(e) {
        var el = $(e.target);
        if (!el.closest('.cssGroup').hasClass('openCssGroup')) {
            this.$('.openCssGroup').removeClass('openCssGroup').find('.cssGroupItems').slideUp(250);
            el.closest('.cssGroup').addClass('openCssGroup').find('.cssGroupItems').slideDown(250);
        }
        this.model.resetEdit();
        this._overlay.attachToTarget();
    }
});