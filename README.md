<div align="center">

# 🏢 Enterprise CRM System

### A full-stack Customer Relationship Management platform with an Elegant Anime-inspired UI

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.1-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Integrated-0C2451?style=for-the-badge&logo=razorpay&logoColor=white)](https://razorpay.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square)](http://makeapullrequest.com)
[![Maintenance](https://img.shields.io/badge/Maintained-Yes-green?style=flat-square)](https://github.com/adityaroshannnn/crm-springboot/graphs/commit-activity)

---

**[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [Architecture](#-architecture) · [API Endpoints](#-api-endpoints) · [Screenshots](#-screenshots)**

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🔐 Authentication & Authorization
- Role-based access control (**Admin**, **Manager**, **Customer**)
- Spring Security with session management
- Secure login & registration

### 📊 Admin Dashboard
- Real-time business analytics
- Customer, Manager, Product & Order management
- Full CRUD operations across all entities

### 🛒 E-Commerce Storefront
- Product catalog with detailed views
- Customer reviews & ratings
- Animated shopping experience

</td>
<td width="50%">

### 💳 Razorpay Payment Gateway
- Secure online payments
- Order creation & verification
- Payment status tracking

### 🤖 AI Concierge Chatbot
- Intelligent product recommendations
- Order status inquiries
- Professional & polite interaction style

### 🎨 Elegant Anime UI
- Monochrome & gold color palette
- Smooth micro-animations
- Glassmorphism design elements
- Fully responsive design

</td>
</tr>
</table>

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Spring Boot 4.0.1** | Application framework |
| **Spring Security** | Authentication & authorization |
| **Spring Data JPA** | ORM & data persistence |
| **Hibernate** | Database management |
| **MySQL** | Relational database |
| **Razorpay SDK** | Payment processing |
| **Maven** | Build & dependency management |

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI library |
| **React Router** | Client-side routing |
| **Vite** | Build tool & dev server |
| **CSS3** | Custom styling with animations |

### DevOps
| Technology | Purpose |
|---|---|
| **Docker** | Containerization |
| **Render** | Cloud deployment |

---

## 🚀 Getting Started

### Prerequisites

- **Java 17** or higher
- **Node.js 18+** & **npm**
- **MySQL 8.0+**
- **Maven 3.9+**

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/adityaroshannnn/crm-springboot.git
cd crm-springboot
```

### 2️⃣ Database Setup

```sql
CREATE DATABASE crm_db;
```

Update `src/main/resources/application.properties` with your MySQL credentials:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/crm_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 3️⃣ Build & Run the Frontend

```bash
cd frontend
npm install
npm run build
```

### 4️⃣ Run the Application

```bash
# From root directory
./mvnw spring-boot:run
```

The app will be available at **http://localhost:8081**

### 🐳 Docker Deployment

```bash
docker build -t crm-springboot .
docker run -p 8081:8081 \
  -e DB_URL=jdbc:mysql://host:3306/crm_db \
  -e DB_USER=root \
  -e DB_PASSWORD=yourpassword \
  crm-springboot
```

---

## 🏗 Architecture

```
crm-springboot/
├── 📂 frontend/                    # React Frontend (Vite)
│   └── src/
│       ├── components/             # Reusable UI components
│       │   ├── Navbar.jsx          # Navigation bar
│       │   └── Chatbot.jsx         # AI Concierge chatbot
│       ├── context/                # React Context (Auth)
│       ├── pages/                  # Application pages
│       │   ├── Dashboard.jsx       # Admin dashboard
│       │   ├── Customers.jsx       # Customer management
│       │   ├── Managers.jsx        # Manager management
│       │   ├── Products.jsx        # Product management
│       │   ├── Orders.jsx          # Order management
│       │   ├── Shop.jsx            # E-commerce storefront
│       │   ├── ProductDetails.jsx  # Product detail & purchase
│       │   └── MyOrders.jsx        # Customer order history
│       └── App.jsx                 # Root component & routing
│
├── 📂 src/main/java/crm_system/   # Spring Boot Backend
│   ├── config/                     # Security & data config
│   ├── controller/                 # REST & MVC controllers
│   ├── entity/                     # JPA entities
│   ├── enums/                      # Role enumerations
│   ├── exception/                  # Global error handling
│   ├── repository/                 # Data access layer
│   └── service/                    # Business logic layer
│
├── Dockerfile                      # Docker containerization
├── pom.xml                         # Maven configuration
└── README.md
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | User login |
| `POST` | `/api/auth/register` | User registration |
| `POST` | `/api/auth/logout` | User logout |
| `GET` | `/api/auth/me` | Get current user |

### Customers
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/customers` | List all customers |
| `POST` | `/api/customers` | Create customer |
| `PUT` | `/api/customers/{id}` | Update customer |
| `DELETE` | `/api/customers/{id}` | Delete customer |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/shop/products` | List all products |
| `GET` | `/api/shop/products/{id}` | Get product details |
| `POST` | `/api/products` | Create product |
| `PUT` | `/api/products/{id}` | Update product |
| `DELETE` | `/api/products/{id}` | Delete product |

### Orders & Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/orders` | List all orders |
| `POST` | `/api/shop/create-order` | Create Razorpay order |
| `POST` | `/api/shop/verify-payment` | Verify payment |
| `GET` | `/api/orders/my-orders` | Get user's orders |

---

## 👤 Default Users

The application comes pre-loaded with demo accounts:

| Role | Username | Password |
|------|----------|----------|
| 🔴 Admin | `admin` | `admin123` |
| 🟡 Manager | `manager` | `manager123` |
| 🟢 Customer | `customer` | `customer123` |

---

## 📸 Screenshots

> _Screenshots coming soon — run the project locally to experience the Elegant Anime UI!_

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ by [Aditya Roshan](https://github.com/adityaroshannnn)**

⭐ Star this repo if you found it useful!

</div>
