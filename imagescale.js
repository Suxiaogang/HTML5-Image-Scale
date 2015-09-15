/**
 * pure HTML5 image scale
 */

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var MAX_WIDTH = 1200;

function loadAndDraw(imgFile, quality){
	img = new Image();
	img.src = imgFile.result;

	canvas.width = MAX_WIDTH;
	canvas.height =  (img.naturalHeight/img.naturalWidth) * MAX_WIDTH;

	var hRatio = canvas.width  / img.width    ;
	var vRatio =  canvas.height / img.height  ;
	var ratio  = Math.min ( hRatio, vRatio );
	var centerShift_x = ( canvas.width - img.width*ratio ) / 2;
	var centerShift_y = ( canvas.height - img.height*ratio ) / 2;  
	ctx.clearRect(0,0,canvas.width, canvas.height);
	ctx.drawImage(img, 0,0, img.width, img.height, centerShift_x,centerShift_y,img.width*ratio, img.height*ratio);

	var mimeType = "image/jpeg";
	var newImageData = canvas.toDataURL(mimeType, quality);
	return newImageData;
}

$(document).ready(function(){

	$(".clicker").click(function () {
		$('#input').trigger('click');
	});

	$('#input').change(function(){
        event.preventDefault();
		var filesToUpload = document.getElementById('input').files;
		var file = filesToUpload[0];
		if(!/image\/\w+/.test(file.type) || file == "undefined"){
			swal("ERROR", "file must be a image file!", "error");
			return false;
		}
		previewAndUpload(file);
    });

	function previewAndUpload(file) {
		$(".loader-wrap").show();
		var reader = new FileReader();
		var imgFile;
		reader.readAsDataURL(file);
		reader.onload = function(e){
			$('.clicker').prop('src', '');
			$('.clicker').css('background-image', 'url('+ this.result+')');
			$('.clicker').css('background-position', 'center');
			var i = document.createElement("p");
			var r = e.target.result.split(";");
			r = r[0].split("/");
			r = r[1].split("+");
			r = r[0].toUpperCase();
			i.innerHTML = "<br />This is a <b>" + r + "</b> image, size of <b>" + (e.total / 1024).toFixed(2) + "</b> KB.";
			$('.hint').html(i);
		};
		reader.onloadend = function(e) {
			setTimeout(function() {
				$(".loader-wrap").fadeOut('fast');
			}, 500);

			imgFile = e.target;
			var imgscr = loadAndDraw(imgFile, 95);
			$('#scaledImg').prop('src', imgscr);
			$('#newImageTitle').css('display', 'block');
		};
	}
});