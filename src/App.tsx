import "./App.css";
import FacebookLoginComponent from "./components/facebook";
import GitHubLoginComponent from "./components/github";
import GoogleLoginComponent from "./components/google";
import MicrosoftLoginComponent from "./components/microsoft";
import InstagramLoginComponent from "./components/instgram";

function App() {
	return (
		<>
			<div className='App'>
				<h1>Reactjs Login</h1>
				<FacebookLoginComponent /> <br />
				<GitHubLoginComponent /> <br />
				<GoogleLoginComponent /> <br />
				<MicrosoftLoginComponent /> <br />
				<InstagramLoginComponent /> <br />
			</div>
		</>
	);
}

export default App;
