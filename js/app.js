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
    
    actions: {
        filesDropped: function(files) {
            debugger;
        }
    }
});

App.FilesController = Ember.Controller.extend({
    
});
