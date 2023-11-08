/* eslint-disable camelcase */
/**
 *
 * LoginSocialMicrosoft
 *
 */
import React, { memo, useCallback, useEffect } from "react";
import { IResolveParams, objectType } from "../types";

interface Props {
	scope?: string;
	state?: string;
	client_id: string;
	className?: string;
	redirect_uri: string;
	response_type?: string;
	response_mode?: string;
	code_challenge?: string;
	children?: React.ReactNode;
	isOnlyGetCode?: boolean;
	isOnlyGetToken?: boolean;
	onLoginStart?: () => void;
	onReject: (reject: string | objectType) => void;
	code_challenge_method?: "plain" | "s256"[];
	onResolve: ({ provider, data }: IResolveParams) => void;
	tenant?: "common" | "organizations" | "consumers";
	prompt?: "login" | "none" | "consent" | "select_account";
}

const MICROSOFT_URL = "https://login.microsoftonline.com";
const MICROSOFT_API_URL = "https://graph.microsoft.com";
// const PREVENT_CORS_URL: string = 'https://cors.bridged.cc/'
const PREVENT_CORS_URL: string = "https://corsproxy.io/?";

/**
 * A component that provides a login button for Microsoft authentication.
 * @param {Props} Props - The component props.
 * @returns The Microsoft login button component.
 */
const LoginSocialMicrosoft = ({
	tenant = "common",
	state = "",
	client_id,
	className,
	redirect_uri,
	scope = "User.Read",
	response_type = "code",
	response_mode = "query",
	children,
	code_challenge = "19cfc47c216dacba8ca23eeee817603e2ba34fe0976378662ba31688ed302fa9",
	code_challenge_method = "plain",
	prompt = "select_account",
	isOnlyGetCode = false,
	isOnlyGetToken = false,
	onLoginStart,
	onReject,
	onResolve,
}: Props) => {
	/**
	 * useEffect hook that runs once when the component mounts. It checks if the current URL
	 * contains a "code" parameter and a "state" parameter that includes "_microsoft". If both
	 * conditions are met, it stores the "code" value in the localStorage with the key "microsoft"
	 * and closes the current window.
	 * @returns None
	 */
	useEffect(() => {
		const popupWindowURL = new URL(window.location.href);
		const code = popupWindowURL.searchParams.get("code");
		const state = popupWindowURL.searchParams.get("state");
		if (state?.includes("_microsoft") && code) {
			localStorage.setItem("microsoft", code);
			window.close();
		}
	}, []);

	/**
	 * Retrieves the user profile from the Microsoft API using the provided access token.
	 * @param {objectType} data - The data object containing the access token.
	 * @returns None
	 */
	const getProfile = useCallback(
		(data: objectType) => {
			fetch(`${PREVENT_CORS_URL}${MICROSOFT_API_URL}/v1.0/me`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${data.access_token}`,
				},
			})
				.then((res) => res.json())
				.then((res) => {
					onResolve({
						provider: "microsoft",
						data: { ...res, ...data },
					});
				})
				.catch((err) => {
					onReject(err);
				});
		},
		[onReject, onResolve]
	);

	/**
	 * Retrieves an access token from Microsoft OAuth2.0 endpoint using the provided code.
	 * If `isOnlyGetCode` is true, it resolves with the code. Otherwise, it sends a POST request
	 * to the Microsoft OAuth2.0 token endpoint with the necessary parameters and headers.
	 * If the response contains an access token, it resolves with the token. Otherwise, it rejects
	 * with the message "no data".
	 * @param {string} code - The authorization code.
	 * @returns None
	 */
	const getAccessToken = useCallback(
		(code: string) => {
			if (isOnlyGetCode)
				onResolve({ provider: "microsoft", data: { code } });
			else {
				const params = {
					code,
					scope,
					client_id,
					redirect_uri,
					code_verifier: code_challenge,
					grant_type: "authorization_code",
				};
				const headers = new Headers({
					"Content-Type":
						"application/x-www-form-urlencoded;charset=UTF-8",
				});
				fetch(
					`${PREVENT_CORS_URL}${MICROSOFT_URL}/${tenant}/oauth2/v2.0/token`,
					{
						method: "POST",
						headers,
						body: new URLSearchParams(params),
					}
				)
					.then((response) => response.json())
					.then((data) => {
						if (data.access_token) {
							if (isOnlyGetToken)
								onResolve({ provider: "microsoft", data });
							else getProfile(data);
						} else {
							onReject("no data");
						}
					})
					.catch((err) => {
						onReject(err);
					});
			}
		},
		[
			scope,
			tenant,
			onReject,
			getProfile,
			client_id,
			onResolve,
			redirect_uri,
			code_challenge,
			isOnlyGetCode,
			isOnlyGetToken,
		]
	);

	/**
	 * Handles the post message received from the Microsoft provider.
	 * @param {objectType} message - The post message object containing the type, code, and provider.
	 * @returns {Promise<void>} - A promise that resolves when the access token is retrieved.
	 */
	const handlePostMessage = useCallback(
		async ({ type, code, provider }: objectType) =>
			type === "code" &&
			provider === "microsoft" &&
			code &&
			getAccessToken(code),
		[getAccessToken]
	);

	/**
	 * Callback function that is triggered when there is a change in the local storage.
	 * It retrieves the code from the "microsoft" key in the local storage, sends a post message
	 * with the code to the specified provider, and removes the "microsoft" key from the local storage.
	 * @returns None
	 */
	const onChangeLocalStorage = useCallback(() => {
		window.removeEventListener("storage", onChangeLocalStorage, false);
		const code = localStorage.getItem("microsoft");
		if (code) {
			handlePostMessage({ provider: "microsoft", type: "code", code });
			localStorage.removeItem("microsoft");
		}
	}, [handlePostMessage]);

	/**
	 * Callback function that handles the login process.
	 * @returns None
	 */
	const onLogin = useCallback(() => {
		onLoginStart && onLoginStart();
		window.addEventListener("storage", onChangeLocalStorage, false);
		const oauthUrl = `${MICROSOFT_URL}/${tenant}/oauth2/v2.0/authorize?client_id=${client_id}
        &response_type=${response_type}
        &redirect_uri=${redirect_uri}
        &response_mode=${response_mode}
        &scope=${scope}
        &state=${state + "_microsoft"}
        &prompt=${prompt}
        &code_challenge=${code_challenge}
        &code_challenge_method=${code_challenge_method}`;
		const width = 450;
		const height = 730;
		const left = window.screen.width / 2 - width / 2;
		const top = window.screen.height / 2 - height / 2;
		window.open(
			oauthUrl,
			"Microsoft",
			"menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=" +
				width +
				", height=" +
				height +
				", top=" +
				top +
				", left=" +
				left
		);
	}, [
		scope,
		state,
		prompt,
		tenant,
		client_id,
		onLoginStart,
		redirect_uri,
		response_mode,
		response_type,
		code_challenge,
		onChangeLocalStorage,
		code_challenge_method,
	]);

	/**
	 * Renders a div element with the specified class name and click event handler.
	 * @param {string} className - The class name to apply to the div element.
	 * @param {function} onLogin - The click event handler function.
	 * @param {ReactNode} children - The child elements to render inside the div.
	 * @returns {JSX.Element} - The rendered div element.
	 */
	return (
		<div className={className} onClick={onLogin}>
			{children}
		</div>
	);
};

export default memo(LoginSocialMicrosoft);
