var StyleItemView = Backbone.View.extend({
    events: {
        'click .styleValue': '_edit',
        'click .editStyleButton': '_edit',
        'click .saveStyleButton': '_save',
        'click .cancelStyleButton': '_cancel',
        'keyup input': '_onInput'
    },
    initialize: function() {
        this.model.on('change:isEditing', this._onEditing, this);
    },
    render: function() {
        this.$el.html(_.template($('#styleItem').html(), {
            name: this.model.get('property'),
            value: this.model.getValue()
        }));
        this._onEditing();

        return this;
    },
    _edit: function() {
        this.model.set('isEditing', true);
    },
    _onEditing: function() {
        var isEditing = this.model.get('isEditing');
        this.$('.styleValue,.editStyleButton').toggleClass('invisible', isEditing);
        this.$('input,.saveStyleButton,.cancelStyleButton').toggleClass('invisible', !isEditing);
        if (!isEditing)
            this._refresh();
    },
    _save: function() {
        this.model.apply(this.$('input').val());
        this.model.complete();
    },
    _cancel: function() {
        this.model.cancel();
    },
    _refresh: function() {
        var value = this.model.getValue();
        this.$('.styleValue').html(value);
        this.$('input').val(value);
    },
    _onInput: function(e) {
        if (e.keyCode == 13) // Enter
            this._save();
        else if (e.keyCode == 27) // Esc
            this._cancel();
        else
            this.model.apply(this.$('input').val());

        e.stopPropagation();
    }
})