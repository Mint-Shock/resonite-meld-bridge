> [!hint] Permalink:
> https://mint-shock-digital-garden.vercel.app/Meld-Bridge
# Meld Bridge
A Node.js bridge for securely controlling [Meld Studio](https://meldstudio.co/) from within Resonite.

## Features
- Allows for a Secure and easy to use bidirectional connection between Resonite and Meld.
- Simplifies what Resonite receives and has to send to minimize slow [string] operations inside of Resonite.
- Adds message authentication using a secret key that has to be sent with every message from Resonite to the Bridge to ensure a more secure Connection.
	- Use at your own risk. More about security [here](#security-considerations).
- Currently supports the following features of Meld's API:

### Security considerations

> Resonite should NEVER be allowed to directly connect to Meld directly (ws://127.0.0.1:13376/) because Meld currently has no authentication and accepts everything that is a valid Message

-  This would in theory allow anyone in your current Resonite Session to gain (almost) full access to your Meld Studio instance. Including starting a stream without your permission.
- NEVER allow direct host access to: `ws://127.0.0.1:13376/` only ever accept `Meld Bridge address and port here` (or whatever address and port that is configured in config.json)
	- My MeldBridgeClient tries to ensure this during the setup wizard by propting them to refuse direct host access to Meld. Though sadly I can't check if it was actually declined or just ignored. But it's fine as long as it can't connect directly to Meld

## Getting Started
### Install and setup Meld studio
1. https://meldstudio.co/
2. Enable remote connections: 
	1. File>Preferences
	2. Advanced > `[X]` Allow remote connections

### Setup Meld Bridge
**WIP**
- Will likely be a executable file (.exe) that autostarts whenever you open Meld Studio and a config.JSON file where you can change settings like the secret key. 
- **NEVER use the standard Secret**


### Resonite
**WIP**
1. Use my premade Integration: "MeldBridgeClient"
	- You can find the newest version in my public folder under
	- `Mint Shock Public/Systems/Integrations/Meld Bridge`
	- `Comming soon`
2. Make your own by sending messages in the following format: 
*Calling Methods*
```
{
  "secret": "MySuperSecretKey123",
  "method": "toggleRecord"
}
```

*Methods with arguments*
```
{
  "secret": "MySuperSecretKey123",
  "method": "setStagedScene",
  "args": ["E9B25AD7242E540F5D2507237ACDAE37"]
}
```

*Subscribing to signals*
```
{
  WIP
  Currently only works for sessionChanged
}
```

*sendCommand*
```
{
  WIP
}
```

**please ensure that a user does not allow direct connections to Meld.** 
I do this by trying to connect directly. If that fails then everything is good. If it succeeds I prompt the user to Reset host access settings and try again. 
My "MeldBridgeClient" in specific does the following and I suggest you do the same: 
1. Try to connect to the Bridge. Ask for Host access permissions if not already given. 
2. On success try to connect to Meld directly. 
	1. The host access Message the user now sees has a clear Text prompting them to decline the direct connection
	2. If they refused direct connection then everything is fine. If they accepted it I will yell at the user to reset host access settings and try again. 


## Resources
[Meld API Documentation](https://meldstudio.co/docs/api/)
[Meld Studio's WebChannel API Documentation](https://github.com/MeldStudio/streamdeck/blob/main/WebChannelAPI.md)

## License
This project is licensed under the MIT License.


## ToDo
- [/] Bridge Program
	- [ ] make a executable file that autostarts with meld
	- [ ] don't let the user use the default key
	- [/] Forward Messages From *Resonite* to **Meld**
		- [/] Event Signals
			- [ ] gainUpdated
			- [x] sessionChanged
				- [x] Full object
				- [x] Difference to previous Object for better Parsing performance in Resonite
				- [ ] **Fix bug that First Full message Request Fails**
			- [ ] isStreamingChanged
			- [x] isRecordingChanged
		- Only SessionChanged and RecordingToggled are tested
		- [ ] Functions
			- Tested:
				- [ ] showScene
				- [ ] toggleMute
				- [ ] toggleMonitor 
				- [ ] toggleLayer
				- [ ] toggleEffect
				- [x] toggleRecord
				- [ ] toggleStream
				- [?] registerTrackObserver
				- [?] unregisterTrackObserver
				- [ ] setGain
				- [ ] sendCommand
					- [ ] screenshot
					- [ ] recordClip
					- [?] startStreamingAction
					- [?] stopStreamingAction
					- [?] toggleStreamingAction
					- [?] startRecordingAction
					- [?] stopRecordingAction
					- [?] toggleRecordingAction
					- [ ] toggleVirtualCameraAction
				- [x] showStagedScene
				- [ ] setProperty
					-  *note: setting "parent", "type", and "index" will have no effect.* 
	- [/] Forward Messages from **Meld** to *Resonite*
		- [/] Event Subscriptions
			- [x] Send Data back
			- [ ] All events should probably also have an index not just session Changed (for lost packet checking)

- [/] Backend in Resonite
	- [ ] don't let the user use the default key
	- [/] Parse Meld Object recieved from session Changed
		- [ ] **fix "Scen" bug (at the end of parsing Script)**
		- Writing this should either not happen on a diff (only on full objects) or not break if the "type" attribute is the last attribute
		- [ ] Write Result into Slots with Dynvars
	- [ ] Handle missed packets using the index
- [/] Make ingame Ui
	- Display the state of Meld inside of Resonite
	- [ ] Provide Status on what is happening in Meld
		- [x] Connection Status to bridge
		- [ ] Mute State of specific (promoted) microphone inputs
			- [ ] make toggle in inspector for Tracks
	- [ ] Framework to display a list of Elements
		- [x] Double click to select
		- [ ] Use data from Dynvars for display
		- [ ] Send events to Meld if a button in the Ui was pressed
			- Don't update in Resonite directly. Wait on Response from Meld.
		- [/] Dynamically generate Ui for inspecting Elements based on their Type
			- [ ] Dictionary what Element Type needs what Ui Elements in the inspector
				- Description
				- Data Type
					- [/] String Short
					- [ ] String Long `Debug`
					- [/] Bool
					- [ ] dateTime `Debug`
					- [ ] float
			- [ ] make most of these editable from Ui and have button to send update to meld
			- [ ] make generator to make permanent Facets out of specific settings for facet anchors
	- [ ] Tabs:
		- [ ] Scenes
		- [ ] Layers
		- [ ] Tracks
		- [ ] Effects
		- [ ] Settings
		- [ ] Plugins
		- [ ] Debug
			- [x] Display all incoming messages
			- [ ] Display outgoing Messages
			- [?] Filter options
			- [ ] Ability to "replay" specific messages
			- [ ] 