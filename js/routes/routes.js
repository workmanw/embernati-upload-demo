// Reopen the route class to provide an implementation for file support declaration.
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
