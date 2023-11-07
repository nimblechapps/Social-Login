/* eslint-disable no-empty-pattern */
import { useEffect, useState } from "react";
import LoginSocialMicrosoft from "../microsoftSocialLogin/index";
import { IResolveParams, objectType } from "../types";
import { MicrosoftLoginButton } from "react-social-login-buttons";

/**
 * A component that handles Microsoft login functionality.
 * @returns The MicrosoftLoginComponent JSX element.
 */
const MicrosoftLoginComponent = () => {
	const REDIRECT_URI = window.location.href;

	const [isLogedIn, setIsLogedIn] = useState(false);
	const [userDetails, setUserDetails] = useState<objectType | null>(null);

	/**
	 * useEffect hook that runs when the 'isLogedIn' state changes.
	 * Retrieves the Microsoft login details from local storage and updates the 'isLogedIn'
	 * state and 'userDetails' state if the details exist.
	 * @returns None
	 */
	useEffect(() => {
		let microsoftLoginDetails = localStorage.getItem(
			"microsoftLoginDetails"
		);
		if (microsoftLoginDetails) {
			const userDetails = JSON.parse(microsoftLoginDetails)?.data;
			if (userDetails) {
				setIsLogedIn(true);
				setUserDetails(userDetails);
			}
		}
	}, [isLogedIn]);

	/**
	 * Handles the logout functionality by removing the Microsoft login details from the local storage,
	 * setting the isLoggedIn state to false, and resetting the userDetails state to null.
	 * @returns None
	 */
	const handleLogout = () => {
		localStorage.removeItem("microsoftLoginDetails");
		setIsLogedIn(false);
		setUserDetails(null);
	};

	/**
	 * Handles the login process for Microsoft authentication.
	 * @param {IResolveParams} data - The resolved login data.
	 * @returns None
	 */
	const handleLogin = (data: IResolveParams) => {
		console.log("microsoft login resolved", data);
		setIsLogedIn(true);
		localStorage.setItem("microsoftLoginDetails", JSON.stringify(data));
	};

	/**
	 * Renders a login/logout component based on the user's login status.
	 * If the user is logged in, it displays a logout button with the user's name.
	 * If the user is not logged in, it displays a Microsoft login button.
	 * @param {boolean} isLogedIn - Indicates whether the user is logged in or not.
	 * @param {object} userDetails - The details of the logged in user.
	 * @param {function} handleLogout - The function to handle the logout action.
	 * @param {function} handleLogin - The function to handle the login action.
	 * @returns JSX element representing the login/logout component.
	 */
	return (
		<>
			{isLogedIn ? (
				<div className='logoutContainer'>
					{userDetails && (
						<div>
							<p>
								Hello,{" "}
								{userDetails?.userPrincipalName || "User"}{" "}
							</p>
						</div>
					)}
					<button className='btnLogout' onClick={handleLogout}>
						Logout from Microsoft
					</button>
				</div>
			) : (
				<LoginSocialMicrosoft
					// isOnlyGetToken
					client_id={process.env.REACT_APP_MICROSOFT_APP_ID || ""}
					redirect_uri={REDIRECT_URI}
					onResolve={handleLogin}
					onReject={(error) =>
						console.error("microsoft login rejected", error)
					}>
					<MicrosoftLoginButton />
				</LoginSocialMicrosoft>
			)}
		</>
	);
};

export default MicrosoftLoginComponent;
