/* eslint-disable camelcase */
/**
 *
 * LoginSocialGoogle
 *
 */
// import { PASS_CORS_KEY } from 'helper/constants';
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { objectType, IResolveParams } from "../types";

interface Props {
	scope?: string;
	prompt?: string;
	ux_mode?: string;
	client_id: string;
	className?: string;
	login_hint?: string;
	access_type?: string;
	auto_select?: boolean;
	redirect_uri?: string;
	cookie_policy?: string;
	hosted_domain?: string;
	discoveryDocs?: string;
	children?: React.ReactNode;
	onLoginStart?: () => void;
	isOnlyGetToken?: boolean;
	typeResponse?: "idToken" | "accessToken";
	onReject: (reject: string | objectType) => void;
	fetch_basic_profile?: boolean;
	onResolve: ({ provider, data }: IResolveParams) => void;
}

const JS_SRC = "https://accounts.google.com/gsi/client";
const SCRIPT_ID = "google-login";
const PREVENT_CORS_URL: string = "https://corsproxy.io/?";
const _window = window as any;

/**
 * A component that provides a Google login functionality.
 * @param {Props} props - The component props.
 * @returns The LoginSocialGoogle component.
 */
const LoginSocialGoogle = ({
	client_id,
	scope = "https://www.googleapis.com/auth/userinfo.profile",
	prompt = "select_account",
	typeResponse = "accessToken",
	ux_mode,
	className = "",
	login_hint = "",
	access_type = "online",
	onLoginStart,
	onReject,
	onResolve,
	redirect_uri = "/",
	auto_select = false,
	isOnlyGetToken = false,
	cookie_policy = "single_host_origin",
	hosted_domain = "",
	discoveryDocs = "",
	children,
	fetch_basic_profile = true,
}: Props) => {
	const scriptNodeRef = useRef<HTMLScriptElement>(null!);
	const [isSdkLoaded, setIsSdkLoaded] = useState(false);
	const [instance, setInstance] = useState<any>(null!);

	/**
	 * useEffect hook that loads the SDK if it is not already loaded.
	 * @returns None
	 */
	useEffect(() => {
		!isSdkLoaded && load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isSdkLoaded]);

	/**
	 * useEffect hook that removes the script node from the DOM when the component unmounts.
	 * @returns None
	 */
	useEffect(
		() => () => {
			if (scriptNodeRef.current) scriptNodeRef.current.remove();
		},
		[]
	);

	/**
	 * Checks if a script with the specified ID exists in the document.
	 * @returns {boolean} - True if the script exists, false otherwise.
	 */
	const checkIsExistsSDKScript = useCallback(() => {
		return !!document.getElementById(SCRIPT_ID);
	}, []);

	/**
	 * Inserts a Google script into the HTML document.
	 * @param {HTMLDocument} d - The HTML document object.
	 * @param {string} [s="script"] - The tag name of the script element.
	 * @param {string} id - The id attribute of the script element.
	 * @param {string} jsSrc - The source URL of the JavaScript file.
	 * @param {() => void} cb - The callback function to be executed when the script is loaded.
	 * @returns None
	 */
	const insertScriptGoogle = useCallback(
		(
			d: HTMLDocument,
			s: string = "script",
			id: string,
			jsSrc: string,
			cb: () => void
		) => {
			const ggScriptTag: any = d.createElement(s);
			ggScriptTag.id = id;
			ggScriptTag.src = jsSrc;
			ggScriptTag.async = true;
			ggScriptTag.defer = true;
			const scriptNode = document.getElementsByTagName("script")![0];
			scriptNodeRef.current = ggScriptTag;
			scriptNode &&
				scriptNode.parentNode &&
				scriptNode.parentNode.insertBefore(ggScriptTag, scriptNode);
			ggScriptTag.onload = cb;
		},
		[]
	);

	/**
	 * Callback function that is triggered when the "getMe" action is performed.
	 * @param {objectType} res - The response object received from the action.
	 * @returns None
	 */
	const onGetMe = useCallback(
		(res: objectType) => {
			if (typeResponse === "accessToken") {
				const headers = new Headers({
					"Content-Type": "application/x-www-form-urlencoded",
					//   'x-cors-grida-api-key': PASS_CORS_KEY,
					Authorization: "Bearer " + res.access_token,
				});

				fetch(
					`${PREVENT_CORS_URL}https://www.googleapis.com/oauth2/v3/userinfo?alt=json`,
					{
						method: "GET",
						headers,
					}
				)
					.then((response) => response.json())
					.then((response) => {
						const data: objectType = { ...res, ...response };
						// console.log("onGetMe ==>", data);

						onResolve({
							provider: "google",
							data,
						});
					})
					.catch((err) => {
						onReject(err);
					});
			} else {
				fetch(
					`${PREVENT_CORS_URL}https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${res.credential}`,
					{
						method: "GET",
					}
				)
					.then((response) => response.json())
					.then((response) => {
						const data: objectType = { ...res, ...response };
						onResolve({
							provider: "google",
							data,
						});
					})
					.catch((err) => {
						onReject(err);
					});
			}
		},
		[typeResponse, onReject, onResolve]
	);

	/**
	 * Handles the response from an API call.
	 * @param {objectType} res - The response object from the API call.
	 * @returns None
	 */
	const handleResponse = useCallback(
		(res: objectType) => {
			if (res && access_type === "offline")
				onResolve({
					provider: "google",
					data: res,
				});
			else {
				if (res?.access_token) {
					if (isOnlyGetToken)
						onResolve({
							provider: "google",
							data: res,
						});
					else onGetMe(res);
				} else {
					const data: objectType = res;
					if (isOnlyGetToken)
						onResolve({
							provider: "google",
							data,
						});
					else onGetMe(res);
				}
			}
		},
		[access_type, isOnlyGetToken, onGetMe, onResolve]
	);

	/**
	 * Handles an error response from a callback function.
	 * @param {objectType} res - The error response object.
	 * @returns None
	 */
	const handleError = useCallback(
		(res: objectType) => {
			onReject({
				provider: "google",
				data: res,
			});
		},
		[onReject]
	);

	/**
	 * Loads the SDK and initializes the Google client for authentication.
	 * @returns None
	 */
	const load = useCallback(() => {
		if (checkIsExistsSDKScript()) {
			setIsSdkLoaded(true);
		} else {
			insertScriptGoogle(document, "script", SCRIPT_ID, JS_SRC, () => {
				const params = {
					client_id,
					ux_mode,
				};
				var client = null;
				if (typeResponse === "idToken") {
					_window.google.accounts.id.initialize({
						...params,
						auto_select,
						prompt: "select_account",
						login_uri: redirect_uri,
						callback: handleResponse,
						native_callback: handleResponse,
						error_callback: handleError,
					});
				} else {
					const payload = {
						...params,
						scope,
						prompt,
						login_hint,
						access_type,
						hosted_domain,
						redirect_uri,
						cookie_policy,
						discoveryDocs,
						immediate: true,
						fetch_basic_profile,
						callback: handleResponse,
						error_callback: handleError,
					};
					if (access_type === "offline")
						client =
							_window.google.accounts.oauth2.initCodeClient(
								payload
							);
					else
						client =
							_window.google.accounts.oauth2.initTokenClient(
								payload
							);
				}
				if (client) setInstance(client);
				setIsSdkLoaded(true);
			});
		}
	}, [
		scope,
		prompt,
		ux_mode,
		client_id,
		login_hint,
		auto_select,
		access_type,
		redirect_uri,
		typeResponse,
		discoveryDocs,
		cookie_policy,
		hosted_domain,
		handleResponse,
		handleError,
		fetch_basic_profile,
		insertScriptGoogle,
		checkIsExistsSDKScript,
	]);

	/**
	 * Function to handle Google login.
	 * @returns None
	 */
	const loginGoogle = useCallback(() => {
		if (!isSdkLoaded) return;
		if (!_window.google) {
			load();
			onReject("Google SDK isn't loaded!");
		} else {
			onLoginStart && onLoginStart();
			if (instance)
				access_type === "offline"
					? instance.requestCode()
					: instance.requestAccessToken();
			else _window.google.accounts.id.prompt();
		}
	}, [access_type, instance, isSdkLoaded, load, onLoginStart, onReject]);

	/**
	 * Renders a div element with the specified class name and click event handler.
	 * @param {string} className - The class name to apply to the div element.
	 * @param {function} loginGoogle - The click event handler for the div element.
	 * @param {ReactNode} children - The child elements to render inside the div element.
	 * @returns {JSX.Element} - The rendered div element.
	 */
	return (
		<div className={className} onClick={loginGoogle}>
			{children}
		</div>
	);
};

export default memo(LoginSocialGoogle);
