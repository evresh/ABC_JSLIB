var TestPage = Backbone.Model.extend({
    _selectedTargetCount: 0,
    defaults: {
        pageUrl: '',
        targetData: false
    },
    selectTarget: function(target) {
        this._selectedTargetCount++;
        this.set('targetData', { _uniqueId: this._selectedTargetCount,  target: target.get(0) });
    }
})