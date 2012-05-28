var VisibilityOperation = EditorOperation.extend({
    _getInitialState: function() {
        return this.get('target').css('visibility');
    },
    _onEditing: function() {
        if (this.get('isEditing')) {
            this.apply();
            this.complete();
            this.set('isEditing', false);
        }
    },
    _applyChanges: function() {
        var target = this.get('target');
        var isHidden = VisibilityOperation.isTargetHidden(target);
        target.toggleClass('hiddenByOptimizer', !isHidden);
        target.css('visibility', isHidden ? 'visible' : 'hidden');
        return target.css('visibility');
    },
    _deleteChanges: function() {
        if (this.get('changedState')) {
            this.get('target').css('visibility', this.get('initialState'));
            this.get('target').removeClass('hiddenByOptimizer');
        }
    }
});
VisibilityOperation.isTargetHidden = function(target) {
    return target.css('visibility') == 'hidden' || target.css('visibility') == 'collapse'
        || target.hasClass('hiddenByOptimizer');
}