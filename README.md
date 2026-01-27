# Book Club Application

Complete Deployment Guide

---

## Overview

This guide provides step-by-step instructions for building and deploying a full-stack book club application with the following architecture:

- **Backend:** Java Spring Boot
- **Frontend:** React
- **Database:** PostgreSQL
- **Containerization:** Docker
- **Deployment:** AWS (EC2, RDS, S3)

---

## Prerequisites

Before starting, ensure you have the following installed:

- Java JDK 17 or higher
- Maven 3.8+
- Node.js 18+ and npm
- Docker and Docker Compose
- Git
- AWS Account with CLI configured

---

## Part 1: Backend Development (Spring Boot)

### Step 1: Initialize Spring Boot Project

Create a new Spring Boot project using Spring Initializr or your IDE with the following dependencies:

- Spring Web
- Spring Data JPA
- Spring Security
- PostgreSQL Driver
- Lombok (optional but recommended)

Maven configuration (pom.xml):

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
    </dependency>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
    </dependency>
</dependencies>
```

---

### Step 2: Configure Application Properties

Create `application.yml` in `src/main/resources`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/bookclub
    username: postgres
    password: yourpassword
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
  security:
    user:
      name: admin
      password: admin

server:
  port: 8080
```

---

### Step 3: Create Model Classes

Create the following entity classes in the models package:

#### User.java

```java
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String email;
    
    private Integer currentChapter = 0;
    
    @CreatedDate
    private LocalDateTime createdAt;
}
```

#### Book.java

```java
@Entity
@Table(name = "books")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    private String author;
    private Integer totalChapters;
    private Boolean isActive = true;
    
    @CreatedDate
    private LocalDateTime createdAt;
}
```

#### Week.java

```java
@Entity
@Table(name = "weeks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Week {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "book_id")
    private Book book;
    
    private Integer weekNumber;
    private String title;
    private LocalDate startDate;
    private LocalDate endDate;
    
    @OneToMany(mappedBy = "week", cascade = CascadeType.ALL)
    private List<Chapter> chapters = new ArrayList<>();
}
```

#### Chapter.java

```java
@Entity
@Table(name = "chapters")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Chapter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "week_id")
    private Week week;
    
    private Integer chapterNumber;
    private String title;
    
    @OneToMany(mappedBy = "chapter", cascade = CascadeType.ALL)
    private List<Comment> comments = new ArrayList<>();
}
```

#### Comment.java

```java
@Entity
@Table(name = "comments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "chapter_id")
    private Chapter chapter;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
```

#### WeeklyQuestion.java

```java
@Entity
@Table(name = "weekly_questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WeeklyQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "week_id")
    private Week week;
    
    @Column(columnDefinition = "TEXT")
    private String question;
    
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL)
    private List<QuestionAnswer> answers = new ArrayList<>();
    
    @CreatedDate
    private LocalDateTime createdAt;
}
```

#### QuestionAnswer.java

```java
@Entity
@Table(name = "question_answers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "question_id")
    private WeeklyQuestion question;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    @Column(columnDefinition = "TEXT")
    private String answer;
    
    @CreatedDate
    private LocalDateTime createdAt;
}
```

---

### Step 4: Create Repository Interfaces

Create repository interfaces in the repositories package:

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Boolean existsByUsername(String username);
}

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    Optional<Book> findByIsActiveTrue();
}

@Repository
public interface WeekRepository extends JpaRepository<Week, Long> {
    List<Week> findByBookIdOrderByWeekNumber(Long bookId);
}

@Repository
public interface ChapterRepository extends JpaRepository<Chapter, Long> {
    List<Chapter> findByWeekIdOrderByChapterNumber(Long weekId);
}

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByChapterIdOrderByCreatedAtDesc(Long chapterId);
}

@Repository
public interface WeeklyQuestionRepository extends JpaRepository<WeeklyQuestion, Long> {
    List<WeeklyQuestion> findByWeekId(Long weekId);
}

@Repository
public interface QuestionAnswerRepository extends JpaRepository<QuestionAnswer, Long> {
    List<QuestionAnswer> findByQuestionId(Long questionId);
    Optional<QuestionAnswer> findByQuestionIdAndUserId(Long questionId, Long userId);
}
```

---

### Step 5: Create Service Layer

Create service classes to handle business logic. Example for BookService:

```java
@Service
public class BookService {
    @Autowired
    private BookRepository bookRepository;
    
    @Autowired
    private WeekRepository weekRepository;
    
    public Book getCurrentBook() {
        return bookRepository.findByIsActiveTrue()
            .orElseThrow(() -> new RuntimeException("No active book found"));
    }
    
    public List<Week> getWeeksForBook(Long bookId) {
        return weekRepository.findByBookIdOrderByWeekNumber(bookId);
    }
    
    public Book createBook(Book book) {
        return bookRepository.save(book);
    }
    
    public void setActiveBook(Long bookId) {
        // Deactivate all books
        bookRepository.findAll().forEach(b -> {
            b.setIsActive(false);
            bookRepository.save(b);
        });
        
        // Activate selected book
        Book book = bookRepository.findById(bookId)
            .orElseThrow(() -> new RuntimeException("Book not found"));
        book.setIsActive(true);
        bookRepository.save(book);
    }
}
```

Create similar services for User, Comment, Week, and Question management.

---

### Step 6: Create REST Controllers

Create controllers to expose REST APIs. Example for BookController:

```java
@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "*")
public class BookController {
    @Autowired
    private BookService bookService;
    
    @GetMapping("/current")
    public ResponseEntity<Book> getCurrentBook() {
        return ResponseEntity.ok(bookService.getCurrentBook());
    }
    
    @GetMapping("/{bookId}/weeks")
    public ResponseEntity<List<Week>> getWeeks(@PathVariable Long bookId) {
        return ResponseEntity.ok(bookService.getWeeksForBook(bookId));
    }
    
    @PostMapping
    public ResponseEntity<Book> createBook(@RequestBody Book book) {
        return ResponseEntity.ok(bookService.createBook(book));
    }
    
    @PutMapping("/{bookId}/activate")
    public ResponseEntity<Void> setActiveBook(@PathVariable Long bookId) {
        bookService.setActiveBook(bookId);
        return ResponseEntity.ok().build();
    }
}
```

Create additional controllers for Comments, Users, Weeks, and Questions.

---

### Step 7: Configure Security

Create a security configuration class:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .cors()
            .and()
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .anyRequest().authenticated()
            )
            .httpBasic();
        
        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

---

## Part 2: Frontend Development (React)

### Step 8: Initialize React Application

Create a new React app:

```bash
npx create-react-app bookclub-frontend
cd bookclub-frontend
npm install axios react-router-dom
```

---

### Step 9: Create API Service

Create `src/services/api.js`:

```javascript
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add authentication token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
```

---

### Step 10: Create React Components

Create the following key components:

- Login.js - User authentication
- BookView.js - Display current book and weeks
- WeekDropdown.js - Expandable week sections
- ChapterComments.js - Chapter discussion area
- ProgressTracker.js - User reading progress
- WeeklyQuestion.js - Weekly discussion question

Example BookView component structure:

```javascript
import React, { useState, useEffect } from 'react';
import api from '../services/api';

function BookView() {
    const [book, setBook] = useState(null);
    const [weeks, setWeeks] = useState([]);
    const [expandedWeek, setExpandedWeek] = useState(null);

    useEffect(() => {
        fetchCurrentBook();
    }, []);

    const fetchCurrentBook = async () => {
        const response = await api.get('/books/current');
        setBook(response.data);
        fetchWeeks(response.data.id);
    };

    const fetchWeeks = async (bookId) => {
        const response = await api.get(`/books/${bookId}/weeks`);
        setWeeks(response.data);
    };

    const toggleWeek = (weekId) => {
        setExpandedWeek(expandedWeek === weekId ? null : weekId);
    };

    return (
        <div className="book-view">
            <h1>{book?.title}</h1>
            <div className="weeks-container">
                {weeks.map(week => (
                    <WeekDropdown 
                        key={week.id}
                        week={week}
                        isExpanded={expandedWeek === week.id}
                        onToggle={() => toggleWeek(week.id)}
                    />
                ))}
            </div>
        </div>
    );
}

export default BookView;
```

---

### Step 11: Set Up Routing

Configure React Router in `App.js`:

```javascript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import BookView from './components/BookView';
import ProgressTracker from './components/ProgressTracker';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<BookView />} />
                    <Route path="/progress" element={<ProgressTracker />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
```

---

## Part 3: Dockerization

### Step 12: Create Backend Dockerfile

Create `Dockerfile` in the backend root directory:

```dockerfile
FROM maven:3.8.4-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

---

### Step 13: Create Frontend Dockerfile

Create `Dockerfile` in the frontend directory:

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf` in the frontend directory:

```nginx
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
}
```

---

### Step 14: Create Docker Compose Configuration

Create `docker-compose.yml` in the project root:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: bookclub-db
    environment:
      POSTGRES_DB: bookclub
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: yourpassword
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - bookclub-network

  backend:
    build: ./backend
    container_name: bookclub-backend
    depends_on:
      - postgres
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/bookclub
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: yourpassword
    ports:
      - "8080:8080"
    networks:
      - bookclub-network

  frontend:
    build: ./frontend
    container_name: bookclub-frontend
    depends_on:
      - backend
    environment:
      REACT_APP_API_URL: http://localhost:8080/api
    ports:
      - "80:80"
    networks:
      - bookclub-network

volumes:
  postgres_data:

networks:
  bookclub-network:
    driver: bridge
```

---

### Step 15: Test Local Docker Setup

Build and run the containers locally:

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

---

## Part 4: AWS Deployment

### Step 16: Set Up AWS RDS PostgreSQL

1. Log in to AWS Console and navigate to RDS
2. Click Create Database
3. Choose PostgreSQL as the engine
4. Select Free Tier template (or your preferred tier)
5. Configure DB instance identifier: bookclub-db
6. Set master username and password
7. Choose VPC and subnet group
8. Enable Public access (for initial setup)
9. Create a new security group or use existing
10. Set initial database name: bookclub
11. Create database and note the endpoint URL

---

### Step 17: Configure EC2 Instance

1. Navigate to EC2 in AWS Console
2. Launch a new instance
3. Choose Amazon Linux 2 or Ubuntu AMI
4. Select instance type (t2.medium recommended)
5. Configure security group to allow:
   - SSH (port 22)
   - HTTP (port 80)
   - HTTPS (port 443)
   - Custom TCP (port 8080) for backend
6. Create or select an existing key pair
7. Launch instance

---

### Step 18: Install Docker on EC2

SSH into your EC2 instance and run:

```bash
# Update system
sudo yum update -y  # For Amazon Linux
# OR
sudo apt update && sudo apt upgrade -y  # For Ubuntu

# Install Docker
sudo yum install docker -y  # Amazon Linux
# OR
sudo apt install docker.io -y  # Ubuntu

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installations
docker --version
docker-compose --version
```

---

### Step 19: Deploy Application to EC2

1. Clone your repository to EC2 or transfer files using SCP

```bash
git clone https://github.com/yourusername/bookclub-app.git
cd bookclub-app
```

2. Update `docker-compose.yml` with RDS endpoint

```yaml
environment:
  SPRING_DATASOURCE_URL: jdbc:postgresql://your-rds-endpoint:5432/bookclub
  SPRING_DATASOURCE_USERNAME: your-username
  SPRING_DATASOURCE_PASSWORD: your-password
```

3. Build and run containers

```bash
docker-compose up --build -d
```

4. Check container status

```bash
docker-compose ps
docker-compose logs -f
```

---

### Step 20: Configure Domain and SSL (Optional)

1. Register a domain name
2. Point domain DNS to EC2 public IP
3. Install Certbot for SSL certificates

```bash
sudo yum install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com
```

---

### Step 21: Set Up S3 for File Storage (Optional)

If you need to store book covers or user uploads:

1. Create an S3 bucket in AWS Console
2. Configure bucket permissions and CORS
3. Add AWS SDK to Spring Boot dependencies
4. Implement file upload service in backend
5. Configure IAM role for EC2 to access S3

---

## Part 5: Testing and Validation

### Step 22: Test Application Endpoints

Use curl or Postman to test your API endpoints:

```bash
# Test current book endpoint
curl http://your-ec2-ip:8080/api/books/current

# Test user login
curl -X POST http://your-ec2-ip:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "password"}'

# Test comment creation
curl -X POST http://your-ec2-ip:8080/api/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"chapterId": 1, "content": "Great chapter!"}'
```

---

### Step 23: Verify Database Persistence

Connect to your RDS database and verify data:

```bash
# Connect to PostgreSQL
psql -h your-rds-endpoint -U postgres -d bookclub

# Check tables
\dt

# Query users
SELECT * FROM users;

# Query books
SELECT * FROM books;
```

---

## Part 6: Maintenance and Monitoring

### Step 24: Set Up Logging

Configure application logging in `application.yml`:

```yaml
logging:
  level:
    root: INFO
    com.yourpackage: DEBUG
  file:
    name: /var/log/bookclub/application.log
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} - %msg%n"
    file: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"
```

---

### Step 25: Database Backup Strategy

1. Enable automated backups in RDS console
2. Set retention period (7-35 days)
3. Configure backup window during low traffic
4. Test restore process periodically

---

### Step 26: Monitoring and Alerts

Set up CloudWatch monitoring:

1. Create CloudWatch alarms for EC2 CPU usage
2. Monitor RDS connections and storage
3. Set up SNS notifications for critical alerts
4. Monitor application logs for errors

---

## Troubleshooting Common Issues

### Database Connection Issues

- Verify RDS security group allows inbound traffic from EC2
- Check database credentials in application.yml
- Ensure RDS endpoint is correct

### CORS Issues

- Update @CrossOrigin annotation with correct frontend URL
- Configure proper CORS policy in SecurityConfig

### Container Issues

- Check logs: `docker-compose logs [service-name]`
- Restart containers: `docker-compose restart`
- Rebuild if needed: `docker-compose up --build`

---

## Next Steps and Enhancements

1. Implement JWT authentication for better security
2. Add email notifications for new comments and questions
3. Implement real-time updates using WebSockets
4. Add user profile pictures and customization
5. Create admin panel for managing books and users
6. Implement search functionality for comments
7. Add mobile app using React Native
8. Set up CI/CD pipeline with GitHub Actions

---

## Conclusion

You now have a fully functional book club application deployed on AWS with persistent data storage. The application supports multiple users, week-based reading schedules, chapter discussions, progress tracking, and weekly questions.

The modular architecture using Spring Boot services, repositories, and controllers on the backend, combined with React components on the frontend, makes the application maintainable and scalable.

Regular backups, monitoring, and maintenance will ensure your book club application runs smoothly for your reading group.

---

## Additional Resources

- Spring Boot Documentation: https://spring.io/projects/spring-boot
- React Documentation: https://react.dev
- Docker Documentation: https://docs.docker.com
- AWS EC2 Guide: https://docs.aws.amazon.com/ec2
- AWS RDS Guide: https://docs.aws.amazon.com/rds
- PostgreSQL Documentation: https://www.postgresql.org/docs

---

## License

This project is open source and available under the MIT License.
