App.FilesRoute = Ember.Route.extend({
    allowFileDrop: true,
    
    model: function() {
        return [];
    },
    
    actions: {
        filesDropped: function(files) {
            var model = this.controller.get('model');
            for(var i = 0; i < files.files.length; i++) {
                var fileUploadModel = App.FileUploadModel.create({ fileToUpload: files.files[i] });
                model.pushObject(fileUploadModel);
            }
        }
    }
});
