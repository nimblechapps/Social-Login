import React, { useCallback, useEffect, useState } from "react";
import { IResolveParams, LoginSocialGoogle, objectType } from "../export";
import { GoogleLoginButton } from "react-social-login-buttons";

const GoogleLoginComponent = () => {
	const [isLogedIn, setIsLogedIn] = useState(false);
	const [userDetails, setUserDetails] = useState<objectType | null>(null);

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

	const handleLogout = () => {
		localStorage.removeItem("googleLoginDetails");
		setIsLogedIn(false);
		setUserDetails(null);
	};

	const handleLogin = (data: IResolveParams) => {
		console.log("google login resolved", data);
		setIsLogedIn(true);
		localStorage.setItem("googleLoginDetails", JSON.stringify(data));
	};

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
