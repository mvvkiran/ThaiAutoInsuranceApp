# Thai Auto Insurance Frontend

Angular frontend application for the Thai Auto Insurance system.

## Features

- **Thai/English Language Support**: Full internationalization with Thai and English translations
- **Authentication System**: Login, registration, password reset with JWT token management
- **Customer Dashboard**: Profile management, policy overview, claims tracking
- **Policy Management**: Insurance quote calculator, policy purchase flow, renewals
- **Claims Processing**: Claim reporting, document upload, status tracking
- **Admin Panel**: Customer management, claims processing, reports and analytics
- **Thai-Specific Features**: National ID validation, Thai address autocomplete, THB currency formatting
- **Responsive Design**: Mobile-first approach with Angular Material components
- **State Management**: NgRx for application state management
- **Security**: HTTP interceptors, route guards, CSRF protection

## Technology Stack

- **Framework**: Angular 17+
- **UI Components**: Angular Material
- **State Management**: NgRx
- **Styling**: SCSS with Angular Material theming
- **Forms**: Reactive Forms with custom validators
- **HTTP**: HttpClient with interceptors
- **Internationalization**: Custom translation service
- **Testing**: Jasmine, Karma, Playwright
- **Build**: Angular CLI

## Prerequisites

- Node.js 18+
- npm 9+
- Angular CLI 17+

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Angular CLI globally (if not already installed):
   ```bash
   npm install -g @angular/cli
   ```

## Development

1. Start the development server:
   ```bash
   npm start
   ```
   Or:
   ```bash
   ng serve
   ```

2. Open your browser and navigate to `http://localhost:4200`

3. The application will automatically reload when you make changes to the source files.

## Build

### Development Build
```bash
npm run build
```

### Production Build
```bash
npm run build:prod
```

Built files will be stored in the `dist/` directory.

## Testing

### Unit Tests
```bash
npm test
```

### Unit Tests with Coverage
```bash
npm run test:coverage
```

### Unit Tests (Headless)
```bash
npm run test:headless
```

### End-to-End Tests
```bash
npm run e2e
```

## Code Quality

### Linting
```bash
npm run lint
```

### Bundle Analysis
```bash
npm run analyze
```

## Project Structure

```
src/
├── app/
│   ├── core/                 # Core services, guards, interceptors
│   │   ├── guards/           # Route guards (auth, role)
│   │   ├── interceptors/     # HTTP interceptors
│   │   ├── services/         # Core services (auth, loading, etc.)
│   │   └── models/           # TypeScript interfaces and models
│   ├── shared/               # Shared components, pipes, directives
│   │   ├── components/       # Reusable UI components
│   │   ├── pipes/            # Custom pipes (currency, date, etc.)
│   │   └── directives/       # Custom directives
│   ├── features/             # Feature modules (lazy-loaded)
│   │   ├── auth/             # Authentication module
│   │   ├── dashboard/        # Dashboard module
│   │   ├── customer/         # Customer profile module
│   │   ├── policy/           # Policy management module
│   │   ├── claims/           # Claims management module
│   │   └── admin/            # Admin panel module
│   ├── app.component.*       # Root component
│   ├── app.module.ts         # Root module
│   └── app-routing.module.ts # Main routing configuration
├── assets/
│   ├── i18n/                 # Translation files (th.json, en.json)
│   ├── images/               # Static images
│   └── styles/               # Global styles
├── environments/             # Environment configurations
└── styles.scss              # Global styles
```

## Key Features Implementation

### Authentication
- JWT token-based authentication
- Automatic token refresh
- Route guards for protected pages
- Role-based access control

### Internationalization
- Thai and English language support
- Dynamic language switching
- Thai-specific formatting (currency, dates, numbers)
- Right-to-left text support where needed

### Thai-Specific Features
- National ID validation and formatting
- Thai phone number validation
- Province/district/subdistrict dropdowns
- Thai address input components
- Buddhist calendar date support

### Form Validation
- Thai National ID validator
- Thai phone number validator
- Password strength validator
- Custom async validators
- Real-time validation feedback

### State Management
- NgRx store for application state
- Effects for API calls
- Entity state management
- Optimistic updates

## Environment Configuration

Update `src/environments/environment.ts` and `src/environments/environment.prod.ts` with your configuration:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  // ... other configuration
};
```

## Deployment

### Docker Deployment
1. Build the production version:
   ```bash
   npm run build:prod
   ```

2. Use the built files in your web server configuration.

### Environment Variables
- `API_URL`: Backend API URL
- `GOOGLE_MAPS_API_KEY`: For address autocomplete
- `FIREBASE_CONFIG`: For push notifications (optional)
- `SENTRY_DSN`: For error tracking (optional)

## Browser Support

- Chrome (latest)
- Firefox (latest)  
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Lazy loading for feature modules
- OnPush change detection strategy
- Virtual scrolling for large lists
- Image optimization and lazy loading
- Service worker for caching (production)

## Accessibility

- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus management

## Contributing

1. Follow Angular style guide
2. Use TypeScript strict mode
3. Write unit tests for new components
4. Update translations for new text
5. Follow the existing code patterns
6. Keep components under 300 lines
7. Keep services under 500 lines

## License

Private - All rights reserved

## Support

For technical support, please contact the development team.