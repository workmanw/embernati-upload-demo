App = Ember.Application.create();

Ember.Route.reopen({
    allowFileDrop: false,
    
    activate: function() {
        this._super();
        if(this.get('allowFileDrop')) {
            this.controllerFor('application').incrementProperty('allowFileDrop');
        }
    },
    
    deactivate: function() {
        this._super();
        if(this.get('allowFileDrop')) {
            this.controllerFor('application').decrementProperty('allowFileDrop');
        }
    }
});

App.Router.map(function() {
    this.route("files", { path: "/files" });
});

App.IndexRoute = Ember.Route.extend({
    beforeModel: function() {
        this.transitionTo('files');
    }
});

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

App.FilesController = Ember.ArrayController.extend({
    actions: {
        removeFile: function(file) {
            this.get('model').removeObject(file);
        }
    }
});
