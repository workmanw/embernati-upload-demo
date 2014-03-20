App.FilesController = Ember.ArrayController.extend({
    uploadedLog: [],
    
    totalFileSize: function() {
        var total = 0;
        this.get('model').forEach(function(file) {
            total += file.get('rawSize');
        });
        return App.humanReadableFileSize(total);
    }.property('model.@each.rawSize'),
    
    hasUploads: function() {
        return this.get('length') > 0;
    }.property('length'),
    
    hasCompleted: function() {
        return !!this.get('model').findProperty('didUpload');
    }.property('model.@each.didUpload'),
    
    actions: {
        removeFile: function(file) {
            this.get('model').removeObject(file);
        },
        
        removeCompleted: function() {
            var completed = this.get('model').filterProperty('didUpload');
            this.get('model').removeObjects(completed);
        },
        
        uploadFile: function(file) {
            var uploadedLog = this.get('uploadedLog');
            file.uploadFile().then(function(url) {
                uploadedLog.pushObject(url);
            });
        },
        
        uploadAll: function() {
            var uploadedLog = this.get('uploadedLog');
            this.get('model').forEach(function(item) {
                item.uploadFile().then(function(url) {
                    uploadedLog.pushObject(url);
                });
            });
        }
    }
});
