// From https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob, needed for Safari:
if (!HTMLCanvasElement.prototype.toBlob) {
    Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
        value: function(callback, type, quality) {

            var binStr = atob(this.toDataURL(type, quality).split(',')[1]),
                len = binStr.length,
                arr = new Uint8Array(len);

            for (var i = 0; i < len; i++) {
                arr[i] = binStr.charCodeAt(i);
            }

            callback(new Blob([arr], {type: type || 'image/png'}));
        }
    });
}

window.URL = window.URL || window.webkitURL;


class PhotoPrepare {
    /*
    Will prepare a photo file for uploading.

    This involves, checking if the file is an image type and if it is above
    a certain size then it will also reduce the size.


    Inputs:
        * input_div_name <str> => The name of the input div that uploads the photo
    */
    constructor(input_div_name, max_size) {
        // Set the max size optional argument
        if (!max_size) {
            this.max_size = 500 * 1024  // 500 kb
        } else {
            this.max_size = max_size;
        }

        if (!input_div_name) { throw "'input_div_name' is a required argument"; }

        this.input_div_name = input_div_name;
        this.input_div = document.getElementById(input_div_name);
        if (!this.input_div) { throw "div '"+this.input_div_name+"' doesn't exist"; }
        this.exit_code = 0;
        this.input_files = this.input_div.files;

        this.file = this.check_files_length();
        this.file_type, this.file_format = this.check_file_type();
        this.compress_and_rotate(this.file, this.max_size, 1000, Infinity, 0.9, this.set_new_file);
    }

    set_new_file(blob, self) { self.new_file = blob; }

    /*
    Will check we only have 1 image to upload.

    If we don't then we throw error.

    Outputs:
        * file <obj> => the file to be uploaded.
    */
    check_files_length() {
        if (this.input_files.length == 0) {
            this.exit_code = 1;
            throw "No File";
        } else if (this.input_files.length > 1) {
            this.exit_code = 2;
            throw this.input_files.length.toString() + " files! The photo class only works with 1.";
        }
        return this.input_files[0];
    }

    /*
    We only want to accept images.

    If we don't have an image we throw an error.
    */
    check_file_type() {
        var splitter = this.file.type.split("/");
        if (splitter.length != 2){
            console.log("File type = ", this.file.type);
            this.exit_code = 3;
            throw "File type error!";
        }

        var file_type = splitter[0];
        var file_format = splitter[1];

        if (file_type != "image") {
            this.exit_code = 4;
            throw "Not an image.\nType = " + file_type + "\nFormat = " + file_format;
        }
        return file_type, file_format;
    }

    /*
    The below code was taken from https://stackoverflow.com/questions/14672746/how-to-compress-an-image-via-javascript-in-the-browser
    */

    // Modified from https://stackoverflow.com/a/32490603, cc by-sa 3.0
    // -2 = not jpeg, -1 = no data, 1..8 = orientations
    get_exif_orientation(file, callback) {
        // Suggestion from http://code.flickr.net/2012/06/01/parsing-exif-client-side-using-javascript-2/:
        // optimise things by only looking at the first 128kB
        if (file.slice) {
            file = file.slice(0, 131072);
        } else if (file.webkitSlice) {
            file = file.webkitSlice(0, 131072);
        }

        var reader = new FileReader();
        reader.onload = function(e) {
            var view = new DataView(e.target.result);
            if (view.getUint16(0, false) != 0xFFD8) {
                callback(-2);
                return;
            }
            var length = view.byteLength, offset = 2;
            while (offset < length) {
                var marker = view.getUint16(offset, false);
                offset += 2;
                if (marker == 0xFFE1) {
                    if (view.getUint32(offset += 2, false) != 0x45786966) {
                        callback(-1);
                        return;
                    }
                    var little = view.getUint16(offset += 6, false) == 0x4949;
                    offset += view.getUint32(offset + 4, little);
                    var tags = view.getUint16(offset, little);
                    offset += 2;
                    for (var i = 0; i < tags; i++)
                        if (view.getUint16(offset + (i * 12), little) == 0x0112) {
                            callback(view.getUint16(offset + (i * 12) + 8, little));
                            return;
                        }
                }
                else if ((marker & 0xFF00) != 0xFF00) break;
                else offset += view.getUint16(offset, false);
            }
            callback(-1);
        };
        reader.readAsArrayBuffer(file);
    }

    // Derived from https://stackoverflow.com/a/40867559, cc by-sa
    img_to_canvas_with_orientation(img, rawWidth, rawHeight, orientation) {
        var canvas = document.createElement('canvas');
        if (orientation > 4) {
            canvas.width = rawHeight;
            canvas.height = rawWidth;
        } else {
            canvas.width = rawWidth;
            canvas.height = rawHeight;
        }

        if (orientation > 1) {
            console.log("EXIF orientation = " + orientation + ", rotating picture");
        }

        var ctx = canvas.getContext('2d');
        switch (orientation) {
            case 2: ctx.transform(-1, 0, 0, 1, rawWidth, 0); break;
            case 3: ctx.transform(-1, 0, 0, -1, rawWidth, rawHeight); break;
            case 4: ctx.transform(1, 0, 0, -1, 0, rawHeight); break;
            case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
            case 6: ctx.transform(0, 1, -1, 0, rawHeight, 0); break;
            case 7: ctx.transform(0, -1, -1, 0, rawHeight, rawWidth); break;
            case 8: ctx.transform(0, -1, 1, 0, 0, rawWidth); break;
        }
        ctx.drawImage(img, 0, 0, rawWidth, rawHeight);
        return canvas;
    }

    /*
    Will compress an image and correct its rotation according to it's exif data.

    Will use a html blob object. Does work for IE but who cares about IE?

    Inputs:
        * file <obj> => file object
        * acceptFileSize <float> => The max file size
        * maxWidth <float> => The max width of the image
        * maxHeight <float> => The max height of the image
        * quality <float> => The quality of the jpeg compression
        * callback <func> => A function to complete after the image has been compressed.
    */
    compress_and_rotate(file, acceptFileSize, maxWidth, maxHeight, quality, callback) {
        var self = this;

        if (file.size <= acceptFileSize) {
            callback(file, self);
            return;
        }
        var img = new Image();
        img.onerror = function() {
            URL.revokeObjectURL(this.src);
            callback(file, self);
        };
        img.onload = function() {
            URL.revokeObjectURL(this.src);
            self.get_exif_orientation(file, function(orientation) {
                var w = img.width, h = img.height;
                var scale = (orientation > 4 ?
                    Math.min(maxHeight / w, maxWidth / h, 1) :
                    Math.min(maxWidth / w, maxHeight / h, 1));
                h = Math.round(h * scale);
                w = Math.round(w * scale);

                var canvas = self.img_to_canvas_with_orientation(img, w, h, orientation);
                canvas.toBlob(function(blob) {
                    console.log("Resized image to " + w + "x" + h + ", " + (blob.size >> 10) + "kB");
                    callback(blob, self);
                }, 'image/jpeg', quality);
            });
        };
        img.src = URL.createObjectURL(file);
        return img;
    }
}