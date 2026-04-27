Plan: Comprehensive Test Generation

  Objective: Implement Unit, Integration, and End-to-End (E2E) tests for all modules, aiming for 100% code     
  coverage. Existing test files will be disregarded as they have been deleted.

  Phase 1: Configure Jest for Multi-level Testing

   1. Analyze Existing Jest Configuration: Review package.json for the jest section and the test/jest-e2e.json 
      file.
   2. Update package.json Scripts: Modify package.json to include scripts for running unit, integration, and   
      E2E tests separately, as well as a combined coverage report.
       * npm run test:unit
       * npm run test:integration
       * npm run test:e2e
       * npm run test:cov (for combined coverage)
   3. Create Jest Configuration Files:
       * jest.unit.json: Configuration for unit tests, focusing on isolated components.
       * jest.integration.json: Configuration for integration tests, potentially using an in-memory database or
         mocked modules.
       * jest.e2e.json: Update the existing E2E configuration, if necessary, to align with the new structure.  
   4. Configure Coverage Reporting: Ensure Jest's coverage reporters are set up to provide detailed reports for
      lines, branches, functions, and statements, aggregating results from all test types.

  Phase 2: Generate Unit Tests (Major Focus)

  For each core component, create a corresponding *.spec.ts file within the component's directory (e.g.,       
  src/modules/auth/auth.service.spec.ts).

   1. Services (*.service.ts):
       * Instantiation: Test successful instantiation of the service.
       * Method Calls: Test all public methods.
       * Dependency Mocking: Use Jest mocks (jest.mock, jest.spyOn, mockReturnValue) for external dependencies
         like TypeORM Repository, ConfigService, JwtService, S3Helper, and other services.
       * Logic Coverage: Cover all conditional logic, loops, and error paths.
       * Return Values: Verify correct return values based on mocked dependencies.
       * Error Handling: Test that appropriate exceptions are thrown.

   2. Controllers (*.controller.ts):
       * Instantiation: Test successful instantiation.
       * Route Handlers: Test all public methods exposed as API endpoints.
       * Service Mocking: Mock the associated service methods to control their behavior and isolate the
         controller's logic.
       * Decorator Testing: Verify that NestJS decorators (@Get, @Post, @Body, @Param, @UseGuards, @Roles,
         etc.) are correctly applied.
       * Response Status: Assert correct HTTP status codes.
       * Request/Response Payloads: Verify correct handling of request bodies and generated response payloads.

   3. Entities (*.entity.ts):
       * If entities have custom methods (getters/setters, business logic), unit test these methods.
       * Basic instantiation tests to ensure properties are correctly assigned.

   4. Common Components (guards, filters, interceptors, decorators):
       * Guards (*.guard.ts): Test canActivate logic, including scenarios where access is granted/denied based
         on roles or authentication status. Mock ExecutionContext.
       * Filters (*.filter.ts): Test catch method for different exception types (e.g., HttpException,
         ZodValidationException). Mock ArgumentsHost and Response.
       * Interceptors (*.interceptor.ts): Test intercept method, verifying transformation of response data.
         Mock ExecutionContext and CallHandler.
       * Decorators (*.decorator.ts): Test the decorator's ability to set and retrieve metadata using
         Reflector.

   5. Helpers (*.helper.ts):
       * Test all utility functions (e.g., generateSlug, S3Helper's uploadFile with mocked S3 client).

  Phase 3: Generate Integration Tests (Medium Focus)

  Integration tests will verify the interaction between components, typically two layers (e.g.,
  controller-service or service-repository).

   1. Service-Repository Integration:
       * Create *.integration.spec.ts files for services interacting with their TypeORM repositories.
       * Use NestJS TestingModule to provide real service and repository instances.
       * Configure a lightweight, in-memory database (like SQLite with TypeOrmModule.forRoot) for these tests
         to ensure actual data persistence and retrieval logic is tested.
       * Test CRUD operations, complex queries, and transaction management.

   2. Controller-Service Integration:
       * Create *.integration.spec.ts files for controllers interacting with their services.
       * Use TestingModule to provide real controller and service instances.
       * Mock external dependencies like JwtAuthGuard or RolesGuard if their logic is complex or involves
         external factors (e.g., actual JWT validation).
       * Verify data flow and transformations between the controller and service layer.

  Phase 4: Generate E2E Tests (Minor Focus)

  E2E tests will simulate real user interactions with the API endpoints.

   1. Main API Endpoints:
       * Update test/app.e2e-spec.ts or create new *.e2e-spec.ts files for key modules.
       * Use supertest to make HTTP requests to the entire bootstrapped NestJS application.
       * Authentication & Authorization: Test login, registration, token refresh, and protected endpoints with 
         correct/incorrect tokens and roles.
       * CRUD Operations: Test full CRUD cycles for critical resources (e.g., creating a product, updating a   
         category, deleting a user).
       * Validation: Test API responses for invalid input data.
       * Error Handling: Verify consistent error response formats.
       * Database Isolation: Ensure each E2E test runs against a clean, isolated test database instance (e.g., 
         a separate in-memory SQLite database or a test-specific PostgreSQL schema).

  Phase 5: Verify 100% Coverage

   1. Continuous Monitoring: Run npm run test:cov regularly during test development.
   2. Coverage Reports Analysis: Examine Jest's coverage reports (HTML report, console output) to identify
      uncovered lines, branches, functions, and statements.
   3. Iteration: Write additional tests or improve existing ones to cover identified gaps until 100% coverage
      is reported across all categories.

  Execution Order:
   1. Phase 1 (Configure Jest).
   2. Phase 2 (Unit Tests - iterate per component).
   3. Phase 3 (Integration Tests - iterate per key interaction).
   4. Phase 4 (E2E Tests - iterate per critical flow).
   5. Phase 5 (Coverage Verification - ongoing).