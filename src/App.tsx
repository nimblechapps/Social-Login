import FacebookLoginComponent from "./components/facebook";
import GitHubLoginComponent from "./components/github";
import GoogleLoginComponent from "./components/google";
import MicrosoftLoginComponent from "./components/microsoft";
import InstagramLoginComponent from "./components/instgram";

function App() {
	return (
		<>
			<div className='App'>
				<h1>Social Login</h1>
				<GoogleLoginComponent /> <br />
				<MicrosoftLoginComponent /> <br />
				<FacebookLoginComponent /> <br />
				<InstagramLoginComponent /> <br />
				<GitHubLoginComponent /> <br />
			</div>
		</>
	);
}

export default App;
