import React, { useCallback, useEffect, useState } from "react";
import { LoginSocialGithub } from "../githubSocialLogin/index";

const GitHubLoginComponent = () => {
	const REDIRECT_URI = window.location.href;

	return (
		<LoginSocialGithub
			isOnlyGetToken
			client_id='ca9d837d3d31a749264a'
			client_secret='31837b1ea349fd6f756480410f0a4f60f91eca25'
			redirect_uri={REDIRECT_URI}
			onResolve={(data) => {
				console.log("github login resolved", data);
			}}
			onReject={(error) => console.error("github login rejected", error)}>
			<button>Logout From Github</button>
		</LoginSocialGithub>
	);
};

export default GitHubLoginComponent;
