/* eslint-disable camelcase */
/**
 *
 * LoginSocialGithub
 *
 */
// import { PASS_CORS_KEY } from 'helper/constants';
import React, { memo, useCallback, useEffect } from "react";
import { IResolveParams, objectType } from "../types";

interface Props {
	state?: string;
	scope?: string;
	client_id: string;
	className?: string;
	redirect_uri: string;
	client_secret: string;
	allow_signup?: boolean;
	isOnlyGetToken?: boolean;
	isOnlyGetCode?: boolean;
	children?: React.ReactNode;
	onLoginStart?: () => void;
	onLogoutSuccess?: () => void;
	onReject: (reject: string | objectType) => void;
	onResolve: ({ provider, data }: IResolveParams) => void;
}

const GITHUB_URL: string = "https://github.com";
const GITHUB_API_URL: string = "https://api.github.com";
const PREVENT_CORS_URL: string = "https://corsproxy.io/?";

/**
 * A component that allows users to log in using their GitHub account.
 * @param {Props} props - The component props.
 * @returns The LoginSocialGithub component.
 */
const LoginSocialGithub = ({
	state = "",
	scope = "repo,gist",
	client_id,
	client_secret,
	className = "",
	redirect_uri,
	allow_signup = true,
	isOnlyGetToken = false,
	isOnlyGetCode = false,
	children,
	onReject,
	onResolve,
	onLoginStart,
}: Props) => {
	/**
	 * useEffect hook that runs once when the component mounts. It checks if the current URL
	 * contains a "code" and "state" parameter. If the "state" parameter includes "_github" and
	 * the "code" parameter is present, it saves the "code" value to the "github" key in the
	 * localStorage and closes the window.
	 * @returns None
	 */

	useEffect(() => {
		const popupWindowURL = new URL(window.location.href);
		const code = popupWindowURL.searchParams.get("code");
		const state = popupWindowURL.searchParams.get("state");
		if (state?.includes("_github") && code) {
			localStorage.setItem("github", code);
			window.close();
		}
	}, []);

	/**
	 * Retrieves the user profile data from the GitHub API using the provided access token.
	 * @param {objectType} data - The object containing the access token.
	 * @returns None
	 */
	const getProfile = useCallback(
		(data: objectType) => {
			fetch(`${PREVENT_CORS_URL}${GITHUB_API_URL}/user`, {
				method: "GET",
				headers: {
					Authorization: `token ${data.access_token}`,
					//   'x-cors-grida-api-key': PASS_CORS_KEY,
				},
			})
				.then((res) => res.json())
				.then((response: any) => {
					// console.log("github profile => ", response);

					onResolve({
						provider: "github",
						data: { ...response, ...data },
					});
				})
				.catch((err) => {
					onReject(err);
				});
		},
		[onReject, onResolve]
	);

	/**
	 * Retrieves an access token from the GitHub API using the provided code.
	 * @param {string} code - The authorization code obtained from the user.
	 * @returns None
	 */
	const getAccessToken = useCallback(
		(code: string) => {
			if (isOnlyGetCode)
				onResolve({ provider: "github", data: { code } });
			else {
				const params = {
					code,
					state,
					redirect_uri,
					client_id,
					client_secret,
				};
				const headers = new Headers({
					"Content-Type": "application/x-www-form-urlencoded",
					//   'x-cors-grida-api-key': PASS_CORS_KEY,
				});

				fetch(
					`${PREVENT_CORS_URL}${GITHUB_URL}/login/oauth/access_token`,
					{
						method: "POST",
						headers,
						body: new URLSearchParams(params),
					}
				)
					.then((response) => response.text())
					.then((response) => {
						const data: objectType = {};
						// console.log("github acces token => ", response);

						const searchParams: any = new URLSearchParams(response);
						for (const p of searchParams) {
							data[p[0]] = p[1];
						}
						if (data.access_token) {
							if (isOnlyGetToken)
								onResolve({ provider: "github", data });
							else getProfile(data);
						} else onReject("no data");
					})
					.catch((err) => {
						// console.log("error ==> ", err);
						onReject(err);
					});
			}
		},
		[
			state,
			onReject,
			getProfile,
			onResolve,
			client_id,
			redirect_uri,
			client_secret,
			isOnlyGetCode,
			isOnlyGetToken,
		]
	);

	/**
	 * Handles the post message received from the parent window.
	 * @param {object} object - The object containing the type, code, and provider properties.
	 * @returns {Promise} - A promise that resolves to the access token if the type is "code" and the provider is "github", otherwise undefined.
	 */
	const handlePostMessage = useCallback(
		async ({ type, code, provider }: objectType) =>
			type === "code" &&
			provider === "github" &&
			code &&
			getAccessToken(code),
		[getAccessToken]
	);

	/**
	 * Callback function that is triggered when the local storage changes.
	 * It retrieves the code from the "github" key in the local storage,
	 * logs it to the console, and then removes the "github" key from the local storage.
	 * Finally, it calls the handlePostMessage function with the provider set to "github",
	 * the type set to "code", and the retrieved code as the payload.
	 * @returns None
	 */
	const onChangeLocalStorage = useCallback(() => {
		window.removeEventListener("storage", onChangeLocalStorage, false);
		const code = localStorage.getItem("github");
		if (code) {
			console.log("code", code);

			handlePostMessage({ provider: "github", type: "code", code });
			localStorage.removeItem("github");
		}
	}, [handlePostMessage]);

	/**
	 * Callback function that is triggered when the user clicks on the login button.
	 * This function performs the necessary steps to initiate the login process.
	 * @returns None
	 */
	const onLogin = useCallback(() => {
		onLoginStart && onLoginStart();
		window.addEventListener("storage", onChangeLocalStorage, false);
		const oauthUrl = `${GITHUB_URL}/login/oauth/authorize?client_id=${client_id}&scope=${scope}&state=${
			state + "_github"
		}&redirect_uri=${redirect_uri}&allow_signup=${allow_signup}`;

		// console.log("oauthUrl", oauthUrl);

		const width = 450;
		const height = 730;
		const left = window.screen.width / 2 - width / 2;
		const top = window.screen.height / 2 - height / 2;
		window.open(
			oauthUrl,
			"Github",
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
		client_id,
		redirect_uri,
		allow_signup,
		onLoginStart,
		onChangeLocalStorage,
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

export default memo(LoginSocialGithub);
