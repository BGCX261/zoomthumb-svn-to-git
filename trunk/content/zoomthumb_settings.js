// ZoomThumb
// Flickr Uploadr Extension
// Francisco Cabrita
// 2009-09-02

var ZoomThumb_Settings = {
	//-----------------------------------------------------------------------
	// Called when settings dialog opens
	//-----------------------------------------------------------------------
	theZoomThumb: undefined,
	//theUserSettings: undefined,
	
	Load: function()
	{
		theZoomThumb = window.arguments[0];

		document.getElementById('thumb_size').value = theZoomThumb.Settings.ThumbSize;
		//theZoomThumb.Log( 'Thumb Size = ' + theZoomThumb.ThumbSize );
	},

	//-----------------------------------------------------------------------
	// Called when Ok button is pressed in the settings dialog
	//-----------------------------------------------------------------------
	Accept: function()
	{
		theZoomThumb.Settings.ThumbSize = document.getElementById('thumb_size').value;
		theZoomThumb.WriteSettings( document.getElementById('thumb_size').value );
	},

	//-----------------------------------------------------------------------
	// Called when Cancel button is pressed in the settings dialog
	//-----------------------------------------------------------------------
	Cancel: function()
	{
		//theZoomThumb.Log( 'Cancel' );
	}
	
}
