/* eslint-disable no-empty-pattern */
import { useEffect, useState } from "react";
import { LoginSocialMicrosoft } from "../microsoftSocialLogin/index";
import { IResolveParams, objectType } from "../export";
import { MicrosoftLoginButton } from "react-social-login-buttons";

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
				<div className='logoutContainer'>
					{userDetails && (
						<div>
							<p>
								Hello,{" "}
								{userDetails?.userPrincipalName || "User"}{" "}
							</p>
							{/* <img className="image"
								src={userDetails?.picture || ""}
								alt=''
							/> */}
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
