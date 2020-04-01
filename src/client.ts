import { ComClient } from './comclient';


export function ready()
{
	let clientRoot = document.getElementById( "root" );
	if( clientRoot )
		clientRoot.textContent = "Fnord client";

	ComClient.instance.sendMessage( { "type": "hello" } );

	ComClient.instance.initRtc();
}

ready();