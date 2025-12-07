import { Link } from "react-router-dom";
import "../App.css";
import styled from "styled-components";

//Styling for title
const StyledH1 = styled.h1`
  color: #6200ee;
  font-family: "Roboto", sans-serif;
  font-weight: 500;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
`;

//Styling for link button leading to quotes
const StyledLink = styled(Link)`
  background: #121212;
  border-radius: 50px;
  border: 1px solid #333;
  color: #6200ee;
  font-family: "Roboto", sans-serif;
  font-weight: 300;
  font-size: 1.3rem;
  padding: 0.75rem;
  text-decoration: none;
  cursor: pointer;
  transition: filter 0.2s ease-in-out;
  align-self: flex-center;
  margin-top: 1rem;
  width: 200px;
  &:hover {
    filter: brightness(1.5);
  }
`;

function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <StyledH1>Anime Quote Home</StyledH1>
        <StyledLink to="/quotes">Your Anime Quotes</StyledLink>
      </header>
    </div>
  );
}

export default Home;
