# Spring Boot Enterprise E-Commerce & CRM Project
## Comprehensive Technical Documentation (Viva Reference Guide)

This document is designed for your teacher/evaluator. It contains a deep dive into the architecture, specific files used, and line-by-line logic explanations for the core backbone of the project.

---

### 1. Project Architecture Overview
The project is built using the **Model-View-Controller (MVC)** design pattern on the **Spring Boot** framework.

*   **Model:** Represents data objects (Entities like `User`, `Product`, `Review`). Handled via **Spring Data JPA** which automatically translates Java classes into MySQL database tables.
*   **View:** The user interface. Built with **Thymeleaf**, a server-side Java template engine that dynamically loops through database data to produce HTML before sending it to the user.
*   **Controller:** The brain. Java classes annotated with `@Controller` or `@RestController` that receive HTTP requests from the browser, fetch data from the database, and return the correct View or JSON data.

---

### 2. Dependency Management (`pom.xml`)
Maven is the build tool used to manage the project. The `pom.xml` dictates what libraries the project is allowed to download and use.

*   **`spring-boot-starter-webmvc`**: Used to build web applications, RESTful applications, and utilizes Apache Tomcat as the default embedded container.
*   **`spring-boot-starter-data-jpa`**: Java Persistence API. This library manages the relational data in the Java application in a transparent way alongside **Hibernate**.
*   **`mysql-connector-j`**: The official JDBC driver for MySQL. It allows the Spring Boot application to speak directly to the MySQL database.
*   **`spring-boot-starter-security`**: Secures the application to ensure only authenticated users can access the dashboard and process payments.
*   **`spring-boot-starter-thymeleaf`**: Used to render HTML templates and inject dynamic variables directly from the controllers.
*   **`razorpay-java`**: A third-party library integrated into to generate simulated / real payment order IDs and interact with the Razorpay Payment Gateway API.

---

### 3. Application Configuration (`application.properties`)
This file tells Spring Boot how to behave globally.

```properties
# Database Configuration
spring.datasource.url=${DB_URL:jdbc:mysql://localhost:3306/crm_db}
spring.datasource.username=${DB_USER:root}
```
**Why use it:** This defines how the app connects to the database. We use `${ENV_VARIABLE:fallback}` syntax. This allows the application to read environment variables when deployed to the cloud (Render), but default to `localhost` and `root` when running on your personal computer.

```properties
spring.jpa.hibernate.ddl-auto=update
```
**Why use it:** `ddl-auto=update` is a critical line. It tells Hibernate to read your Java Entities and automatically create or update the MySQL tables to match them. Previously, if this was set to `create`, it would wipe your entire database completely flat every time the server restarted.

---

### 4. Security Configuration (`SecurityConfig.java`)
This is the security backbone of the application.

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http.csrf(csrf -> csrf.ignoringRequestMatchers("/api/**"))
```
**Why use this line:** Cross-Site Request Forgery (CSRF) is a security mechanism enabled by default in Spring Security. It blocks `POST` requests from third parties. Because our floating Chatbot needs to send stateless JSON POST requests to `/api/chat`, we disabled CSRF *only* for the `/api/**` endpoints to prevent it from throwing a `403 Forbidden` error.

```java
.authorizeHttpRequests(auth -> auth
    .requestMatchers("/login", "/register", "/css/**").permitAll()
    .requestMatchers("/dashboard", "/products/**").hasRole("ADMIN")
    .anyRequest().authenticated()
)
```
**Why use these lines:** This is **Role-Based Access Control (RBAC)**.
1. `permitAll()` allows anyone (even unauthenticated users) to view the login and register pages.
2. `hasRole("ADMIN")` strictly protects the backend dashboard. If a regular customer tries to bypass the UI and type `/dashboard` in the URL bar, Spring Security will forcibly block them.
3. `anyRequest().authenticated()` forces all other unknown URLs to require the user to be logged in.

```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
```
**Why use it:** Security best practice dictates no passwords should ever be stored in plain text. `BCrypt` uses a combination of hashing and automatic "salting" to severely slow down brute-force attacks on the database.

---

### 5. Chatbot Artificial Intelligence (`ChatbotController.java`)
This file serves as a custom API endpoint for the floating "Concierge".

```java
@RestController
@RequestMapping("/api/chat")
public class ChatbotController {
```
**Why use it:** Unlike `@Controller` which returns an HTML page, `@RestController` explicitly states that this class will only ever communicate in raw JSON data.

```java
@PostMapping
public Map<String, String> chat(@RequestBody Map<String, String> request) {
    String message = request.getOrDefault("message", "").toLowerCase().trim();
    String response;

    if (message.contains("shipping") || message.contains("track")) { ... }
```
**Why use it:** The `@PostMapping` listens for incoming messages from the frontend Javascript execution. The `@RequestBody` reads the incoming JSON payload. The `request.getOrDefault` prevents `NullPointerExceptions` by assigning a blank string if the frontend sends an empty request. We use `.toLowerCase().trim()` to normalize the data before passing it through our custom NLP (Natural Language Processing) conditional logic to match intents like "shipping", "returns", or "stock".

---

### 6. The Web Frontend (`layout.html` & `shop.html`)
The user interface shifted to an Elegant Anime Archive utilizing premium CSS.

**Why use Fragments (`th:fragment="layout"`):**
By placing the `<head>`, `<nav>`, and `<sidebar>` inside `fragments/layout.html`, we ensure the application follows the **DRY Principle (Don't Repeat Yourself)**. Instead of copying the sidebar into 15 different HTML files, every page simply calls `th:replace="~{fragments/layout :: layout(~{::section})}"`. If we need to change a menu item, we only modify one file, and the entire app updates instantly.

**Glassmorphism and Aesthetic:**
In `layout.html`, we used custom CSS variables and CSS backdrops:
```css
backdrop-filter: blur(15px);
background: rgba(8, 8, 8, 0.95);
```
**Why use it:** This creates "Glassmorphism" — a premium UI design trend. The `backdrop-filter` forces the browser to calculate a literal blur effect on the pixels situated *behind* the sidebar div, while the `rgba` keeps the surface semi-transparent. This creates a highly elegant, sophisticated presentation compared to flat, solid colors.

**The Frontend Chatbot Integration:**
```javascript
const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: msg })
});
const data = await response.json();
```
**Why use it:** We used the modern Javascript `Fetch API` combined with `async/await`. This executes an asynchronous background request to our Java server. Because it happens asynchronously, the user's web page does NOT need to refresh. The response is fetched and injected directly into the DOM (Document Object Model) simultaneously, mimicking a real-time WebSocket connection.
