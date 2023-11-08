import { useEffect, useState } from "react";
import LoginSocialInstagram from "../instgramSocialLogin/index";
import { IResolveParams, objectType } from "../types";
import { InstagramLoginButton } from "react-social-login-buttons";

/**
 * A React component that handles Instagram login functionality.
 * @returns JSX element representing the Instagram login component.
 */
const InstagramLoginComponent = () => {
	const REDIRECT_URI = window.location.href;
	console.log(REDIRECT_URI);

	const [isLogedIn, setIsLogedIn] = useState(false);
	const [userDetails, setUserDetails] = useState<objectType | null>(null);

	/**
	 * useEffect hook that retrieves Instagram login details from local storage and updates
	 * the state variables isLogedIn and userDetails if the details exist.
	 * @returns None
	 */
	useEffect(() => {
		let instagramLoginDetails = localStorage.getItem(
			"instagramLoginDetails"
		);
		if (instagramLoginDetails) {
			const userDetails = JSON.parse(instagramLoginDetails)?.data;
			if (userDetails) {
				setIsLogedIn(true);
				setUserDetails(userDetails);
			}
		}
	}, [isLogedIn]);

	/**
	 * Handles the logout functionality by removing the "instagramLoginDetails" from the local storage,
	 * setting the isLoggedIn state to false, and setting the userDetails state to null.
	 * @returns None
	 */
	const handleLogout = () => {
		localStorage.removeItem("instagramLoginDetails");
		setIsLogedIn(false);
		setUserDetails(null);
	};

	/**
	 * Handles the login process for Instagram.
	 * @param {IResolveParams} data - The resolved login data.
	 * @returns None
	 */
	const handleLogin = (data: IResolveParams) => {
		console.log("instagram login resolved", data);
		setIsLogedIn(true);
		localStorage.setItem("instagramLoginDetails", JSON.stringify(data));
	};

	/**
	 * Renders a component that displays either a logout container if the user is logged in,
	 * or a login component for Instagram if the user is not logged in.
	 * @returns JSX element
	 */
	return (
		<>
			{isLogedIn ? (
				<div className='logoutContainer'>
					{userDetails && (
						<div>
							<p>Hello, {userDetails?.username || "User"} </p>
						</div>
					)}
					<button className='btnLogout' onClick={handleLogout}>
						Logout from Instagram
					</button>
				</div>
			) : (
				<LoginSocialInstagram
					// isOnlyGetToken
					client_id={process.env.REACT_APP_INSTAGRAM_APP_ID || ""}
					client_secret={
						process.env.REACT_APP_INSTAGRAM_APP_SECRET || ""
					}
					redirect_uri={REDIRECT_URI}
					onResolve={handleLogin}
					onReject={(error) =>
						console.log("instagram login rejected", error)
					}>
					<InstagramLoginButton />
				</LoginSocialInstagram>
			)}
		</>
	);
};

export default InstagramLoginComponent;
