import { useEffect, useState } from "react";
import LoginSocialGithub from "../githubSocialLogin/index";
import { IResolveParams, objectType } from "../types";
import { GithubLoginButton } from "react-social-login-buttons";

/**
 * A React component that handles GitHub login functionality.
 * @returns JSX element
 */
const GitHubLoginComponent = () => {
	const REDIRECT_URI = window.location.href;

	const [isLogedIn, setIsLogedIn] = useState(false);
	const [userDetails, setUserDetails] = useState<objectType | null>(null);

	/**
	 * useEffect hook that retrieves the GitHub login details from local storage and updates the state
	 * of the component accordingly.
	 * @returns None
	 */
	useEffect(() => {
		let githubLoginDetails = localStorage.getItem("githubLoginDetails");
		if (githubLoginDetails) {
			const userDetails = JSON.parse(githubLoginDetails)?.data;
			if (userDetails) {
				setIsLogedIn(true);
				setUserDetails(userDetails);
			}
		}
	}, [isLogedIn]);

	/**
	 * Handles the logout functionality by removing the "githubLoginDetails" from the local storage,
	 * setting the isLoggedIn state to false, and setting the userDetails state to null.
	 * @returns None
	 */
	const handleLogout = () => {
		localStorage.removeItem("githubLoginDetails");
		setIsLogedIn(false);
		setUserDetails(null);
	};

	/**
	 * Handles the login process for GitHub.
	 * @param {IResolveParams} data - The resolved login data from GitHub.
	 * @returns None
	 */
	const handleLogin = (data: IResolveParams) => {
		/**
		 * Renders a login/logout component based on the user's login status.
		 * If the user is logged in, it displays a logout button and the user's name.
		 * If the user is not logged in, it displays a GitHub login button.
		 * @param {boolean} isLogedIn - Indicates whether the user is logged in or not.
		 * @param {object} userDetails - The details of the logged in user.
		 * @param {function} handleLogout - The function to handle the logout action.
		 * @param {string} REDIRECT_URI - The redirect URI for the GitHub login.
		 * @param {function} handleLogin - The function to handle the login action.
		 * @returns The JSX component to render.
		 */
		console.log("github login resolved", data);
		setIsLogedIn(true);
		localStorage.setItem("githubLoginDetails", JSON.stringify(data));
	};

	return (
		<>
			{isLogedIn ? (
				<div className='logoutContainer'>
					{userDetails && (
						<div>
							<p>
								Hello,{" "}
								{userDetails?.name ||
									userDetails?.login ||
									"User"}
							</p>
						</div>
					)}
					<button className='btnLogout' onClick={handleLogout}>
						Logout from Github
					</button>
				</div>
			) : (
				<LoginSocialGithub
					// isOnlyGetToken
					client_id={process.env.REACT_APP_GITHUB_APP_ID || ""}
					client_secret={
						process.env.REACT_APP_GITHUB_APP_SECRET || ""
					}
					redirect_uri={REDIRECT_URI}
					onResolve={handleLogin}
					onReject={(error) =>
						console.error("github login rejected", error)
					}>
					<GithubLoginButton />
				</LoginSocialGithub>
			)}
		</>
	);
};

export default GitHubLoginComponent;
