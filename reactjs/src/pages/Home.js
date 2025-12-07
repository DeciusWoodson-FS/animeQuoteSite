import { Link } from "react-router-dom";
import "../App.css";

function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Anime Quote Home</h1>
        <Link to="/quotes">Your Anime Quotes</Link>
      </header>
    </div>
  );
}

export default Home;
