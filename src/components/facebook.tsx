import { useEffect, useState } from "react";
import LoginSocialFacebook from "../facebookSocialLogin/index";
import { IResolveParams, objectType } from "../types";
import { FacebookLoginButton } from "react-social-login-buttons";

/**
 * A functional component that handles Facebook login functionality.
 * @returns JSX elements representing the Facebook login component.
 */
const FacebookLoginComponent = () => {
	const [isLogedIn, setIsLogedIn] = useState(false);
	const [userDetails, setUserDetails] = useState<objectType | null>(null);

	/**
	 * useEffect hook that runs when the `isLogedIn` state changes.
	 * Retrieves the Facebook login details from local storage and updates the `isLogedIn` state
	 * and `userDetails` state if the details exist.
	 * @returns None
	 */
	useEffect(() => {
		let facebookLoginDetails = localStorage.getItem("facebookLoginDetails");
		if (facebookLoginDetails) {
			const userDetails = JSON.parse(facebookLoginDetails)?.data;
			if (userDetails) {
				setIsLogedIn(true);
				setUserDetails(userDetails);
			}
		}
	}, [isLogedIn]);

	/**
	 * Handles the logout functionality by removing the Facebook login details from local storage,
	 * setting the isLoggedIn state to false, and resetting the userDetails state to null.
	 * @returns None
	 */
	const handleLogout = () => {
		localStorage.removeItem("facebookLoginDetails");
		setIsLogedIn(false);
		setUserDetails(null);
	};

	/**
	 * Handles the login process for Facebook.
	 * @param {IResolveParams} data - The resolved login data from Facebook.
	 * @returns None
	 */
	const handleLogin = (data: IResolveParams) => {
		console.log("facebook login resolved", data);
		setIsLogedIn(true);
		localStorage.setItem("facebookLoginDetails", JSON.stringify(data));
	};

	/**
	 * Renders a component that displays either a logout container if the user is logged in,
	 * or a Facebook login button if the user is not logged in.
	 * @returns JSX element
	 */
	return (
		<>
			{isLogedIn ? (
				<div className='logoutContainer'>
					{userDetails && (
						<div>
							<p>Hello, {userDetails?.name || "User"} </p>
						</div>
					)}
					<button className='btnLogout' onClick={handleLogout}>
						Logout from Facebook
					</button>
				</div>
			) : (
				<LoginSocialFacebook
					appId={process.env.REACT_APP_FACEBOOK_APP_ID || ""} // Replace with your Facebook App ID
					onLoginStart={() => console.log("Facebook login started")}
					onResolve={handleLogin}
					onReject={(error) =>
						console.error("Facebook login rejected", error)
					}>
					<FacebookLoginButton />
				</LoginSocialFacebook>
			)}
		</>
	);
};

export default FacebookLoginComponent;
