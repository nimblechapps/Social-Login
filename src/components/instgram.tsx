import React, { useCallback, useEffect, useState } from "react";
import { LoginSocialInstagram } from "../instgramSocialLogin/index";
import { IResolveParams, objectType } from "../export";
import { InstagramLoginButton } from "react-social-login-buttons";

const InstagramLoginComponent = () => {
	// const REDIRECT_URI = "https://819c-122-170-2-163.ngrok-free.app/";
	const REDIRECT_URI = window.location.href;
	console.log(REDIRECT_URI);

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
				<div className='logoutContainer'>
					{userDetails && (
						<div>
							<p>Hello, {userDetails?.username || "User"} </p>
							{/* <img className="image"
								src={userDetails?.picture || ""}
								alt=''
							/> */}
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
