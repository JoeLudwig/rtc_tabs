import { bind } from 'bind-decorator';

interface ComClientMessage
{
	type: string;
}

interface MWaitingForConnection extends ComClientMessage
{
	sdp: string;
}

interface MIceCandidate extends ComClientMessage
{
	candidate: string;
}

export class ComClient
{
	private static globalInstance: ComClient;
	private broadcastChannel: BroadcastChannel;
	private peerConnection: RTCPeerConnection;
	private isServer = false;
	private dataChannel: RTCDataChannel|null = null;

	public static get instance(): ComClient
	{
		if( !ComClient.globalInstance )
		{
			ComClient.globalInstance = new ComClient;
		}
		return ComClient.globalInstance;
	}

	constructor()
	{
		this.broadcastChannel = new BroadcastChannel( "rtc_test" );
		this.broadcastChannel.onmessage = this.onMessage;
		this.peerConnection = new RTCPeerConnection();
		this.peerConnection.onicecandidate = ( e ) =>
		{
			console.log( "onicecandidate", e.candidate );
			this.sendMessage( 
				{
					type: "ice_candidate",
					candidate: JSON.stringify( e.candidate ),
				} );
		}

		this.peerConnection.onnegotiationneeded = async ( e ) =>
		{
			console.log( "onnegotiationneeded" );
			let offer = await this.peerConnection.createOffer();
			await this.peerConnection.setLocalDescription( offer );
			this.sendMessage(
				{
					type: "waiting_for_connection",
					sdp: JSON.stringify( this.peerConnection.localDescription ),
				} );
		}
	}

	@bind
	private async onMessage( e: MessageEvent )
	{
		let m = e.data as ComClientMessage;
		console.log( "message received", m );
		switch( m.type )
		{
			case "waiting_for_connection":
			{
				console.log( "waiting_for_connection received" );
				let msg = m as MWaitingForConnection;
				let sdp = JSON.parse( msg.sdp );
				await this.peerConnection.setRemoteDescription( sdp );
				if( this.peerConnection.signalingState != "stable" )
				{
					let answer = await this.peerConnection.createAnswer();
					await this.peerConnection.setLocalDescription( answer );
					this.sendMessage(
						{
							type: "waiting_for_connection",
							sdp: JSON.stringify( this.peerConnection.localDescription ),
						} );
				}
			}
			break;

			case "ice_candidate":
			{	
				let msg = m as MIceCandidate;
				let candidate = JSON.parse( msg.candidate );
				console.log( "ice_candidate received", candidate );
				try
				{
					await this.peerConnection.addIceCandidate( candidate );	
				}
				catch( e )
				{
					// Chrome throws an erroneous error on the null candidate
					if( candidate )
					{
						throw e;
					}
				}
			}
			break;
		}
	}

	public sendMessage( m: object )
	{
		this.broadcastChannel.postMessage( m );
	}

	public acceptIncomingConnections()
	{
		this.isServer = true;
	}

	public async initRtc()
	{
		console.log( "initRtc" );
		this.dataChannel = this.peerConnection.createDataChannel( "data" );
	}

	public async addStream( stream: MediaStream )
	{
		for( let track of stream.getVideoTracks() )
		{
			this.peerConnection.addTrack( track, stream );
		}
	}

	public setOnTrack( fn: ( e: RTCTrackEvent ) => void )
	{
		this.peerConnection.ontrack = fn;
	}
}
