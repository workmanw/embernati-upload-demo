
App.FileUploadModel = Ember.Object.extend({
    init: function() {
        this._super();
        this.set('uploadPromise', Ember.Deferred.create());
        this.set('name', this.get('fileName'));
    },
    
    // ...........................................
    // Form Properties
    name: '',
    
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

    // {Property} Raw file name (from the disk)
    fileName: function() {
        var fileToUpload = this.get('fileToUpload');
        if(!Ember.isNone(fileToUpload)) {
            return fileToUpload.name;
        }
        
        return "";
    }.property('fileToUpload'),
    
    // {Property} Produces a display label with the file's raw name and it's size (if possible)
    displayFileLabel: function() {
        var fileName = this.get('fileName'),
            fileToUpload = this.get('fileToUpload'),
            label = fileName;
        
        // File size
        if(!Em.isNone(fileToUpload) && !Em.isNone(fileToUpload.size)) {
            var readableSize = BC.utils.humanReadableFileSize(fileToUpload.size);
            label += " (%@)".fmt(readableSize);
        }

        return label || "No file chosen";
    }.property('fileName', 'fileToUpload'),
    
    // {Function} Populates this file for uploading
    populateFileToUpload: function(fileOrForm) {
        this.set('fileToUpload', fileOrForm);
        this.set('name', this.get('fileName'));
    },
    
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
