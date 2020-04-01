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

	ComClient.instance;
}

ready();