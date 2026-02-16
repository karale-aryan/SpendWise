# SpendWise

A production-ready expense tracking application built with Spring Boot.

## Tech Stack

- **Java**: 17
- **Spring Boot**: 3.2.2
- **Spring Security**: Authentication & Authorization
- **Spring Data JPA**: Database operations
- **MySQL**: Database
- **Maven**: Build tool
- **Lombok**: Reduce boilerplate code
- **Validation**: Input validation

## Project Structure

```
com.spendwise
 ├── config          # Configuration classes
 ├── controller      # REST controllers
 ├── dto             # Data Transfer Objects
 ├── entity          # JPA entities
 ├── exception       # Exception handling
 ├── repository      # Data access layer
 ├── security        # Security configuration
 └── service         # Business logic
```

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SpendWise
   ```

2. **Configure MySQL**
   - Create a MySQL database named `spendwise` or let the application create it automatically
   - Update `src/main/resources/application.properties` with your MySQL credentials:
     ```properties
     spring.datasource.username=your_username
     spring.datasource.password=your_password
     ```

3. **Build the project**
   ```bash
   mvn clean install
   ```

4. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

The application will start on `http://localhost:8080`

## API Endpoints

### Health Check
- **GET** `/api/public/health` - Check application status

## Architecture Principles

- **Layered Architecture**: Clear separation of concerns
- **Constructor Injection**: No field injection for better testability
- **Clean Code**: Following SOLID principles
- **No Deprecated APIs**: Using latest Spring Boot 3.x features
- **Production-Ready**: Proper error handling, logging, and security

## Development

- The application uses **BCrypt** for password encoding
- **JPA Auditing** is enabled for automatic timestamp management
- **CORS** is configured for frontend integration
- **Validation** is enabled for request DTOs

## Next Steps

1. Implement User entity and authentication
2. Add expense tracking entities
3. Implement business logic in service layer
4. Add comprehensive test coverage
5. Configure JWT for stateless authentication

## License

This project is licensed under the MIT License.
