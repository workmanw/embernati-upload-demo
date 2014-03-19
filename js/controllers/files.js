App.FilesController = Ember.ArrayController.extend({
    actions: {
        removeFile: function(file) {
            this.get('model').removeObject(file);
        }
    }
});
