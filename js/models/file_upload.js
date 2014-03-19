
App.FileUploadModel = Ember.Object.extend({
    init: function() {
        this._super();
        Ember.assert("File to upload required on init.", !!this.get('fileToUpload'));
        this.set('uploadPromise', Ember.Deferred.create());
    },

    readFile: function() {
        var self = this;
        var fileToUpload = this.get('fileToUpload');
        var isImage = fileToUpload.type.indexOf('image') === 0;
        
        this.set('name', fileToUpload.name);
        this.set('size', App.humanReadableFileSize(fileToUpload.size));
        
        // Don't read anything bigger than 5 MB
        if(isImage && fileToUpload.size < 1*1024*1024) {
            this.set('isDisplayableImage', isImage);
            
            // Create a reader and read the file.
            var reader = new FileReader();
            reader.onload = function(e) {
                self.set('base64Image', e.target.result);
            };

            // Read in the image file as a data URL.
            reader.readAsDataURL(fileToUpload);
        }
    }.on('init'),

    // ...........................................
    // Name is used for the upload property
    name: '',
    
    // {Property} Human readable size of the selected file
    size: 0,
    
    // {Property} Indicates if this file is an image we can display
    isDisplayableImage: false,
    
    // {Property} String representation of the file
    base64Image: '',
    
    // {Property} Will be an HTML5 File
    fileToUpload: null,
    
    // {Property} Will be a $.ajax jqXHR 
    uploadJqXHR: null,
    
    // {Property} Promise for when a file was uploaded
    uploadPromise: null,
    
    // {Property} Upload progress 0-100 
    uploadProgress: null,
    
    // {Property} If a file is currently being uploaded
    isUploading: false,
    
    // {Property} If the file was uploaded successfully
    didUpload: false,
    
    // ..........................................................
    // Actually do something!
    //    
    uploadFile: function() {
        var fileToUpload = this.get('fileToUpload');
        var name = this.get('name');
        var key = "public-uploads/" + (new Date).getTime() + '-' + name;
        var fd = new FormData();
        var self = this;
        
        fd.append('key', key);
        fd.append('acl', 'public-read-write'); 
        fd.append('success_action_status', '201');
        fd.append('Content-Type', fileToUpload.type);      
        fd.append('file', fileToUpload);

        this.set('isUploading', true);

        $.ajax({
            url: 'http://embernati-demo.s3.amazonaws.com/',
            type: "POST",
            data: fd,
            processData: false,
            contentType: false,
            xhr: function() {
                var xhr = $.ajaxSettings.xhr() ;
                // set the onprogress event handler
                xhr.upload.onprogress = function(evt) { 
                    self.set('progress', (evt.loaded/evt.total*100));
                };
                return xhr ;
            }
        }).done(function(data, textStatus, jqXHR) {
            var value = "";
            try {
                value = data.getElementsByTagName('Location')[0].textContent;
            } catch(e) { }
            self.set('isUploading', false);
            self.set('didUpload', true);
            self.get('uploadPromise').resolve(value);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            self.set('isUploading', false);
            self.get('uploadPromise').reject(errorThrown);
        });
    },
    
    // ..........................................................
    // Progress support, this belongs in a component. Ran out of time.
    // 
    showProgressBar: Ember.computed.or('isUploading', 'didUpload'),

    progressStyle: function() {
        return 'width: %@%'.fmt(this.get('progress'));
    }.property('progress')
});

// Helper to build human readible file size strings.
App.humanReadableFileSize = function(size) {
    var label = "";
    if(size && !isNaN(size)) {
        var fileSizeInBytes = size;
        var i = -1;
        do {
            fileSizeInBytes = fileSizeInBytes / 1024;
            i++;
        } while (fileSizeInBytes > 1024);

        var byteUnits = [' KB', ' MB', ' GB', ' TB', ' PB', ' EB', ' ZB', ' YB'];
        label += Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
    }
    return label;
};
