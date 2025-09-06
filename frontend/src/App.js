import "./App.css";
import { useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch(
      "https://harikeerth-url-proxy.vercel.app/api/shorten",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      }
    );
    const data = await res.json();
    setShortUrl(`https://harikeerth-url-proxy.vercel.app/${data.shortCode}`);
  }
  return (
    <div className="root">
      <form onSubmit={handleSubmit}>
        <h1>URL Proxy :) </h1>
        <p>
          (might take 5 to 10 sec for first generation, since it is deployed in
          free tier vercel)
        </p>
        <input
          type="text"
          value={url}
          placeholder="Enter long url"
          onChange={(e) => setUrl(e.target.value)}
        />
        <button type="submit">Submit</button>
        {shortUrl && (
          <p>
            Short URL: <a href={shortUrl}>{shortUrl}</a>
          </p>
        )}
      </form>
    </div>
  );
}

export default App;
