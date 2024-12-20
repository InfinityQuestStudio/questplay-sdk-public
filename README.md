# QuestPlay SDK

## Description
QuestPlay SDK is a lightweight JavaScript SDK designed to seamlessly embed and manage game experiences in your web application. It handles game initialization, secure token generation, iframe embedding, and event handling, making it easier to integrate our games into any website or platform.


## Features
- **Easy Initialization:** Quickly set up with a few configuration options.
- **Secure Token Management:** Generates secure tokens for game access.
- **Game Embedding:** Embeds games using an iframe within a specified container.
- **Event Handling:** Supports event-driven interactions with custom callbacks.
- **Customizable:** Extendable to include additional features like API communication.


## Installation
### Using a Script Tag
Include the SDK in your project by adding the following script tag:

```javascript
<script src="https://cdn.jsdelivr.net/gh/InfinityQuestStudio/questplay-sdk-public@[version]/dist/questplay-sdk.js"></script>
```
The SDK will be available globally as window.QuestPlaySDK.


## Usage
### Initialization
To initialize the SDK on your website, use the init method with the required configuration options:

```javascript
const options = {
  apiKey: "",
  apiSecret: "",
  gameId: "",
  userUrl: "",
  webhook: "",
  gameServer: "",
  containerId: "",
};

QuestPlaySDK.init(options);
```

### Parameters:

**options:** An object containing:

- **apiKey:** Your API key (string, required).
- **apiSecret:** Your API secret (string, required).
- **gameId:** The ID of the game to embed (string, required).
- **userUrl:** API url of user data to fetch balance etc (must be accompained with user id).
- **webhook:** Webhook callback url to send data to the server example: win/lose state.
- **gameServer:** QuestPlay game server.
- **containerId:** The ID of the HTML container element for the game iframe (string).

Returns a promise that resolves when the SDK is successfully initialized.


## Embedding a Game
The SDK automatically embeds the game into the specified container using the provided gameId.


## Event Handling
You can listen to SDK events using the on method:

```javascript
QuestPlaySDK.on("initializedEvent", () => {
  console.log("Game SDK is fully initialized!");
});
```


## Methods

```javascript
init(options)
```
Initializes the SDK with the required configuration.