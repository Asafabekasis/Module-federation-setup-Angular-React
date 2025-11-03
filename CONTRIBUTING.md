# Contributing to Angular ↔ React Module Federation

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/Module-federation-setup-Angular---React.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Commit using conventional commits: `git commit -m "feat: add new feature"`
6. Push to your fork: `git push origin feature/your-feature-name`
7. Open a Pull Request

## Development Setup

```bash
# Install all dependencies
cd angular/client && npm install
cd ../../react && npm install
cd "../angular to angular/client" && npm install

# Run all apps
# Terminal 1
cd angular/client && ng serve

# Terminal 2
cd react && npm start

# Terminal 3
cd "angular to angular/client" && ng serve
```

## Coding Standards

- **TypeScript**: Use strict mode
- **Angular**: Follow Angular style guide
- **React**: Use functional components with hooks
- **Formatting**: Use Prettier (will be enforced via pre-commit hooks)
- **Commits**: Follow [Conventional Commits](https://www.conventionalcommits.org/)

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples
```
feat(angular-host): add error boundary for remote loading
fix(react-remote): resolve CORS issue with dynamic origins
docs(readme): add architecture diagram
```

## Pull Request Process

1. Update README.md with details of changes if applicable
2. Ensure all builds pass (`npm run build` for each app)
3. Update documentation for any API changes
4. Your PR will be reviewed by maintainers

## Areas for Contribution

- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- ⚡ Performance optimizations
- 🧪 Test coverage
- 🌐 Internationalization

## Questions?

Feel free to open an issue for:
- Bug reports
- Feature requests
- Questions about the architecture
- Suggestions for improvements

## Code of Conduct

Be respectful, inclusive, and collaborative. We're all here to learn and build together!
