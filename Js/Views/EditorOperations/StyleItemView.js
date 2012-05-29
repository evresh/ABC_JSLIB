var StyleItemView = Backbone.View.extend({
    events: {
        'click .styleValue': '_edit',
        'click .editStyleButton': '_edit',
        'click .saveStyleButton': '_save',
        'click .cancelStyleButton': '_cancel',
        'keypress input': '_onInput'
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
    _onEditing: function(model) {
        var isEditing = this.model.get('isEditing');
        this.$('.styleValue,.editStyleButton').toggleClass('invisible', isEditing);
        this.$('input,.saveStyleButton,.cancelStyleButton').toggleClass('invisible', !isEditing);
        if (!isEditing && model && this.model.get('lastAction') == EditorOperationAction.none)
            this._save();
    },
    _save: function() {
        if (this.model.apply(this.$('input').val()))
            this._refresh();
    },
    _cancel: function() {
        this._refresh();
    },
    _refresh: function() {
        this.$('.styleValue').html(this.model.getValue());
        this.$('input').val(this.model.getValue());
        this.model.set('isEditing', false);
    },
    _onInput: function(e) {
        if (e.keyCode == 13)
            this._save();
        e.stopPropagation();
    }
})