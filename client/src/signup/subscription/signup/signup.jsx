import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Header from "../../../components/navigation/Header";
import Footer from "../../../components/navigation/Footer";
import Loader from "../../../components/fragments/Loader";

export default function SignupMain() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const plan = params.get("plan");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    subscription: `${plan}`
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await fetch(`/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
        credentials: "include" // Send cookies with the request
      });

      if (response.ok) {
        setLoading(false);
        // Successful registration, proceed to the next signup step
        navigate("/subscription/signup/details"); // Use navigate for internal routing
      } else {
        const data = await response.json();

        if (data.error === "Email already exists.") {
          setLoading(false);
          // Redirect to login page if email already exists
          // alert("Email already exists. Redirecting to login...");
          navigate("/login");
        } else if (data.message === "User registered successfully!") {
          setLoading(false);
          navigate("/subscription/signup/details"); // Use navigate for internal routing
        } else {
          setLoading(false);
          // Show a general error alert for other cases
          // alert("Signup failed. Please try again.");
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
      // alert("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    console.log({ eventmanager: "loaded" });
    // In the parent window (opener window)
    window.addEventListener("message", (event) => {
      // Make sure the message is coming from a trusted source
      if (event.origin !== import.meta.env.VITE_SERVER_BASE_URL) {
        console.warn("Message received from untrusted origin:", event.origin);
        return;
      }

      // Check for the expected data in the message
      if (event.data && event.data.redirectUrl) {
        const redirectUrl = event.data.redirectUrl;
        console.log("Redirect URL received:", redirectUrl);

        // Redirect the parent window to the received URL
        window.location.href = redirectUrl;
      }
    });
  }, []);

  const googlesignup = () => {
    const backendUrl = `/api/google/auth/google/signup?plan=${plan}`;
    const authWindow = window.open(
      backendUrl,
      "_blank",
      "width=500,height=600"
    );
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="nav w-full">
        <Header />
      </div>
      <div className="icon pt-[50px] w-fit min-w-[200px] h-fit">
        <img src="/icons/signup.svg" alt="signup svg" />
      </div>
      <div className="w-full py-10 flex flex-col justify-center items-center">
        <div className="title text-4xl font-bold">
          <h1>Signup</h1>
        </div>
        <form onSubmit={handleSubmit} className="form space-y-4 p-4">
          <input
            className="px-2 py-2 w-full rounded-lg border-2 border-accent focus:bg-secondary"
            type="email"
            id="email"
            autoComplete="off"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            className="px-2 py-2 w-full rounded-lg border-2 border-accent focus:bg-secondary"
            type="password"
            id="password"
            autoComplete="off"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="px-4 py-2 bg-accent text-white rounded-lg w-full hover:bg-secondary"
          >
            {loading ? "signing up....." : " Sign Up"}
          </button>
        </form>

        <div className="my-12 text-center">
          <div className="leading-none px-2 inline-block text-sm tracking-wide font-medium transform translate-y-1/2">
            Or sign In with Google
          </div>
        </div>

        <div className="social">
          <button
            onClick={googlesignup}
            className="rounded-lg flex flex-row gap-3 px-3 py-2 bg-background2 hover:bg-primary hover:text-background transition-all duration-300 ease-in-out"
          >
            <svg className="w-4" viewBox="0 0 533.5 544.3">
              <path
                d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
                fill="#4285f4"
              />
              <path
                d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
                fill="#34a853"
              />
              <path
                d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
                fill="#fbbc04"
              />
              <path
                d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
                fill="#ea4335"
              />
            </svg>
            <span> Sign up with Google</span>
          </button>
        </div>
        <div className="already-have-account py-4 underline hover:text-primary">
          <Link to={"/login"}>
            <p>Already have an account? Sign in</p>
          </Link>
        </div>
      </div>
      <div className="foot w-full">
        <Footer />
      </div>
    </div>
  );
}
