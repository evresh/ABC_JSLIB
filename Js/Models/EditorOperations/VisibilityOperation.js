var VisibilityOperation = EditorOperation.extend({
    _getInitialState: function() {
        return this.getTargetElement().css('visibility');
    },
    edit: function() {
        EditorOperation.prototype.edit.apply(this);
        this.apply();
        this.complete();
        this.stopEdit();
    },
    _applyChanges: function() {
        var targetElement = this.getTargetElement();
        var isHidden = VisibilityOperation.isTargetElementHidden(targetElement);
        targetElement.toggleClass('hiddenByOptimizer', !isHidden);
        targetElement.css('visibility', isHidden ? 'visible' : 'hidden');
        return targetElement.css('visibility');
    },
    _deleteChanges: function() {
        if (this.get('changedState')) {
            this.getTargetElement().css('visibility', this.get('initialState'));
            this.getTargetElement().removeClass('hiddenByOptimizer');
        }
    }
});
VisibilityOperation.isTargetElementHidden = function(targetElement) {
    return targetElement.css('visibility') == 'hidden' || targetElement.css('visibility') == 'collapse'
        || targetElement.hasClass('hiddenByOptimizer');
}