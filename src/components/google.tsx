import React, { useCallback, useEffect, useState } from "react";
import { IResolveParams, LoginSocialGoogle, objectType } from "../export";
import { ObjectType } from "typescript";

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
					<button onClick={handleLogout}>Logout from Google</button>
				</div>
			) : (
				<LoginSocialGoogle
					isOnlyGetToken={false}
					client_id={process.env.REACT_APP_GOOGLE_APP_ID || ""}
					onResolve={handleLogin}
					onReject={(error) =>
						console.log("google login rejected", error)
					}>
					<button>Login with Google</button>
				</LoginSocialGoogle>
			)}
		</>
	);
};

export default GoogleLoginComponent;
