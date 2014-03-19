App.FilesController = Ember.ArrayController.extend({
    actions: {
        removeFile: function(file) {
            this.get('model').removeObject(file);
        },
        
        removeCompleted: function() {
            var completed = this.get('model').filterProperty('didUpload');
            this.get('model').removeObjects(completed);
        },
        
        uploadAll: function() {
            this.get('model').forEach(function(item) {
                item.uploadFile();
            });
        }
    }
});
