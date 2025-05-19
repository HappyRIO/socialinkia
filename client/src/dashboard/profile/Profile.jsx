import { useState, useEffect } from "react";
import ResponsiveSidebar from "../../components/navigation/ResponsiveSidebar";
import { Facebook, Instagram } from "lucide-react";
import { BsTwitterX } from "react-icons/bs";
import Loader from "../../components/fragments/Loader";

export default function Profile() {
  const [formData, setFormData] = useState({
    userName: "",
    logo: null,
    logoPreview: null, // For preview
    companyTradeName: "",
    businessSector: "",
    addressVisible: "",
    country: "",
    province: "",
    locality: "",
    postalCode: "",
    webPage: "",
    webPageUrl: "",
    showContactInfo: "",
    contactInfo: "",
    photos: [],
    photosPreview: [], // For preview
    schedule: "",
    sales_channels: "",
    motto: "",
    motto_field: "",
    business_definition: [],
    business_definition_other: "",
    highlight: "",
    star_product: "",
    star_product_field: "",
    features: "",
    add_products: "no",
    add_products_field: "",
    add_features: "",
    objectives: "",
    exterior_photo: null,
    interior_photo: null,
    special_place_photo: null,
    staff_photo: null,
    area_of_influence: "",
    customer_type: [],
    age_range: [],
    valuable_content: [],
    valuable_content_other: "",
    communication_style: "",
    communication_style_other: "",
  });
  const [loading, setLoading] = useState(false);
  const [connectfb, setconnectfb] = useState(false);
  const [connectig, setconnectig] = useState(false);
  const [connectxcom, setconnectxcom] = useState(null);

  useEffect(() => {
    async function fetchUserInfo() {
      setLoading(true);
      try {
        const response = await fetch("/api/auth/user/details", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await response.json();
        setFormData({
          ...formData,
          ...data.user.companyDetails,
          logoPreview: data.user.companyDetails?.logo || null, // For preview
          photos: data.user.companyDetails?.photos || [],
          photosPreview: data.user.companyDetails?.photos
        });
        if (data.user.selectedXcom) {
          setconnectxcom(true);
        }
        if (data.user.selectedFacebookBusinessPage) {
          setconnectfb(true);
        }
        if (data.user.selectedInstagramBusinessPage) {
          setconnectig(true);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    }
    fetchUserInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value, files, checked } = e.target;

    if (name === "photos") {
      setFormData((prev) => ({
        ...prev,
        photos: files ? Array.from(files) : [],
      }));
    } else if (name === "logo" && files && files[0]) {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        logo: file, // Save the File directly (like in photos)
        logoPreview: URL.createObjectURL(file), // For preview
      }));
    } else if (name === "business_definition") {
      setFormData((prev) => {
        const currentSelections = prev.business_definition || [];

        if (checked) {
          if (currentSelections.length < 3) {
            return {
              ...prev,
              business_definition: [...currentSelections, value],
            };
          } else {
            return prev;
          }
        } else {
          return {
            ...prev,
            business_definition: currentSelections.filter(
              (item) => item !== value
            ),
          };
        }
      });
    } else if (name === "customer_type") {
      setFormData((prevData) => {
        const updatedCustomerType = checked
          ? [...prevData.customer_type, value] // Add value if checked
          : prevData.customer_type.filter((type) => type !== value); // Remove value if unchecked

        return {
          ...prevData,
          customer_type: updatedCustomerType,
        };
      });
    } else if (name === "age_range") {
      setFormData((prevData) => {
        const updatedAgeRange = checked
          ? [...prevData.age_range, value]
          : prevData.age_range.filter((age) => age !== value);

        return {
          ...prevData,
          age_range: updatedAgeRange,
        };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "photos" && Array.isArray(value)) {
        value.forEach((file) => form.append(key, file)); // Append multiple photos
      } else if (key === "logo" && value) {
        form.append(key, value); // Append the logo file
      } else if (Array.isArray(value)) {
        value.forEach((item) => form.append(key, item)); // Handle arrays
      } else {
        form.append(key, value); // Append other fields
      }
    });

    try {
      const response = await fetch("/api/auth/user/details", {
        method: "PUT",
        body: form,
        credentials: "include",
      });

      if (response.ok) {
        setLoading(false);
        alert("Profile updated successfully!");
      } else {
        console.error("Update failed:", response.statusText);
        alert("Update failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  function openAuthPopup(url, onSuccess) {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const authWindow = window.open(
      url,
      "AuthPopup",
      `width=${width},height=${height},top=${top},left=${left}`
    );

    const timer = setInterval(() => {
      if (authWindow.closed) {
        clearInterval(timer);
        onSuccess();
      }
    }, 500);
  }

  function handleconnectFacebook() {
    openAuthPopup(`/api/facebook/auth/facebook`, () => {
      setconnectfb(true);
    });
  }

  function handleconnectInstagram() {
    openAuthPopup(`/api/instagram/auth/instagram`, () => {
      setconnectig(true);
    });
  }

  function handleConnectXcom() {
    openAuthPopup(`/api/x/auth/xcom`, () => {
      setconnectig(true);
      window.location.href = "/dashboard/profile";
    });
  }

  return (
    <div className="w-full flex flex-row justify-center items-center">
      {loading ? (
        <Loader />
      ) : (
        <div className="w-full ml-0 sm:ml-64 py-3 px-2 flex flex-col justify-center items-center">
          <div className="flex gap-2 flex-col sm:flex-row justify-between w-full px-4 py-2">
            <button
              className="bg-black/50 w-full h-[100px] flex flex-col justify-center items-center text-white p-4 rounded-lg shadow-lg"
              onClick={handleConnectXcom}
            >
              {connectxcom ? "x.com connected" : "connect x.com"}
              <BsTwitterX />
            </button>
            <button
              onClick={handleconnectFacebook}
              className="bg-blue-500 w-full h-[100px] flex flex-col justify-center items-center text-white p-4 rounded-lg shadow-lg"
            >
              {connectfb ? "Facebook Connected" : "Connect Facebook"}
              <Facebook />
            </button>
            <button
              onClick={handleconnectInstagram}
              className="bg-red-400 w-full h-[100px] flex flex-col justify-center items-center text-white p-4 rounded-lg shadow-lg"
            >
              {connectig ? "Instagram Connected" : "Connect Instagram"}
              <Instagram />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="form flex flex-col gap-2 justify-center w-full"
          >
            <div className="form-section-1 bg-background2 flex flex-col justify-center items-center gap-3 rounded-lg p-2">
              <h2 className="text-lg font-bold">Block 1: YOUR BUSINESS</h2>
              <input
                className="p-2 bg-background rounded-lg w-full"
                type="text"
                name="userName"
                placeholder="Your user name"
                value={formData.userName}
                onChange={handleChange}
              />
              <label
                htmlFor="logo"
                className="text-left w-full text-sm text-gray-500"
              >
                logo
              </label>
              <input
                className="p-2 bg-background rounded-lg w-full"
                type="file"
                name="logo"
                accept=".png,.jpg,.jpeg"
                onChange={handleChange}
              />
              {formData.logoPreview && (
                <img
                  src={formData.logoPreview}
                  alt="Logo Preview"
                  className="mt-2 w-24 h-24 object-cover rounded-lg"
                />
              )}
              <input
                className="p-2 bg-background rounded-lg w-full"
                type="text"
                name="companyTradeName"
                placeholder="Company trade name"
                value={formData.companyTradeName}
                onChange={handleChange}
              />
              <select
                className="p-2 bg-background rounded-lg w-full"
                name="businessSector"
                value={formData.businessSector}
                onChange={handleChange}
              >
                <option value="">Main business sector</option>
                {[
                  "Craft",
                  "Children's items",
                  "Consulting",
                  "Café",
                  "Carnage",
                  "Hunt",
                  "Beauty center",
                  "Veterinary center",
                  "Decoration",
                  "E-commerce multiproduct",
                  "Sports and fitness",
                  "Household appliances",
                  "Events",
                  "Hardware",
                  "Physiotherapy",
                  "Training",
                  "Photograph",
                  "Nurseries",
                  "Real estate",
                  "Gardening",
                  "Jeweler's",
                  "Legal and juridical",
                  "Cleaning",
                  "Marketing",
                  "Fashion and accessories",
                  "Music",
                  "Leisure and free time",
                  "Orthopedics",
                  "Bakery",
                  "Hair salon",
                  "Data protection and GDPR",
                  "Psychology",
                  "Restaurant",
                  "Health-well-being",
                  "Dental health",
                  "Insurance",
                  "IT Services",
                  "Car workshop",
                  "Motorcycle workshop",
                  "Pet store",
                  "Tourism",
                  "Trips",
                  "Spirituality/Esotericism",
                  "Chiropodist",
                  "Other",
                ].map((sector) => (
                  <option key={sector} value={sector}>
                    {sector}
                  </option>
                ))}
              </select>
              <select
                className="p-2 bg-background rounded-lg w-full"
                name="addressVisible"
                value={formData.addressVisible}
                onChange={handleChange}
              >
                <option value="">
                  Should the physical address of the business appear?
                </option>
                <option value="NO">No</option>
                <option value="YES">Yes</option>
              </select>
              {formData.addressVisible === "YES" && (
                <>
                  <input
                    className="p-2 bg-background rounded-lg w-full"
                    type="text"
                    name="country"
                    placeholder="Country (e.g., Spain)"
                    value={formData.country}
                    onChange={handleChange}
                  />
                  <select
                    className="p-2 bg-background rounded-lg w-full"
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                  >
                    <option value="">Province</option>
                    {[
                      "A Coruña",
                      "Alava",
                      "Alicante",
                      "Almeria",
                      "Asturias",
                      "Avila",
                      "Badajoz",
                      "Barcelona",
                      "Burgos",
                      "Caceres",
                      "Cadiz",
                      "Cantabria",
                      "Castellon",
                      "City Royal",
                      "Cordova",
                      "Basin",
                      "Girona",
                      "Grenade",
                      "Guadalajara",
                      "Guipuzcoa",
                      "Huelva",
                      "Huesca",
                      "Balearic Islands",
                      "Jaen",
                      "Corunna",
                      "Rioja",
                      "Las Palmas",
                      "Lion",
                      "Lleida",
                      "Lugo",
                      "Madrid",
                      "Malaga",
                      "Murcia",
                      "Navarre",
                      "Ourense",
                      "Palencia",
                      "Pontevedra",
                      "Salamanca",
                      "Santa Cruz de Tenerife",
                      "Segovia",
                      "Seville",
                      "Soria",
                      "Tarragona",
                      "Teruel",
                      "Toledo",
                      "Valencia",
                      "Valladolid",
                      "Biscay (Bizkaia)",
                      "Zamora",
                      "Saragossa",
                    ].map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                  <input
                    className="p-2 bg-background rounded-lg w-full"
                    type="text"
                    name="locality"
                    placeholder="Locality"
                    value={formData.locality}
                    onChange={handleChange}
                  />
                  <input
                    className="p-2 bg-background rounded-lg w-full"
                    type="text"
                    name="postalCode"
                    placeholder="Postal Code"
                    value={formData.postalCode}
                    onChange={handleChange}
                  />
                </>
              )}
              <select
                className="p-2 bg-background rounded-lg w-full"
                name="webPage"
                value={formData.webPage}
                onChange={handleChange}
              >
                <option value="">Do you have a web page?</option>
                <option value="NO">No</option>
                <option value="YES">Yes</option>
              </select>
              {formData.webPage === "YES" && (
                <input
                  className="p-2 bg-background rounded-lg w-full"
                  type="text"
                  name="webPageUrl"
                  placeholder="Website URL"
                  value={formData.webPageUrl}
                  onChange={handleChange}
                />
              )}
              <select
                className="p-2 bg-background rounded-lg w-full"
                name="showContactInfo"
                value={formData.showContactInfo}
                onChange={handleChange}
              >
                <option value="">Show phone or email?</option>
                <option value="NO">No</option>
                <option value="YES">Yes</option>
              </select>
              {formData.showContactInfo === "YES" && (
                <input
                  className="p-2 bg-background rounded-lg w-full"
                  type="text"
                  name="contactInfo"
                  placeholder="Contact Information (e.g., +34...)"
                  value={formData.contactInfo}
                  onChange={handleChange}
                />
              )}
            </div>
            {/* Block 2: products or services */}
            <div className="form-section-2 bg-background2 flex flex-col justify-center items-center gap-3 rounded-lg p-2">
              <h2 className="text-lg font-bold">
                Block 2: Tell us about your products or services
              </h2>

              <label htmlFor="schedule" className="block font-medium">
                What days are you open?
              </label>
              <select
                id="schedule"
                name="schedule"
                className="p-2 bg-background rounded-lg w-full"
                value={formData.schedule}
                onChange={handleChange}
              >
                <option value="">Choose an option</option>
                <option value="week">
                  Week: Monday-Tuesday-Wednesday-Thursday-Friday-Saturday-Sunday
                </option>
                <option value="week_no_weekends">
                  Week without weekends:
                  Monday-Tuesday-Wednesday-Thursday-Friday
                </option>
                <option value="all_weekend">
                  All weekend (Saturdays and Sundays)
                </option>
                <option value="never_close">We never close</option>
              </select>

              <label
                htmlFor="sales_channels"
                className="block mt-4 font-medium"
              >
                Sales or customer service channels
              </label>
              <select
                id="sales_channels"
                name="sales_channels"
                className="p-2 bg-background rounded-lg w-full"
                value={formData.sales_channels}
                onChange={handleChange}
              >
                <option value="">Choose an option</option>
                <option value="ecommerce_24hrs">
                  I am an ecommerce (online sales) store open 24 hours a day
                </option>
                <option value="ecommerce_service_hours">
                  I am an Ecommerce (online sales) with customer service hours
                </option>
                <option value="ecommerce_physical">
                  In addition to an Ecommerce, I have a place with physical
                  sales
                </option>
                <option value="physical_location">
                  I only have one physical location
                </option>
              </select>

              <label htmlFor="motto" className="block mt-4 font-medium">
                Motto
              </label>
              <select
                id="motto"
                name="motto"
                className="p-2 bg-background rounded-lg w-full"
                value={formData.motto}
                onChange={handleChange}
              >
                <option value="">Choose an option</option>
                <option value="have">Have</option>
                <option value="dont_have">Don&apos;t have</option>
              </select>
              <textarea
                id="motto_field"
                name="motto_field"
                className="mt-2 border-[2px] outline-none focuse:outline-none border-background p-2 rounded-lg w-full"
                placeholder="Add your motto here (if applicable)"
                value={formData.motto_field}
                onChange={handleChange}
              ></textarea>

              <label
                htmlFor="business_definition"
                className="block mt-4 font-medium"
              >
                How would you define your business?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Attention",
                  "Creativity",
                  "Strategy",
                  "Experience",
                  "Quality",
                  "Closeness",
                  "Knowledge",
                  "Artisanal",
                  "Innovation",
                  "Passion",
                  "Personalization",
                  "Planning",
                  "Price",
                  "Professionalism",
                  "Service",
                  "Speed",
                  "Technology",
                  "Traditional",
                  "Vision",
                ].map((item) => (
                  <label key={item}>
                    <input
                      type="checkbox"
                      name="business_definition"
                      value={item}
                      checked={formData.business_definition.includes(item)}
                      onChange={handleChange}
                    />{" "}
                    {item}
                  </label>
                ))}
                <textarea
                  id="business_definition_other"
                  name="business_definition_other"
                  className="mt-2 border-[2px] outline-none focuse:outline-none border-background p-2 rounded-lg w-full"
                  placeholder="Other (please specify)"
                  value={formData.business_definition_other}
                  onChange={handleChange}
                ></textarea>
              </div>

              <label htmlFor="highlight" className="block mt-4 font-medium">
                What would you like to highlight about your business?
              </label>
              <textarea
                id="highlight"
                name="highlight"
                className="p-2 bg-background rounded-lg w-full"
                placeholder="Free text field"
                value={formData.highlight}
                onChange={handleChange}
              ></textarea>

              <label htmlFor="star_product" className="block mt-4 font-medium">
                Star service or product
              </label>
              <select
                id="star_product"
                name="star_product"
                className="p-2 bg-background rounded-lg w-full"
                value={formData.star_product}
                onChange={handleChange}
              >
                <option value="">Choose an option</option>
                <option value="product">Product</option>
                <option value="service">Service</option>
                <option value="both">Both product or service options</option>
              </select>
              <input
                type="text"
                id="star_product_field"
                name="star_product_field"
                className="mt-2 border-[2px] outline-none focuse:outline-none border-background p-2 rounded-lg w-full"
                placeholder="Free field, maximum 45 characters"
                value={formData.star_product_field}
                onChange={handleChange}
              />

              <label htmlFor="features" className="block mt-4 font-medium">
                Features and/or Benefits
              </label>
              <textarea
                id="features"
                name="features"
                className="p-2 bg-background rounded-lg w-full"
                placeholder="Free field without emoticons"
                value={formData.features}
                onChange={handleChange}
              ></textarea>

              <label htmlFor="add_products" className="block mt-4 font-medium">
                Add more products or services (up to 5)
              </label>
              <select
                id="add_products"
                name="add_products"
                className="p-2 bg-background rounded-lg w-full"
                value={formData.add_products}
                onChange={handleChange}
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
              <input
                type="text"
                id="add_products_field"
                name="add_products_field"
                className="mt-2 border-[2px] outline-none focuse:outline-none border-background p-2 rounded-lg w-full"
                placeholder="Free field, maximum 45 characters"
                value={formData.add_products_field}
                onChange={handleChange}
              />
              <textarea
                id="add_features"
                name="add_features"
                className="mt-2 border-[2px] outline-none focuse:outline-none border-background p-2 rounded-lg w-full"
                placeholder="Features and/or Benefits (Free field without emoticons)"
                value={formData.add_features}
                onChange={handleChange}
              ></textarea>

              <label htmlFor="objectives" className="block mt-4 font-medium">
                What do you want to achieve with your publications?
              </label>
              <select
                id="objectives"
                name="objectives"
                className="p-2 bg-background rounded-lg w-full"
                value={formData.objectives}
                onChange={handleChange}
              >
                <option value="">Choose an option</option>
                <option value="appointment_required">
                  Appointment required
                </option>
                <option value="book_by_phone">Book by phone</option>
                <option value="physical_visit">
                  Physical visit to the premises
                </option>
                <option value="only_web">Only on the web</option>
                <option value="visit_web_or_premises">
                  Visiting the premises or via the web
                </option>
              </select>

              <label className="block mt-4 font-medium">Add photos</label>
              <input
                type="file"
                name="photos"
                accept="image/png, image/jpg, image/jpeg"
                multiple
                className="p-2 rounded-lg w-full mt-2"
                onChange={handleChange}
              />
              <div className="flex flex-wrap gap-4 mt-2">
                {formData.photosPreview.map((preview, index) => (
                  <img
                    key={index}
                    src={preview}
                    alt={`Photo ${index + 1} Preview`}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>

            {/* Block 3: area of influence */}
            <div className="form-section-3 bg-background2 flex flex-col justify-center items-center gap-3 rounded-lg p-2">
              <h2 className="text-lg font-bold">
                Block 3: Area of Influence and Audience
              </h2>

              {/* Area of Influence */}
              <label
                htmlFor="area_of_influence"
                className="block font-medium mt-4"
              >
                Where the company provides services
              </label>
              <select
                id="area_of_influence"
                name="area_of_influence"
                className="p-2 bg-background rounded-lg w-full"
                onChange={handleChange}
                value={formData.area_of_influence}
              >
                <option value="">Choose an option</option>
                <option value="local">At local level</option>
                <option value="provincial">At the provincial level</option>
                <option value="autonomous">
                  At the autonomous community level
                </option>
                <option value="national">At the national level</option>
                <option value="international">At international level</option>
              </select>

              {/* Customer Type */}
              <label htmlFor="customer_type" className="block font-medium mt-4">
                Customer type (select 1 or 2 options)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["men", "women", "both", "companies", "all"].map((type) => (
                  <label key={type}>
                    <input
                      type="checkbox" // Change from radio to checkbox
                      name="customer_type"
                      value={type}
                      className="mr-2"
                      onChange={handleChange}
                      checked={formData.customer_type.includes(type)} // Check if the current value is in the array
                    />
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </label>
                ))}
              </div>

              {/* Age Range */}
              <label htmlFor="age_range" className="block font-medium mt-4">
                Age range (multiple selection possible)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "under_24",
                  "25_35",
                  "36_45",
                  "46_55",
                  "56_65",
                  "over_65",
                  "companies",
                ].map((age) => (
                  <label key={age}>
                    <input
                      type="checkbox"
                      name="age_range"
                      value={age}
                      className="mr-2"
                      onChange={handleChange}
                      checked={formData.age_range.includes(age)}
                    />{" "}
                    {age
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (char) => char.toUpperCase())}
                  </label>
                ))}
              </div>

              {/* Valuable Content */}
              <label
                htmlFor="valuable_content"
                className="block font-medium mt-4"
              >
                Valuable content for your target audience (Topics)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "sporting_events",
                  "cultural_activities",
                  "geeky_content",
                  "social_issues",
                ].map((content) => (
                  <label key={content}>
                    <input
                      type="checkbox"
                      name="valuable_content"
                      value={content}
                      className="mr-2"
                      onChange={handleChange}
                      checked={formData.valuable_content.includes(content)}
                    />{" "}
                    {content
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (char) => char.toUpperCase())}
                  </label>
                ))}
              </div>
              <div className="other-content-style w-full">
                <textarea
                  id="valuable_content_other"
                  name="valuable_content_other"
                  className="mt-2 border-[2px] outline-none focuse:outline-none border-background p-2 rounded-lg w-full"
                  rows={5}
                  placeholder="Other topics (please specify)"
                  onChange={handleChange}
                  value={formData.valuable_content_other}
                ></textarea>
              </div>

              {/* Communication Style */}
              <label
                htmlFor="communication_style"
                className="block font-medium mt-4"
              >
                Desired communication style
              </label>
              <select
                id="communication_style"
                name="communication_style"
                className="p-2 bg-background rounded-lg w-full"
                onChange={handleChange}
                value={formData.communication_style}
              >
                <option value="">Choose an option</option>
                {[
                  "corporate",
                  "formal",
                  "joke",
                  "nearby",
                  "emotional",
                  "fun",
                  "friendly",
                  "inspirational",
                  "professional",
                  "narrative",
                  "persuasive",
                  "informative",
                  "technical",
                  "motivational",
                ].map((style) => (
                  <option key={style} value={style}>
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </option>
                ))}
              </select>
              <textarea
                id="communication_style_other"
                name="communication_style_other"
                className="mt-2 border-[2px] outline-none focuse:outline-none border-background p-2 rounded-lg w-full"
                placeholder="Other styles (please specify)"
                onChange={handleChange}
                value={formData.communication_style_other}
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-accent text-white rounded-lg w-full"
            >
              {loading ? "Updating Details......." : "Update Details"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
