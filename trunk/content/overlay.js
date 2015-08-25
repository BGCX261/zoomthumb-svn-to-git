// ZoomThumb
// Flickr Uploadr Extension
// Francisco Cabrita
// 2009-09-02

var ZoomThumb = {

	Settings: {
		ThumbSize: 200
	},
	//theFileSystem: undefined,

	//-----------------------------------------------------------------------
	// Convenient Console Logging function
	//-----------------------------------------------------------------------
	Log: function( m )
	{
		Cc['@mozilla.org/consoleservice;1'].getService(Ci.nsIConsoleService)
		.logStringMessage( m );	
	},
	
	//-----------------------------------------------------------------------
	// Writes the settings file
	//-----------------------------------------------------------------------
	WriteSettings: function()
	{
		file.write( 'zoomthumb.json', this.Settings );
	},
	
	//-----------------------------------------------------------------------
	// Hide the standard interface content, and show the original photo.
	// Fit the photo in the window
	//-----------------------------------------------------------------------
	Do: function( e )
	{
		var toDisplay;
		
		var photoSelIndex = photos.selected[0];

		var p = photos.list[ photoSelIndex ];
		
		//--- Only authorize Zoom for photos 
		if( photos.is_photo(p.path) ) 
		{
			//--- Hide some elements
			var ps = document.getElementById('page_photos');
			var psPrevDispStyle = ps.style.display;
			ps.style.display = "none";
			
			var hd = document.getElementById('head');
			var hdPrevDispStyle = hd.style.display;
			hd.style.display = "none";
		
			ps.parentNode.setAttribute('style', 'display: inline-block; background: black;');
			
			//--- Create the quick preview image element
			///// Note: Don't know why we have to add a hbox here with namespace NULL
			///// but if we don't the width of img is always 100%
			var quickPreviewImg = document.createElementNS(NS_HTML, 'img');
			quickPreviewImg.src = "file://" + p.path;

			//--- Set size to fit on window
			var boxWidth = ps.parentNode.boxObject.width;
			var boxHeight = ps.parentNode.boxObject.height;
			var docSizeRatio = boxWidth / boxHeight;
			var imgRatio = p.width / p.height;
			//ZoomThumb.Log( '' + p.width );
			if( docSizeRatio < imgRatio ){
				quickPreviewImg.width = boxWidth;
				quickPreviewImg.height = quickPreviewImg.width / imgRatio;
			} else {
				quickPreviewImg.width = boxHeight * imgRatio;
				quickPreviewImg.height = boxHeight;
			}
			quickPreviewImg.style.position = 'relative';
			quickPreviewImg.style.left = ''+(boxWidth-quickPreviewImg.width)/2+'px';
			quickPreviewImg.style.top = ''+(boxHeight-quickPreviewImg.height)/2+'px';

			ps.parentNode.appendChild( quickPreviewImg );

			//quickPreviewImg.style.display = "none";
			//setTimeout( function() { quickPreviewImg.style.display = "block";}, 300 );
			
			ps.parentNode.addEventListener('click', 
			
			function( e )
			{
				//--- Restore everything we hidded before
				ps.parentNode.removeChild( quickPreviewImg );
				ps.style.display = psPrevDispStyle;
				hd.style.display = hdPrevDispStyle;
				this.removeEventListener( 'click', arguments.callee, false );
				ps.parentNode.removeAttribute('style');
				
			}, false);
			
		}
	}
}

//-----------------------------------------------------------------------
// After add: called after a group of photos are added to Uploadr.
//   Callback argument: array of Photo objects
//   See also: photos.js
//-----------------------------------------------------------------------
extension.after_add.add( function(list) {
	
	///// Note: this callback is called once after a drag'n drop of several photos,
	///// but it is called several times when flickr is launch with a previous list
	///// of photos not yet uploaded... In our case this ain't an issue (well it can
	///// give bad performance result if there's a lot of photos).
	
	//--- Change the style initially defined for the photo grid
	block_normalize();
	var li = document.getElementById('photos_list')
		.getElementsByTagName('li');
	
	var ii = li.length;
	for( var i=0 ; i<ii ; ++i ){
		li[i].style.width = "" + conf.thumb_size + "px";
		li[i].style.height = li[i].style.width;
	}
	unblock_normalize();
	
	//--- Call the 'photo quick preview' when user double click on a thumbnail 
	var photosBox = document.getElementById('photos');
	photosBox.removeEventListener( 'dblclick', ZoomThumb.Do, false );
	photosBox.addEventListener( 'dblclick', ZoomThumb.Do, false );
	
} );


var fileTestZoomThumb = Cc['@mozilla.org/file/directory_service;1']
				.getService(Ci.nsIProperties).get('ProfD', Ci.nsIFile);
		fileTestZoomThumb.append( 'zoomthumb.json' );
			
//--- Create the settings' file if it doesn't exist
if( !fileTestZoomThumb.exists() )
{
	WriteSettings();
} 

//--- Read the settings' file
ZoomThumb.Settings = file.read( 'zoomthumb.json' );

//--- Change initial thumb size with ours
conf.thumb_size = ZoomThumb.Settings.ThumbSize;

