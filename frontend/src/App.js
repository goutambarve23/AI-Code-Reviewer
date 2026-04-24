import React, { useState } from "react";

function App() {
  const [page, setPage] = useState("login");
  const [users, setUsers] = useState(
    JSON.parse(localStorage.getItem("users")) || []
);
 const [, setLoggedInUser] = useState(
  JSON.parse(localStorage.getItem("loggedInUser")) || null
);

  const [signupData, setSignupData] = useState({
    email: "",
    password: ""
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState("");
  const [explanation, setExplanation] = useState("");
  const [fixedCode, setFixedCode] = useState("");
  const [history, setHistory] = useState(
    JSON.parse(localStorage.getItem("history")) || []
);
  const [score, setScore] = useState(10);
  // SIGNUP
  const handleSignup = () => {
    const exists = users.find(user => user.email === signupData.email);

    if (exists) {
      alert("User already exists");
      return;
    }

    const updatedUsers = [...users, signupData];
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    alert("Signup successful! Please login.");
    setPage("login");
  };

  // LOGIN
  const handleLogin = () => {
    const user = users.find(
      user =>
        user.email === loginData.email &&
        user.password === loginData.password
    );

    if (user) {
      setLoggedInUser(user);
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      setPage("dashboard");
    } else {
      alert("Invalid email or password");
    }
  };

  // LOGOUT
  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem("loggedInUser");
    setPage("login");
  };

  // ANALYZE CODE
  const analyzeCode = async () => {
    setLoading(true);
    
  try {
    const response = await fetch("http://127.0.0.1:5001/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ code })
    });

    const data = await response.json();

    setResult(data.result);
    setScore(data.score);
    setSuggestions(data.suggestions);
    setExplanation(data.explanation);
    setLoading(false);

    const updatedHistory = [
  ...history,
  {
    code,
    result: data.result
  }
];

setHistory(updatedHistory);
localStorage.setItem("history", JSON.stringify(updatedHistory));

  } catch (error) {
    setResult("Error connecting backend");
    setLoading(false);
  }
};

  // FIX CODE
  const fixCode = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5001/fix", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ code })
      });

      const data = await response.json();
      setFixedCode(data.fixed_code);
    } catch (error) {
      setFixedCode("Error fixing code");
    }
  };

  // LOGIN PAGE
  if (page === "login") {
    return (
      <div style={styles.authContainer}>
        <div style={styles.card}>
          <h2>Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={loginData.email}
            onChange={(e) =>
              setLoginData({ ...loginData, email: e.target.value })
            }
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
            style={styles.input}
          />
          <button onClick={handleLogin} style={styles.neonbutton}>Login</button>
          <p>
            Don't have an account?{" "}
            <span style={styles.link} onClick={() => setPage("signup")}>
              Signup
            </span>
          </p>
        </div>
      </div>
    );
  }

  // SIGNUP PAGE
  if (page === "signup") {
    return (
      <div style={styles.authContainer}>
        <div style={styles.card}>
          <h2>Signup</h2>
          <input
            type="email"
            placeholder="Email"
            value={signupData.email}
            onChange={(e) =>
              setSignupData({ ...signupData, email: e.target.value })
            }
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={signupData.password}
            onChange={(e) =>
              setSignupData({ ...signupData, password: e.target.value })
            }
            style={styles.input}
          />
          <button onClick={handleSignup} style={styles.button}>Signup</button>
          <p>
            Already have an account?{" "}
            <span style={styles.link} onClick={() => setPage("login")}>
              Login
            </span>
          </p>
        </div>
      </div>
    );
  }

  // DASHBOARD
  return (
    <div style={styles.dashboard}>
      <div style={styles.sidebar}>
        <h2>AI Reviewer</h2>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>

        <h3 style={{ marginTop: "30px" }}>History</h3>
        <h3>Previous Reviews</h3>

        {history.map((item, index) => (
          <div key={index} style={styles.historyItem}>
            Review {index + 1}
          </div>
        ))}
      </div>

      <div style={styles.main}>
        <div style={styles.chatArea}>
          {code && <div style={styles.userBubble}>{code}</div>}
          {loading && <p>Analyzing code...</p>}

          {result && (
            <div style={styles.aiBubble}>
              <strong>Result:</strong> {result}
              <br /><br />
              <strong>Score:</strong> {score}
              <br /><br />
              <strong>Suggestions:</strong> {suggestions}
              <br /><br />
              <strong>Explanation:</strong> {explanation}
              <br /><br />
              <strong>Fixed Code:</strong>
              <pre>{fixedCode}</pre>
            </div>
          )}
        </div>

        <div style={styles.inputArea}>
          <textarea
            placeholder="Paste your code here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={styles.textarea}
          />
          <button onClick={analyzeCode} style={styles.button}>Analyze</button>
          <button onClick={fixCode} style={styles.fixBtn}>Fix Code</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  authContainer: {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#050816"
},
  card: {
  width: "350px",
  padding: "30px",
  borderRadius: "15px",
  background: "rgba(255,255,255,0.05)",
  boxShadow: "0 0 20px #00ffcc",
  color: "white",
  textAlign: "center"
},
  input: {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #00ffcc",
  background: "#111827",
  color: "white",
  outline: "none"
},
  neonButton: {
  width: "100%",
  padding: "12px",
  background: "#00ffcc",
  color: "black",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow: "0 0 15px #00ffcc"
},
  fixBtn: {
    marginTop: "10px",
    marginLeft: "10px",
    padding: "12px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },
 
  dashboard: {
  display: "flex",
  minHeight: "100vh",
  background: "#050816",
  color: "white"
},
  sidebar: {
  width: "250px",
  padding: "20px",
  background: "#0b1120",
  boxShadow: "0 0 20px #00ffcc"
},
  logoutBtn: {
  marginTop: "30px",
  width: "100%",
  padding: "12px",
  background: "#ff4d4d",
  border: "none",
  borderRadius: "8px",
  color: "white",
  fontWeight: "bold",
  boxShadow: "0 0 15px #ff4d4d"
},
link: {
  color: "#00ffcc",
  cursor: "pointer"
},

  main: {
    flex: 1,
    padding: "20px"
  },
  chatArea: {
    marginBottom: "20px"
  },
  userBubble: {
    background: "#10a37f",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px"
  },
 resultBox: {
  width: "80%",
  marginTop: "25px",
  padding: "20px",
  background: "#111827",
  borderRadius: "12px",
  boxShadow: "0 0 15px #00ffcc"
},
  textarea: {
  width: "80%",
  height: "180px",
  padding: "15px",
  background: "#111827",
  color: "white",
  border: "1px solid #00ffcc",
  borderRadius: "10px",
  outline: "none"
},
  historyItem: {
  padding: "10px",
  marginTop: "10px",
  background: "#111827",
  borderRadius: "8px",
  boxShadow: "0 0 8px #00ffcc"
},
};

export default App;