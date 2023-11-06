/* eslint-disable no-empty-pattern */
import React, { useCallback, useEffect, useState } from "react";
import { LoginSocialMicrosoft } from "../microsoftSocialLogin/index";
import { IResolveParams, objectType } from "../export";

const MicrosoftLoginComponent = () => {
	const REDIRECT_URI = window.location.href;

	const [isLogedIn, setIsLogedIn] = useState(false);
	const [userDetails, setUserDetails] = useState<objectType | null>(null);

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

	const handleLogout = () => {
		localStorage.removeItem("microsoftLoginDetails");
		setIsLogedIn(false);
		setUserDetails(null);
	};

	const handleLogin = (data: IResolveParams) => {
		console.log("microsoft login resolved", data);
		setIsLogedIn(true);
		localStorage.setItem("microsoftLoginDetails", JSON.stringify(data));
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
						Logout from Microsoft
					</button>
				</div>
			) : (
				<LoginSocialMicrosoft
					// isOnlyGetToken
					client_id='a7e498ec-bd04-4ccf-84e0-a3c17e8ac4b7'
					redirect_uri={REDIRECT_URI}
					onResolve={handleLogin}
					onReject={(error) =>
						console.error("microsoft login rejected", error)
					}>
					<button>Login with Microsoft</button>
				</LoginSocialMicrosoft>
			)}
		</>
	);
};

export default MicrosoftLoginComponent;
