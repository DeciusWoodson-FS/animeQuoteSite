import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

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
    process.env.NODE_ENV === "development"
      ? `http://localhost:3000`
      : process.env.REACT_APP_BASE_URL;

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
        <h1>Your Anime Quotes</h1>
        <Link to="/">Home</Link>

        <form onSubmit={handleSubmit}>
          <h2>{editingId ? "Edit Quote" : "Create New Quote"}</h2>
          <label>
            Character:
            <input
              type="text"
              name="character"
              value={values.character}
              onChange={handleInputChanges}
              required
            />
          </label>
          <label>
            Anime:
            <input
              type="text"
              name="anime"
              value={values.anime}
              onChange={handleInputChanges}
              required
            />
          </label>
          <label>
            Quote:
            <textarea
              name="quote"
              value={values.quote}
              onChange={handleInputChanges}
              required
            />
          </label>
          <div>
            <input
              type="submit"
              value={editingId ? "Update Quote" : "Create Quote"}
            />
            {editingId && (
              <button type="button" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <div>
          <h2>All Quotes</h2>
          {quotes.length === 0 ? (
            <p>No quotes found. Add some quotes!</p>
          ) : (
            <ul>
              {quotes.map((quote) => (
                <li key={quote._id}>
                  <h3>{quote.character}</h3>
                  <p>"{quote.quote}"</p>
                  <p>From: {quote.anime}</p>
                  <button onClick={() => startEdit(quote)}>Edit</button>
                  <button onClick={() => deleteQuote(quote._id)}>Delete</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>
    </div>
  );
}

export default Quotes;
