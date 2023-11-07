import { useEffect, useState } from "react";

import LoginSocialFacebook from "../facebookSocialLogin/index";
import { IResolveParams, objectType } from "../export";
import { FacebookLoginButton } from "react-social-login-buttons";

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
				<div className='logoutContainer'>
					{userDetails && (
						<div>
							<p>Hello, {userDetails?.name || "User"} </p>
							{/* <img className="image"
								src={
									userDetails?.picture?.url ||
									"https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=3181743225460514&height=50&width=50&ext=1701851848&hash=AeS0YJQACbq2bGFNlSY"
								}
								alt=''
							/> */}
						</div>
					)}
					<button className='btnLogout' onClick={handleLogout}>
						Logout from Facebook
					</button>
				</div>
			) : (
				<LoginSocialFacebook
					appId={process.env.REACT_APP_FACEBOOK_APP_ID || ""} // Replace with your Facebook App ID
					onLoginStart={() => console.log("Facebook login started")}
					onResolve={handleLogin}
					onReject={(error) =>
						console.error("Facebook login rejected", error)
					}>
					<FacebookLoginButton />
				</LoginSocialFacebook>
			)}
		</>
	);
};

export default FacebookLoginComponent;
