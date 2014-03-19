
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
    
    // {Property} If a file is currently being uploaded
    isUploading: false,
    
    // {Property} Upload progress 0-100 
    uploadProgress: null,
    
    // ..........................................................
    // Callbacks from the transport layer
    //
    // {Function} Did start uploading
    didStartUpload: function() {
        this.set('isUploading', true);
    },
    
    // {Function} Did error on upload
    didErrorUpload: function(errMsg) {
        this.set('isUploading', false);
        this.get('uploadPromise').reject(errMsg);
    },
    
    // {Function} Did complete the upload process succesfully
    didCompleteUpload: function(result) {
        this.set('isUploading', false);
        this.get('uploadPromise').resolve(result);
    } 
});

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
