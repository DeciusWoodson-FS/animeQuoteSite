import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import styled from "styled-components";

//
// Styling for title
const StyledH1 = styled.h1`
  color: #6200ee;
  font-family: "Roboto", sans-serif;
  font-weight: 500;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
`;

// Styling for link back to home

const StyledLink = styled(Link)`
  background: #121212;
  border-radius: 50px;
  border: 1px solid #333;
  color: #6200ee;
  font-family: "Roboto", sans-serif;
  font-weight: 300;
  font-size: 2rem;
  padding: 0.75rem;
  margin-bottom: 1rem;
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

// Top side styling for the page
// Styling for form
const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #121212;
  padding: 2rem;
  border-radius: 50px;
  border: 1px solid #333;
`;

// Styling for input fields
const StyledInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border-radius: 50px;
  border: 1px solid #333;
  background: #292929;
  color: #ffffff;
`;

// Styling for labels
const StyledLabel = styled.label`
  color: #ffffff;
  font-family: "Roboto", sans-serif;
  font-weight: 300;
  font-size: 1.3rem;
  margin-bottom: 1rem;
`;

// Styling for submit button
const StyledButton = styled.button`
  background: #121212;
  border-radius: 50px;
  border: 1px solid #333;
  color: #ffffff;
  font-size: 1.3rem;
`;

// Styling for unordered list(all quotes)
const StyledUl = styled.ul`
  background: #121212;
  border-radius: 50px;
  border: 1px solid #333;
  padding: 5rem;
  padding-left: 10rem;
  padding-right: 10rem;
  width: auto;
  justify-content: center;
  align-items: center;
  list-style: none;
  margin: 0 auto;
`;

function Quotes() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [values, setValues] = useState({
    character: "",
    anime: "",
    quote: "",
  });

  const API_BASE =
    process.env.NODE_ENV === "development" ? `http://localhost:3000` : "";

  useEffect(() => {
    let ignore = false;

    if (!ignore) {
      getQuotes();
    }

    return () => {
      ignore = true;
    };
  }, []);

  const getQuotes = async () => {
    setLoading(true);
    try {
      await fetch(`${API_BASE}/quotes`)
        .then((res) => res.json())
        .then((data) => {
          console.log({ data });
          setQuotes(data);
        });
    } catch (error) {
      setError(error.message || "Unexpected Error");
    } finally {
      setLoading(false);
    }
  };

  const createQuote = async () => {
    try {
      await fetch(`${API_BASE}/quotes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((res) => res.json())
        .then((data) => {
          setValues({ character: "", anime: "", quote: "" });
          getQuotes();
        });
    } catch (error) {
      setError(error.message || "Unexpected Error");
    }
  };

  const updateQuote = async (id) => {
    try {
      await fetch(`${API_BASE}/quotes/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((res) => res.json())
        .then((data) => {
          setEditingId(null);
          setValues({ character: "", anime: "", quote: "" });
          getQuotes();
        });
    } catch (error) {
      setError(error.message || "Unexpected Error");
    }
  };

  const deleteQuote = async (id) => {
    if (window.confirm("Are you sure you want to delete this quote?")) {
      try {
        await fetch(`${API_BASE}/quotes/${id}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((data) => {
            getQuotes();
          });
      } catch (error) {
        setError(error.message || "Unexpected Error");
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (editingId) {
      updateQuote(editingId);
    } else {
      createQuote();
    }
  };

  const handleInputChanges = (event) => {
    event.persist();
    setValues((values) => ({
      ...values,
      [event.target.name]: event.target.value,
    }));
  };

  const startEdit = (quote) => {
    setEditingId(quote._id);
    setValues({
      character: quote.character,
      anime: quote.anime,
      quote: quote.quote,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setValues({ character: "", anime: "", quote: "" });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="App">
      <header className="App-header">
        <StyledH1>Your Anime Quotes</StyledH1>
        <StyledLink to="/">Home</StyledLink>

        <StyledForm onSubmit={handleSubmit}>
          <h2>{editingId ? "Edit Quote" : "Create New Quote"}</h2>
          <StyledLabel>
            Character:
            <StyledInput
              type="text"
              name="character"
              value={values.character}
              onChange={handleInputChanges}
              required
            />
          </StyledLabel>
          <StyledLabel>
            Anime/Game:
            <StyledInput
              type="text"
              name="anime"
              value={values.anime}
              onChange={handleInputChanges}
              required
            />
          </StyledLabel>
          <StyledLabel>
            Quote:
            <StyledInput
              type="text"
              name="quote"
              value={values.quote}
              onChange={handleInputChanges}
              required
            />
          </StyledLabel>
          <div>
            <StyledInput
              type="submit"
              value={editingId ? "Update Quote" : "Create Quote"}
            />
            {editingId && (
              <StyledButton type="button" onClick={cancelEdit}>
                Cancel
              </StyledButton>
            )}
          </div>
        </StyledForm>

        <div>
          <h2>All Quotes</h2>
          {quotes.length === 0 ? (
            <p>No quotes found. Add some quotes!</p>
          ) : (
            <StyledUl>
              {quotes.map((quote) => (
                <li key={quote._id}>
                  <h3>{quote.character}</h3>
                  <p>"{quote.quote}"</p>
                  <p>From: {quote.anime}</p>
                  <StyledButton type="button" onClick={() => startEdit(quote)}>
                    Edit
                  </StyledButton>
                  <StyledButton
                    type="button"
                    onClick={() => deleteQuote(quote._id)}
                  >
                    Delete
                  </StyledButton>
                </li>
              ))}
            </StyledUl>
          )}
        </div>
      </header>
    </div>
  );
}

export default Quotes;
