App.FilesController = Ember.ArrayController.extend({
    totalFileSize: function() {
        var total = 0;
        this.get('model').forEach(function(file) {
            total += file.get('rawSize');
        });
        return App.humanReadableFileSize(total);
    }.property('model.@each.rawSize'),
    
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
