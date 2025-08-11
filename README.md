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

## Getting Started
### Install and setup Meld studio
1. https://meldstudio.co/
2. Enable remote connections
	1. File>Preferences
	2. Advanced > `[X]` Allow remote connections

### Setup Meld Bridge
coming soon
### Resonite
Use my premade Integrations

Make your own by sending messages in the following format
```
{`
  `"secret": "MySuperSecretKey123",`
  `"method": "toggleRecord"`
`}
```

## License
This project is licensed under the MIT License.