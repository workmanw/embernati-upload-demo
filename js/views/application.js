App.ApplicationView = Ember.View.extend({
    didInsertElement: function() {
        var appController = this.get('controller'),
            self = this;

        // This timer is a HUGE hack that hopefully doesn't bite.
        // We use it to ensure that when the mouse moves over the H2 element,
        // it doesn't cause the dropzone to close.
        var removeTimer = null;
        
        var dragDropEventHasFiles = function(evt) {
            try {
                return evt.dataTransfer.types.contains('Files');
            } catch(e) {}
            return false;
        };
    
        var addGlobalDropzone = function() {
            // If it's already in the DOM, just ensure it has the correct opacity
            if ($('#global-dropzone').length != 0) { 
                $('#global-dropzone').addClass('visible');
                return;
            }
             
            // Otherwise, add it.
            $('body').append('<div id="global-dropzone"><h2>Drop files to upload</h2></div>');
            $('#global-dropzone h2').on('dragover', function() {
                if(removeTimer) { Ember.run.cancel(removeTimer); }
                removeTimer = null;
            });
            $('#global-dropzone').on('click', function() { removeGlobalDropzone(); });
            
            // Create a timeout to make it visible
            setTimeout(function() {
                $('#global-dropzone').addClass('visible');
            }, 1);
        };
        
        var removeGlobalDropzone = function() {
            $('#global-dropzone').removeClass('visible');
        };
        
        $('body').on('dragover', function(evt) {
            if(dragDropEventHasFiles(evt)) {
                if(appController.get('allowFileDrop')) {
                    addGlobalDropzone();
                }
                
                // If it's a file drop, go a head and eat it to prevent navigation
                return false;
            }
        });
        
        $('body').on('dragleave', function(evt) {
            if(dragDropEventHasFiles(evt)) {            
                if(appController.get('allowFileDrop') && evt.target.id == 'global-dropzone') {
                    removeTimer = Ember.run.later(removeGlobalDropzone, 1);
                }

                // If it's a file drop, eat it to prevent navigation
                return false;
            }
        });
        
        $('body').on('drop', function(evt) {
            removeGlobalDropzone();
            
            if(dragDropEventHasFiles(evt)) {            
                if(appController.get('allowFileDrop')) {
                    appController.send('filesDropped', evt.dataTransfer);
                }
            
                // If it's a file drop, eat it to prevent navigation
                return false;
            }
        });
    }
});
