import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/navigation/Header";
import Footer from "../../components/navigation/Footer";
import Loader from "../../components/fragments/Loader";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      const response = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setLoading(false);
        navigate("/dashboard");
      } else {
        setLoading(false);
        // alert("Invalid credentials. Please try again.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.redirectUrl) {
        window.location.href = event.data.redirectUrl;
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const googlelogin = () => {
    const backendUrl = "/api/google/auth/google/login";
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
      {/* {loading ? <Loader /> : null} */}
      <div className="nav w-full">
        <Header />
      </div>
      <h1 className="py-4 text-2xl xl:text-3xl font-extrabold">Sign In</h1>
      <div className="mx-auto max-w-xs">
        <input
          className="w-full px-8 py-4 rounded-lg border border-gray-200 placeholder-gray-500 text-sm "
          type="email"
          id="email"
          autoComplete="off"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          className="w-full px-8 py-4 rounded-lg border border-gray-200 placeholder-gray-500 text-sm  mt-5"
          type="password"
          id="password"
          autoComplete="off"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button
          onClick={handleSubmit}
          className="mt-5 tracking-wide font-semibold bg-accent w-full py-4 rounded-lg hover:bg-primary transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
            />
          </svg>

          <span className="ml-3">Sign In</span>
        </button>
      </div>

      <div className="my-12 text-center">
        <div className="leading-none px-2 inline-block text-sm tracking-wide font-medium transform translate-y-1/2">
          Or sign In with Google
        </div>
      </div>

      <div className="flex w-full flex-col items-center">
        <button
          onClick={googlelogin}
          className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-background2 text-text border flex items-center justify-center hover:bg-background transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline"
        >
          <div className="p-2 rounded-full">
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
          </div>
          <span className="ml-4">Sign In with Google</span>
        </button>
      </div>
      <div>
        <div className="dont-have-account py-4 underline text-accent hover:text-primary">
          <Link to={"/subscription/signup"}>
            <p>Dont have an account? Sign up</p>
          </Link>
        </div>
      </div>
      <div className="footer w-full">
        <Footer />
      </div>
    </div>
  );
}
