var EditBackgroundImageOperation = ChangeBackgroundImageOperation.extend({
    complete: function() {
        var _this = this;
        //$.post('SERVER_API_URL', { imageUrl: this.get('changedState') }, function(data) {
        //    _this.apply(data);
            ChangeBackgroundImageOperation.prototype.complete.apply(_this);
        //});
    }
});