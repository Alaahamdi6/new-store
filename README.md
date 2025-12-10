# Electronics Store 🛒

A full-stack e-commerce platform for selling electronics including laptops, smartphones, keyboards, mice, and more. Built with Spring Boot backend, Angular frontend, and Docker containerization.

## Features ✨

- **Product Catalog**: Browse and search electronics with detailed specifications
- **User Authentication**: Secure login and registration system
- **Shopping Cart**: Add/remove products, manage quantities
- **Order Management**: Place orders and track order history
- **Admin Dashboard**: Manage products, inventory, and orders
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Product Reviews**: Customer ratings and reviews

## Tech Stack 🛠️

### Backend
- **Framework**: Spring Boot 3.x
- **Language**: Java 17+
- **Database**: MySQL 
- **ORM**: JPA/Hibernate
- **Build Tool**: Maven
- **Authentication**: JWT / Spring Security

### Frontend
- **Framework**: Angular 17+
- **Language**: TypeScript
- **Styling**: Bootstrap / CSS
- **HTTP Client**: HttpClient
- **State Management**: Services / RxJS

### DevOps
- **Containerization**: Docker & Docker Compose
- **Version Control**: Git

## Project Structure 📁

```
ProjetSB/
├── elecstore/                 # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/         # Business logic
│   │   │   └── resources/    # Configuration
│   │   └── test/
│   ├── pom.xml
│   └── Dockerfile
├── frontend/                  # Angular Frontend
│   ├── src/
│   │   ├── app/             # Components, services
│   │   ├── assets/          # Images, icons
│   │   └── environments/    # Config
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml        # Multi-container setup
├── electronics.sql           # Database schema
└── README.md
```

## Prerequisites 📋

- **Node.js** 18+ (for frontend)
- **Java** 17+ (for backend)
- **Maven** 3.8+
- **MySQL** 8.0+ or PostgreSQL 12+
- **Docker** & **Docker Compose** (optional)
- **Git**

## Installation & Setup 🚀

### Option 1: Local Development

#### 1. Clone the Repository
```bash
git clone https://github.com/EyaBouazizz/electronics_store.git
cd ProjetSB
```

#### 2. Backend Setup (Spring Boot)
```bash
cd elecstore

# Install dependencies
mvn clean install

# Configure database
# Edit src/main/resources/application.properties or application.yml
# Set your database credentials:
spring.datasource.url=jdbc:mysql://localhost:3306/electronics_store
spring.datasource.username=root
spring.datasource.password=your_password

# Run migrations (if using Flyway/Liquibase)
# mvn flyway:migrate

# Start the backend
mvn spring-boot:run
# Backend runs on http://localhost:8080
```

#### 3. Frontend Setup (Angular)
```bash
cd ../frontend

# Install dependencies
npm install

# Configure API endpoint
# Edit src/environments/environment.ts
# Set: apiUrl: 'http://localhost:8080'

# Start the development server
ng serve
# Frontend runs on http://localhost:4200
```

#### 4. Database Setup
```bash
# Create database
mysql -u root -p
CREATE DATABASE electronics_store CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Import schema (if electronics.sql exists)
mysql -u root -p electronics_store < electronics.sql
```

### Option 2: Docker (Recommended)

```bash
# From project root
docker-compose up -d

# Services will start:
# - Frontend: http://localhost:4200
# - Backend: http://localhost:8090
# - Database: MySQL on port 3306

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Environment Variables 🔐

Create `.env` file in project root:

```env
# Backend
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/electronics_store
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=your_password
JWT_SECRET=your_secret_key_here
JWT_EXPIRATION=86400000

# Frontend
API_URL=http://localhost:8090

# Email 
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
```

**⚠️ Never commit `.env` files to Git!**


## Running Tests 🧪

### Backend Tests
```bash
cd elecstore
mvn test
```

### Frontend Tests
```bash
cd frontend
ng test
```

## Troubleshooting 🔧

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :8080
kill -9 <PID>
```

### Database Connection Error
- Verify MySQL is running
- Check database credentials in `application.properties`
- Ensure database exists

### CORS Issues
- Backend should allow frontend origin in `application.properties`:
```properties
spring.web.cors.allowed-origins=http://localhost:4200
```

### Frontend Not Loading
- Clear browser cache: `Ctrl+Shift+Delete`
- Rebuild: `ng build`
- Check Angular version: `ng version`

## Contributing 🤝

1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add feature"`
4. Push: `git push origin feature/your-feature`
5. Open Pull Request


## Contact 📧

**Author**: Eya Bouaziz  
**GitHub**: [@EyaBouazizz](https://github.com/EyaBouazizz)  
**Repository**: [electronics_store](https://github.com/EyaBouazizz/electronics_store)

---

**Happy Coding!** 🎉
"# new-store" 
