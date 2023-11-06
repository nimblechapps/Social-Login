import React, { useCallback, useEffect, useState } from "react";
import { LoginSocialInstagram } from "../instgramSocialLogin/index";
import { IResolveParams, objectType } from "../export";

const InstagramLoginComponent = () => {
	const REDIRECT_URI = "https://localhost:3000/";
	// const REDIRECT_URI = "https://angus-web-34c936ffa643.herokuapp.com/";
	const [isLogedIn, setIsLogedIn] = useState(false);
	const [userDetails, setUserDetails] = useState<objectType | null>(null);

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

	const handleLogout = () => {
		localStorage.removeItem("instagramLoginDetails");
		setIsLogedIn(false);
		setUserDetails(null);
	};

	const handleLogin = (data: IResolveParams) => {
		console.log("instagram login resolved", data);
		setIsLogedIn(true);
		localStorage.setItem("instagramLoginDetails", JSON.stringify(data));
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
							<p>
								Hello, {userDetails?.userPrincipalName || "XYZ"}{" "}
							</p>
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
					<button onClick={handleLogout}>
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
						console.error("instagram login rejected", error)
					}>
					<button>Login with Instgram</button>
				</LoginSocialInstagram>
			)}
		</>
	);
};

export default InstagramLoginComponent;
