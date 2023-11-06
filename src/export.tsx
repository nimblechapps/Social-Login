export type objectType = {
	[key: string]: any;
};

export type IResolveParams = {
	provider: string;
	data?: objectType;
};

export { default as LoginSocialFacebook } from "./facebookSocialLogin/index";
export { default as LoginSocialGithub } from "./githubSocialLogin/index";
export { default as LoginSocialGoogle } from "./googleSocialLogin/index";
export { default as LoginSocialMicrosoft } from "./microsoftSocialLogin/index";
export { default as LoginSocialInstagram } from "./instgramSocialLogin/index";
