import { ComClient } from './comclient';


export function ready()
{
	let clientRoot = document.getElementById( "root" );
	if( clientRoot )
		clientRoot.textContent = "Fnord client";

	let startButton = document.getElementById( "start" );
	startButton?.addEventListener( "click", async () =>
	{
		await ComClient.instance.initRtc();
		let thisTabMedia = ( await (navigator.mediaDevices as any).getDisplayMedia() ) as MediaStream;
		console.log( "my media stream", thisTabMedia );
		ComClient.instance.addStream( thisTabMedia );

	} );

	ComClient.instance.sendMessage( { "type": "hello" } );

}

ready();