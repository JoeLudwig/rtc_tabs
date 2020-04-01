import { ComClient } from './comclient';

export function ready()
{
	let root = document.getElementById( "root" );
	if( root )
	{
		root.textContent = "Fnord hub3";
	}	

	ComClient.instance;
}

ready();