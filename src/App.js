import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import "./App.css";
import initializeAuthentication from "./Firebase/firebase.initialize";
import { useState } from "react";

initializeAuthentication();

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [user, setUser] = useState({});
  const [newUser, setNewUser] = useState({});

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const toggleLogin = (e) => {
    setIsLogin(e.target.checked);
  };

  const auth = getAuth();
  const handleRegistration = (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password should be 6 characters or more");
      return;
    }
    if (!/(?=.*[A-Z].*[A-Z])/.test(password)) {
      setError("Password must be contain two Uppercase letters");
      return;
    }
    isLogin ? loginUser(email, password) : createNewUser(email, password);
  };

  const loginUser = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((result) => {
        const { displayName } = result.user;
        const user = {
          name: displayName,
          email: email,
        };
        setUser(user);
        setError("");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const createNewUser = (email, password, e) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((result) => {
        const { email } = result.user;
        const newUser = {
          email: email,
        };
        setNewUser(newUser);
        console.log(user);
        setError("");
        updateName();
        verifyEmail();
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const updateName = () => {
    updateProfile(auth.currentUser, { displayName: name })
      .then(() => {})
      .catch((error) => {
        setError(error);
      });
  };

  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
      .then(() => {})
      .catch((error) => {
        setError(error);
      });
  };

  const handlePasswordReset = () => {
    sendPasswordResetEmail(auth, email).then(() => {});
  };

  return (
    <div className="">
      <h2 className="text-primary text-center mt-3">
        Please {isLogin ? "Login" : "Register"}{" "}
      </h2>
      <form
        onSubmit={handleRegistration}
        className="row g-3 w-50 mx-auto my-auto"
      >
        <div className="col-md-6">
          <label htmlFor="inputEmail4" className="form-label">
            Email
          </label>
          <input
            onBlur={handleEmailChange}
            type="email"
            className="form-control"
            id="inputEmail4"
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="inputPassword4" className="form-label">
            Password
          </label>
          <input
            onBlur={handlePasswordChange}
            type="password"
            className="form-control"
            id="inputPassword4"
          />
        </div>

        {!isLogin && (
          <div className="col-12">
            <label htmlFor="inputAddress" className="form-label">
              Full Name
            </label>
            <input
              onBlur={handleNameChange}
              type="text"
              className="form-control"
              id="inputAddress"
              placeholder="your name"
            />
          </div>
        )}

        <div className="text-danger">{error}</div>

        <div className="col-12">
          <div className="form-check">
            <input
              onClick={toggleLogin}
              className="form-check-input"
              type="checkbox"
              id="gridCheck"
            />
            <label className="form-check-label" htmlFor="gridCheck">
              Already Registerd ?
            </label>
          </div>
        </div>

        <div className="col-12 d-flex justify-content-between ">
          <div className="">
            <button type="submit" className="btn btn-primary ">
              {isLogin ? "Login" : "Register"}
            </button>
          </div>
          {isLogin && (
            <div>
              <button
                onClick={handlePasswordReset}
                type="button"
                className="btn btn-link"
              >
                Forgot Password?
              </button>
            </div>
          )}
        </div>
      </form>
      {user.email && (
        <div>
          <h1 className="text-center text-primary m-5">Welcome {user.name}</h1>
        </div>
      )}
      {newUser.email && (
        <div>
          <h2 className="text-center text-primary m-5">
            Reigstration Completed
          </h2>
        </div>
      )}
    </div>
  );
}

export default App;
