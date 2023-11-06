import React, { useCallback, useEffect, useState } from "react";

import LoginSocialFacebook from "../facebookSocialLogin/index";
import { IResolveParams, objectType } from "../export";

const FacebookLoginComponent = () => {
	const [isLogedIn, setIsLogedIn] = useState(false);
	const [userDetails, setUserDetails] = useState<objectType | null>(null);

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

	const handleLogout = () => {
		localStorage.removeItem("facebookLoginDetails");
		setIsLogedIn(false);
		setUserDetails(null);
	};

	const handleLogin = (data: IResolveParams) => {
		console.log("facebook login resolved", data);
		setIsLogedIn(true);
		localStorage.setItem("facebookLoginDetails", JSON.stringify(data));
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
								src={
									userDetails?.picture?.url ||
									"https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=3181743225460514&height=50&width=50&ext=1701851848&hash=AeS0YJQACbq2bGFNlSY"
								}
								alt=''
							/>
						</>
					)}
					<button onClick={handleLogout}>Logout from Facebook</button>
				</div>
			) : (
				<LoginSocialFacebook
					appId={process.env.REACT_APP_FACEBOOK_APP_ID || ""} // Replace with your Facebook App ID
					onLoginStart={() => console.log("Facebook login started")}
					onResolve={handleLogin}
					onReject={(error) =>
						console.error("Facebook login rejected", error)
					}>
					<button>Login with Facebook</button>
				</LoginSocialFacebook>
			)}
		</>
	);
};

export default FacebookLoginComponent;
