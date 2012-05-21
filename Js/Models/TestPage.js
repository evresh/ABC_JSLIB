var TestPage = Backbone.Model.extend({
    _selectedTargetCount: 0,
    defaults: {
        pageUrl: '',
        targetEvent: false
    },
    selectTarget: function(target) {
        this._selectedTargetCount++;
        this.set('targetEvent', { _uniqueId: this._selectedTargetCount,  target: target.get(0) });
    }
})