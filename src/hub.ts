import { ComClient } from './comclient';

export function ready()
{
	let root = document.getElementById( "root" );
	if( root )
	{
		root.textContent = "Fnord hub3";
	}	

	let clientLink = document.getElementById( "client_link" ) as HTMLAnchorElement;
	if( clientLink )
	{
		clientLink.href += "?poison=" + Date.now();
	}	

	ComClient.instance.setOnTrack( ( e ) =>
	{
		let vid = document.getElementById( "incoming_video" ) as HTMLVideoElement;
		if( vid )
		{
			vid.srcObject = e.streams[0];
			vid.play();
		}	
	
	});
}

ready();