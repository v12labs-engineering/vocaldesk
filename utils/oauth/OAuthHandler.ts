import querystring from "querystring";
import axios, { type AxiosResponse } from "axios";

interface ProviderUrls {
	authorizationUrl: string;
	tokenUrl: string;
	refreshUrl: string;
}

interface TokenResponse {
	access_token: string;
	refresh_token?: string;
	expires_in: number;
	[key: string]: any;
}

interface IOAuthHandler {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
	providerUrls: ProviderUrls;
	// generateAuthUrl(scope: string[], state: string): string;
	// exchangeCodeForToken(code: string): Promise<TokenResponse>;
	// refreshAccessToken(refreshToken: string): Promise<TokenResponse>;
}

class OAuthHandler {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
	providerUrls: ProviderUrls;

	constructor({
		clientId,
		clientSecret,
		redirectUri,
		providerUrls,
	}: IOAuthHandler) {
		this.clientId = clientId;
		this.clientSecret = clientSecret;
		this.redirectUri = redirectUri;
		this.providerUrls = providerUrls;
	}

	generateAuthUrl(scope: string[], state: string): string {
		const queryParams = querystring.stringify({
			response_type: "code",
			client_id: this.clientId,
			redirect_uri: this.redirectUri,
			scope: scope.join(" "),
			state: state,
		});

		return `${this.providerUrls.authorizationUrl}?${queryParams}`;
	}

	async exchangeCodeForToken(code: string): Promise<TokenResponse> {
		const requestBody = {
			code: code,
			client_id: this.clientId,
			client_secret: this.clientSecret,
			redirect_uri: this.redirectUri,
			grant_type: "authorization_code",
		};

		try {
			const response: AxiosResponse<TokenResponse> = await axios.post(
				this.providerUrls.tokenUrl,
				querystring.stringify(requestBody),
				{
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
				},
			);
			return response.data;
		} catch (error) {
			console.error("Error exchanging code for token:", error);
			throw error;
		}
	}

	async refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
		const requestBody = {
			refresh_token: refreshToken,
			client_id: this.clientId,
			client_secret: this.clientSecret,
			grant_type: "refresh_token",
		};

		try {
			const response: AxiosResponse<TokenResponse> = await axios.post(
				this.providerUrls.tokenUrl,
				querystring.stringify(requestBody),
				{
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
				},
			);
			return response.data;
		} catch (error) {
			console.error("Error refreshing access token:", error);
			throw error;
		}
	}
}

export default OAuthHandler;
