# 🌍 Wanderlust – A Modern Accommodation Booking Platform  

**Wanderlust** is a full-stack web application inspired by Airbnb that lets users **explore, list, and review stays** worldwide. It provides a seamless travel booking experience with features like **secure user authentication**, **property management**, **interactive maps**, and a **review system** — built for realism and usability.  

🔗 **Live Demo:** [wanderlust-hb36.onrender.com](https://wanderlust-hb36.onrender.com)

---

## 🎯 Objective  

To design and develop a **scalable, user-friendly platform** that allows users to **discover, list, and book accommodations**, integrating modern tools and APIs to simulate a real-world travel experience.  

---

## ⚙️ Approach  

1. **Backend:** Built with **Node.js** and **Express**, following the MVC architecture for clean, modular code.  
2. **Database:** Used **MongoDB** with **Mongoose** for efficient data modeling of users, listings, and reviews.  
3. **Authentication:** Implemented **Passport.js** for secure login and registration using local strategy.  
4. **File & Image Handling:** Integrated **Cloudinary** and **Multer** for seamless image uploads and management.  
5. **Maps & Location:** Added **Mapbox** for geolocation and interactive maps.  
6. **Frontend:** Designed a **responsive interface** using **EJS templates** and **Bootstrap 5** for dynamic rendering.  
7. **Deployment:** Hosted on **Render**, with **Cloudinary** managing images and media files.  

---

## 🧩 Key Features  

- 🔐 **User Authentication & Authorization** (Passport.js)  
- 🏠 **Add, Edit & Delete Property Listings**  
- 🗺️ **Interactive Maps Integration** (Mapbox)  
- 🖼️ **Image Upload & Storage** (Cloudinary)  
- 📝 **User Reviews & Ratings**  
- 📱 **Responsive and Mobile-Friendly UI**  
- ⚡ **Error Handling & Validation** for smooth user experience  

---

## 🧰 Tools & Technologies  

**Frontend:**  
- EJS  
- Bootstrap 5  
- JavaScript (ES6)  

**Backend:**  
- Node.js  
- Express.js  
- Mongoose  
- Passport.js  

**Database:**  
- MongoDB (Atlas)  

**Integrations:**  
- Mapbox (Maps & Location)  
- Cloudinary (Image Storage)  
- Multer (File Upload Middleware)  

**Deployment:**  
- Render (App Hosting)  
- Cloudinary (Media Hosting)  

---

## 🚀 Results  

- Built a **fully functional Airbnb-style app** with CRUD operations and user authentication.  
- Integrated **maps, image uploads, and reviews** for a real-world experience.  
- Deployed successfully on Render: [wanderlust-hb36.onrender.com](https://wanderlust-hb36.onrender.com).  

---

## 🧾 Installation & Setup  

To run this project locally:  

```bash
# Clone the repository
git clone https://github.com/<your-username>/wanderlust.git

# Navigate into the folder
cd wanderlust

# Install dependencies
npm install

# Create a .env file and add:
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret
MAPBOX_TOKEN=your_mapbox_token
DB_URL=your_mongodb_uri
SECRET=your_session_secret

# Start the app
npm start
