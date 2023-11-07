/* eslint-disable camelcase */
/**
 *
 * LoginSocialFacebook
 *
 */
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { objectType, IResolveParams } from "../types";

interface Props {
	appId: string;
	scope?: string;
	state?: boolean;
	xfbml?: boolean;
	cookie?: boolean;
	version?: string;
	language?: string;
	auth_type?: string;
	className?: string;
	isDisabled?: boolean;
	isOnlyGetToken?: boolean;
	onLoginStart?: () => void;
	onLogoutSuccess?: () => void;
	onReject: (reject: string | objectType) => void;
	onResolve: ({ provider, data }: IResolveParams) => void;
	redirect_uri?: string;
	fieldsProfile?: string;
	response_type?: string;
	return_scopes?: boolean;
	children?: React.ReactNode;
}

const SDK_URL: string = "https://connect.facebook.net/en_EN/sdk.js";
const SCRIPT_ID: string = "facebook-jssdk";
const _window = window as any;

/**
 * A component that provides a Facebook login button.
 * @param {Props} props - The component props.
 * @returns The Facebook login button component.
 */
const LoginSocialFacebook = ({
	appId,
	scope = "email,public_profile",
	state = true,
	xfbml = true,
	cookie = true,
	version = "v2.7",
	language = "en_EN",
	auth_type = "",
	className,
	onLoginStart,
	onReject,
	onResolve,
	redirect_uri,
	fieldsProfile = "id,first_name,last_name,middle_name,name,name_format,picture,short_name,email,gender",
	response_type = "code",
	return_scopes = true,
	isOnlyGetToken = false,
	children,
}: Props) => {
	const scriptNodeRef = useRef<HTMLElement>(null!);
	const [isSdkLoaded, setIsSdkLoaded] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);

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
	 * Inserts the SDK script into the HTML document and executes a callback function.
	 * @param {HTMLDocument} document - The HTML document object.
	 * @param {() => void} cb - The callback function to execute after inserting the script.
	 * @returns None
	 */
	const insertSDKScript = useCallback(
		(document: HTMLDocument, cb: () => void) => {
			const fbScriptTag = document.createElement("script");
			fbScriptTag.id = SCRIPT_ID;
			fbScriptTag.src = SDK_URL;
			const scriptNode = document.getElementsByTagName("script")![0];
			scriptNode &&
				scriptNode.parentNode &&
				scriptNode.parentNode.insertBefore(fbScriptTag, scriptNode);
			cb();
		},
		[]
	);

	/**
	 * Checks if a script element with the specified ID exists in the document.
	 * @returns {boolean} - True if the script element exists, false otherwise.
	 */
	const checkIsExistsSDKScript = useCallback(() => {
		return !!document.getElementById(SCRIPT_ID);
	}, []);

	/**
	 * Initializes the Facebook SDK with the provided configuration object and HTML document.
	 * @param {objectType} config - The configuration object for the Facebook SDK.
	 * @param {HTMLDocument} document - The HTML document object.
	 * @returns None
	 */
	const initFbSDK = useCallback(
		(config: objectType, document: HTMLDocument) => {
			const _window = window as any;
			_window.fbAsyncInit = function () {
				_window.FB && _window.FB.init({ ...config });
				setIsSdkLoaded(true);
				let fbRoot = document.getElementById(SCRIPT_ID);
				if (!fbRoot) {
					fbRoot = document.createElement("div");
					fbRoot.id = "fb-root";
					document.body.appendChild(fbRoot);
				}
				scriptNodeRef.current = fbRoot;
			};
		},
		[]
	);

	/**
	 * Retrieves the user's profile information from Facebook API.
	 * @param {objectType} authResponse - The authentication response object.
	 * @returns None
	 */
	const getMe = useCallback(
		(authResponse: objectType) => {
			_window.FB.api(
				"/me",
				{ locale: language, fields: fieldsProfile },
				(me: any) => {
					onResolve({
						provider: "facebook",
						data: { ...authResponse, ...me },
					});
				}
			);
		},
		[fieldsProfile, language, onResolve]
	);

	/**
	 * Handles the response from a Facebook API call.
	 * @param {objectType} response - The response object from the API call.
	 * @returns None
	 */
	const handleResponse = useCallback(
		(response: objectType) => {
			if (response.authResponse) {
				if (isOnlyGetToken)
					onResolve({
						provider: "facebook",
						data: { ...response.authResponse },
					});
				else getMe(response.authResponse);
			} else {
				onReject(response);
			}
			setIsProcessing(false);
		},
		[getMe, isOnlyGetToken, onReject, onResolve]
	);

	/**
	 * Loads the Facebook SDK if it is not already loaded.
	 * If the SDK script exists, sets the `isSdkLoaded` state to true.
	 * If the SDK script does not exist, inserts the SDK script into the document
	 * and initializes the Facebook SDK with the provided configuration.
	 * @returns None
	 */
	const load = useCallback(() => {
		if (checkIsExistsSDKScript()) {
			setIsSdkLoaded(true);
		} else {
			insertSDKScript(document, () => {
				initFbSDK(
					{
						appId,
						xfbml,
						version,
						state,
						cookie,
						redirect_uri,
						response_type,
					},
					document
				);
			});
		}
	}, [
		state,
		appId,
		xfbml,
		cookie,
		version,
		initFbSDK,
		redirect_uri,
		response_type,
		insertSDKScript,
		checkIsExistsSDKScript,
	]);

	/**
	 * Callback function for logging in with Facebook.
	 * @returns None
	 */
	const loginFB = useCallback(() => {
		console.log(isSdkLoaded, isProcessing);

		if (!isSdkLoaded || isProcessing) return;

		if (!_window.FB) {
			load();
			onReject("Fb isn't loaded!");
			setIsProcessing(false);
		} else {
			setIsProcessing(true);
			onLoginStart && onLoginStart();
			_window.FB.login(handleResponse, {
				scope,
				return_scopes,
				auth_type,
			});
		}
	}, [
		load,
		scope,
		onReject,
		auth_type,
		isSdkLoaded,
		onLoginStart,
		isProcessing,
		return_scopes,
		handleResponse,
	]);

	/**
	 * Renders a div element with the specified class name and click event handler.
	 * @param {string} className - The class name to apply to the div element.
	 * @param {function} loginFB - The click event handler function.
	 * @param {ReactNode} children - The child elements to render inside the div.
	 * @returns {JSX.Element} - The rendered div element.
	 */
	return (
		<div className={className} onClick={loginFB}>
			{children}
		</div>
	);
};

export default memo(LoginSocialFacebook);
