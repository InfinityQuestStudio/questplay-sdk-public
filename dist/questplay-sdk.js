/*!
 * QuestPlay SDK v1.0.0
 * (c) 2024 IQS Gaming Ltd
 * All rights reserved.
 *
 * Description:
 * QuestPlay SDK is a lightweight JavaScript library designed to integrate our games 
 * with external platforms through iframes. It provides robust utilities for initializing 
 * games, handling secure communication between the host and game iframe, and interacting 
 * with APIs for fetching user data, managing game configurations, and posting game results.
 *
 * Licensing:
 * This software is proprietary and intended for use with iQS Gaming Ltd products only.
 * Redistribution or modification without prior consent from iQS Gaming Ltd is prohibited.
 *
 * Contact:
 * For inquiries, contact support@iqsgaming.com or visit https://www.iqsgaming.com
 */

(function (window) {
  class QuestPlaySDK {
    constructor() {
      this.apiKey = null;
      this.apiSecret = null;
      this.gameId = null;
      this.containerId = null;
      this.userUrl = null;
      this.webhook = null;
      this.events = {};
      this.iframe = null;
      this.version = "1.0.0";
    }


    /**
     * Initialize the SDK with required options.
     */
    init(options) {
      return new Promise((resolve, reject) => {
        try {
          this.validateOptions(options);
          this.storeOptions(options);

          this.logInfo("👍 SDK initialized");

          this.embedGame()
            .then(() => {
              resolve(this);
            })
            .catch((error) => {
              this.handleError("Error embedding game:", error, reject);
              return;
            });
        } catch (error) {
          this.handleError(error.message, error, reject);
        }
      });
    }


    /**
     * Validate required options.
     */
    validateOptions(options) {
      const requiredOptions = ['apiKey', 'apiSecret', 'gameId', 'userUrl', 'webhook'];
      for (const option of requiredOptions) {
        if (!options[option]) {
          throw new Error(`Required option ${option} is missing.`);
        }
      }
    }


    /**
     * Store SDK configuration options.
     */
    storeOptions(options) {
      this.client_id = options.apiKey;
      this.client_secret = options.apiSecret;
      this.gameId = options.gameId;
      this.userUrl = options.userUrl;
      this.webhook = options.webhook;
      this.containerId = options.containerId;
      this.gameServer = options.gameServer || "http://localhost:8090";
    }


    /**
     * Embed the game iframe.
     */
    embedGame() {
      return new Promise(async (resolve, reject) => {
        const gameUrl = await this.generateGameURL();
        if (!gameUrl) {
          return this.handleError("Game URL is not defined.", new Error(), reject);
        }

        const iframe = this.createIframe(gameUrl);

        const container = document.getElementById(this.containerId);

        if (!container) {
          return this.handleError(`Element with id '${this.containerId}' not found.`, new Error(), reject);
        }

        container.appendChild(iframe);

        iframe.onload = () => {
          this.logInfo("👍 Game iframe loaded successfully");
        };

        this.iframe = iframe;
        resolve();
      });
    }

    /**
     * Create an iframe element.
     */
    createIframe(gameUrl) {
      const iframe = document.createElement("iframe");
      iframe.src = gameUrl;
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.setAttribute("frameborder", "0");
      iframe.setAttribute("allow", "fullscreen");
      return iframe;
    }


    /**
     * Generate the game URL with token.
     */
    async generateGameURL() {
      try {
        const token = await this.generateToken();
        await this.getClientConfig(this.userUrl, this.webhook);
        return `${this.gameServer}/api/games/${this.gameId}/${token}`;
      } catch (error) {
        this.logError("Error generating game URL. The game server might be down or inaccessible:", error);
        return null;
      }
    }


    /**
     * Generate a secure token for the game.
     */
    async generateToken() {
      try {
        const response = await fetch(`${this.gameServer}/api/token-generator?gameId=${this.gameId}`);
        const data = await response.json();
        return data.token;
      } catch (error) {
        this.logError("Error generating token. The token server might be down or inaccessible:", error);
        return null;
      }
    }


    /**
     * Send client config to the game server
     */
    async getClientConfig(userUrl, webhook) {
      try {
        const response = await fetch(`${this.gameServer}/api/client-config`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userUrl, webhook
          }),
        });
        const result = await response.json();
        return result
      } catch (error) {
        this.logError('Error sending client config:', error);
      }
    }


    /**
     * Add an event listener for SDK events.
     */
    on(event, callback) {
      if (!this.events[event]) this.events[event] = [];
      this.events[event].push(callback);
    }

    /**
     * Trigger an SDK event.
     */
    triggerEvent(event, data = null) {
      if (this.events[event]) {
        this.events[event].forEach((callback) => callback(data));
      }
    }

    /**
     * Handle errors by logging and triggering events.
     */
    handleError(message, error, reject) {
      this.logError(message, error);
      if (reject) reject(error);
    }

    logInfo(...args) {
      console.info("[QuestPlaySDK]", ...args);
    }

    logWarn(...args) {
      console.warn("[QuestPlaySDK]", ...args);
    }

    logError(...args) {
      console.error("[QuestPlaySDK]", ...args);
    }
  }

  window.QuestPlaySDK = new QuestPlaySDK();
})(window);