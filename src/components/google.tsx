import { useEffect, useState } from "react";
import { IResolveParams, objectType } from "../types";
import LoginSocialGoogle from "../googleSocialLogin/index";
import { GoogleLoginButton } from "react-social-login-buttons";

/**
 * A component that handles Google login functionality.
 * @returns JSX element representing the Google login component.
 */
const GoogleLoginComponent = () => {
	const [isLogedIn, setIsLogedIn] = useState(false);
	const [userDetails, setUserDetails] = useState<objectType | null>(null);

	/**
	 * useEffect hook that runs when the 'isLogedIn' state changes.
	 * Retrieves the user details from local storage if they exist and updates the state accordingly.
	 * @returns None
	 */
	useEffect(() => {
		let googleLoginDetails = localStorage.getItem("googleLoginDetails");
		if (googleLoginDetails) {
			const userDetails = JSON.parse(googleLoginDetails)?.data;
			if (userDetails) {
				setIsLogedIn(true);
				setUserDetails(userDetails);
			}
		}
	}, [isLogedIn]);

	/**
	 * Handles the logout functionality by removing the "googleLoginDetails" from the local storage,
	 * setting the isLoggedIn state to false, and setting the userDetails state to null.
	 * @returns None
	 */
	const handleLogout = () => {
		localStorage.removeItem("googleLoginDetails");
		setIsLogedIn(false);
		setUserDetails(null);
	};

	/**
	 * Handles the login process for Google login.
	 * @param {IResolveParams} data - The resolved data from the Google login process.
	 * @returns None
	 */
	const handleLogin = (data: IResolveParams) => {
		console.log("google login resolved", data);
		setIsLogedIn(true);
		localStorage.setItem("googleLoginDetails", JSON.stringify(data));
	};

	/**
	 * Renders a login/logout component based on the user's login status.
	 * If the user is logged in, it displays a logout button and the user's name.
	 * If the user is not logged in, it displays a Google login button.
	 * @param {boolean} isLogedIn - Indicates whether the user is logged in or not.
	 * @param {object} userDetails - The details of the logged in user.
	 * @param {function} handleLogout - The function to handle the logout action.
	 * @param {function} handleLogin - The function to handle the login action.
	 * @returns JSX elements representing the login/logout component.
	 */
	return (
		<>
			{isLogedIn ? (
				<div className='logoutContainer'>
					{userDetails && (
						<div>
							<p>Hello, {userDetails?.name || "User"} </p>
							{/* <img className="image"
								src={userDetails?.picture || ""}
								alt=''
							/> */}
						</div>
					)}
					<button className='btnLogout' onClick={handleLogout}>
						Logout from Google
					</button>
				</div>
			) : (
				<LoginSocialGoogle
					// isOnlyGetToken
					client_id={process.env.REACT_APP_GOOGLE_APP_ID || ""}
					onResolve={handleLogin}
					onReject={(error) =>
						console.log("google login rejected", error)
					}>
					<GoogleLoginButton />
				</LoginSocialGoogle>
			)}
		</>
	);
};

export default GoogleLoginComponent;
