# Nothing Backend - NestJS Scaffold Template

A progressive and production-ready NestJS scaffold template designed for scalability, type-safety, and clean architecture. This project serves as a foundation for building robust e-commerce or catalog-based backends.

## 🚀 Tech Stack

- **Framework:** [NestJS v11](https://nestjs.com/) (Express-based)
- **Language:** TypeScript (ES2023)
- **Database:** PostgreSQL with [TypeORM](https://typeorm.io/)
- **Validation:** [Zod](https://zod.dev/) via `nestjs-zod` for absolute type safety.
- **Authentication:** JWT (Passport.js strategy) with Access & Refresh token rotation.
- **File Storage:** AWS S3 / MinIO integration via AWS SDK v3.
- **API Documentation:** Integrated Swagger UI (OpenAPI 3.0).
- **Tooling:** ESLint, Prettier, Jest.

## 🏗️ Architectural Decisions

### 1. Modular Structure
The application is organized into domain-driven modules located in `src/modules`. Each module is self-contained, encapsulating its own controllers, services, entities, and DTOs.
- `AuthModule`: Identity and access management.
- `UsersModule`: Profile and user management.
- `ProductsModule`: Catalog and inventory management.
- `CategoriesModule`: Hierarchical classification.

### 2. Path Aliases
To avoid deep relative imports (`../../../../`), the project uses TypeScript path aliases defined in `tsconfig.json`:
- `@modules/*` -> `src/modules/*`
- `@common/*` -> `src/common/*`
- `@config/*` -> `src/config/*`
- `@database/*` -> `src/database/*`
- `@helpers/*` -> `src/helpers/*`

### 3. Response & Error Standardization
The backend enforces a strict design system for API communication:
- **Success Interceptor**: All successful responses are automatically wrapped in a standard `ApiResponse` structure:
  ```json
  {
    "success": true,
    "message": "Success",
    "data": { ... },
    "meta": { ... } // Optional (e.g., pagination)
  }
  ```
- **Global Exception Filter**: Errors are caught and formatted consistently by the `HttpExceptionFilter`, ensuring even internal errors return a safe and readable JSON response.

### 4. Schema-First Validation
We use `zod` for all DTOs. This ensures that validation and TypeScript types are always in sync. Use the `ZodValidationPipe` (global) to handle input validation automatically.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- S3 Compatible Storage (MinIO or AWS S3)

### Installation
```bash
npm install
```

### Environment Setup
Copy `.env.example` to `.env` and fill in your credentials:
```bash
cp .env.example .env
```

### Running the App
```bash
# Development
npm run start:dev

# Production Build
npm run build
npm run start:prod
```

### API Documentation
Once the app is running, visit:
- **Swagger UI**: `http://localhost:3000/docs`
- **Static Spec**: `src/swagger.json`

---

## 📘 Integration Guide (For AI Agents & Developers)

When building new features on top of this scaffold, follow these guidelines to maintain consistency:

### 1. Adding a New Module
Use the NestJS CLI or create a directory in `src/modules/[feature]`:
1. **Define Entity**: Create `entities/[feature].entity.ts` using TypeORM decorators.
2. **Define Schema/DTO**: Create `dto/[feature].dto.ts` using `zod` schemas.
3. **Service**: Implement business logic in `[feature].service.ts`.
4. **Controller**: Define endpoints in `[feature].controller.ts`.
5. **Module**: Wire everything in `[feature].module.ts` and import it into `AppModule`.

### 2. Working with Standard Responses
You do not need to wrap your data in `success` or `message` keys manually in the controller. Return the raw data (or a promise), and the `ResponseInterceptor` will handle the wrapping.
- **Custom Message**: If you need a specific message, return an object like `{ data, message: 'Your message' }`.

### 3. Storage Integration
Use the `S3Helper` from `@helpers/s3.helper`:
```typescript
constructor(private readonly s3Helper: S3Helper) {}

async upload(file: Express.Multer.File) {
  return await this.s3Helper.uploadFile(file, 'folder-name');
}
```

### 4. Authentication & RBAC
Protect routes using the built-in guards:
- **JWT Protection**: `@UseGuards(JwtAuthGuard)`
- **Role Based Access**: `@Roles(Role.Admin)` + `@UseGuards(JwtAuthGuard, RolesGuard)`

### 5. Database Conventions
- Always use `uuid` for primary keys.
- Use `CreateDateColumn` and `UpdateDateColumn` for auditing.
- Prefer relations over manual ID handling where possible.

---

## 🛡️ Design System & Standards
- **Naming**: camelCase for variables/functions, PascalCase for classes, kebab-case for files.
- **Comments**: We follow the **NO non-essential comments** rule. Code should be self-documenting. Use comments only for complex algorithmic logic.
- **Git**: Commits should be descriptive. Feature branches are preferred.
