# Meld Bridge
A Node.js bridge for securely controlling [Meld Studio](https://meldstudio.co/) from within Resonite.

## Features
- Allows for a Secure and easy to use bidirectional connection between Resonite and Meld.
- Simplifies what Resonite receives and has to send to minimize slow [string] operations inside of Resonite.
- Adds message authentication using a secret key that has to be sent with every message from Resonite to the Bridge to ensure a more secure Connection.
	- Use at your own risk. More about security [here](#security-considerations).
- Currently supports the following features of Meld's API:

### Security considerations

> [!important]+ Important!
> Resonite should NEVER be allowed to directly connect to Meld directly (ws://127.0.0.1:13376/) because Meld currently has no authentication and accepts everything that is a valid Message

-  This would in theory allow anyone in your current Resonite Session to gain (almost) full access to your Meld Studio instance. Including starting a stream without your permission.

  

## Getting Started

  

1. **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/Bride-node_js.git
    cd Bride-node_js
    ```

  

2. **Install dependencies:**

    ```bash

    npm install

    ```

  

3. **Run the bridge:**

    ```bash

    npm start

    ```

  

## Usage

  

Import and use the bridge in your Node.js project:

  

```js

const meldBridge = require('meld-bridge');

// Your code here

```

  

## Contributing

  

Contributions are welcome! Please open issues or submit pull requests.

  

## License

  

This project is licensed under the MIT License.