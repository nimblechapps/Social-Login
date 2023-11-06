import React, { useCallback, useEffect, useState } from "react";
import { LoginSocialGithub } from "../githubSocialLogin/index";
import { IResolveParams, objectType } from "../export";

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
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "center",
						alignItems: "center",
					}}>
					{userDetails && (
						<>
							<p>Hello, {userDetails?.name || "XYZ"} </p>
							<img
								style={{
									height: 50,
									borderRadius: "100%",
									marginLeft: 10,
									marginRight: 10,
								}}
								src={userDetails?.picture || ""}
								alt=''
							/>
						</>
					)}
					<button onClick={handleLogout}>Logout from Github</button>
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
					<button>Login With Github</button>
				</LoginSocialGithub>
			)}
		</>
	);
};

export default GitHubLoginComponent;
