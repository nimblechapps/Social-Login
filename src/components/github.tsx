import { useEffect, useState } from "react";
import { LoginSocialGithub } from "../githubSocialLogin/index";
import { IResolveParams, objectType } from "../export";
import { GithubLoginButton } from "react-social-login-buttons";

const GitHubLoginComponent = () => {
	const REDIRECT_URI = window.location.href;
	// const REDIRECT_URI = "https://819c-122-170-2-163.ngrok-free.app/";

	const [isLogedIn, setIsLogedIn] = useState(false);
	const [userDetails, setUserDetails] = useState<objectType | null>(null);

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

	const handleLogout = () => {
		localStorage.removeItem("githubLoginDetails");
		setIsLogedIn(false);
		setUserDetails(null);
	};

	const handleLogin = (data: IResolveParams) => {
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
							{/* <img className="image"
								src={userDetails?.picture || ""}
								alt=''
							/> */}
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
