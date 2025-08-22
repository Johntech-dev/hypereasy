# Contributing to HyperEasy

Thank you for your interest in contributing to HyperEasy! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Git
- Basic knowledge of TypeScript/React
- Familiarity with Next.js (helpful)

### Development Setup

1. **Fork and Clone**
   \`\`\`bash
   git clone https://github.com/yourusername/hypereasy.git
   cd hypereasy
   \`\`\`

2. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Setup**
   \`\`\`bash
   cp .env.example .env
   # Add your API keys for testing
   \`\`\`

4. **Database Setup**
   \`\`\`bash
   npm run db:push
   \`\`\`

5. **Start Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`

## 📋 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow existing naming conventions (camelCase for variables, PascalCase for components)
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions small and focused

### File Organization
\`\`\`
├── app/                 # Next.js app router pages
├── components/          # React components
├── lib/                # Utility functions and types
├── prisma/             # Database schema
├── scripts/            # Database scripts
└── public/             # Static assets
\`\`\`

### Component Guidelines
- Use functional components with hooks
- Implement proper TypeScript typing
- Follow the existing design system
- Ensure mobile responsiveness
- Add proper accessibility attributes

### API Guidelines
- Validate all inputs
- Use proper HTTP status codes
- Include comprehensive error handling
- Add rate limiting where appropriate
- Document all endpoints

## 🧪 Testing

### Running Tests
\`\`\`bash
npm test                 # Run all tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run with coverage report
\`\`\`

### Writing Tests
- Write tests for all new features
- Include both positive and negative test cases
- Test error conditions
- Mock external API calls
- Aim for >80% code coverage

### Test Structure
\`\`\`javascript
describe('Component/Function Name', () => {
  it('should handle normal case', () => {
    // Test implementation
  });

  it('should handle error case', () => {
    // Error test implementation
  });
});
\`\`\`

## 🔄 Pull Request Process

### Before Submitting
1. Ensure all tests pass
2. Run linting and fix any issues
3. Update documentation if needed
4. Test your changes thoroughly
5. Rebase your branch on latest main

### PR Guidelines
- Use descriptive commit messages
- Reference related issues
- Include screenshots for UI changes
- Add tests for new functionality
- Update README if needed

### Commit Message Format
\`\`\`
type(scope): description

feat(api): add market data caching
fix(ui): resolve mobile layout issue
docs(readme): update installation instructions
\`\`\`

## 🐛 Bug Reports

### Before Reporting
- Check existing issues
- Try to reproduce the bug
- Test on different browsers/devices
- Gather relevant information

### Bug Report Template
\`\`\`markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. iOS]
- Browser [e.g. chrome, safari]
- Version [e.g. 22]
\`\`\`

## 💡 Feature Requests

### Before Requesting
- Check if feature already exists
- Search existing feature requests
- Consider if it fits the project scope

### Feature Request Template
\`\`\`markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Other solutions you've considered.

**Additional context**
Any other context or screenshots.
\`\`\`

## 🏗️ Architecture

### Key Components
- **API Layer**: Next.js API routes for Hyperliquid integration
- **Database**: Prisma with SQLite for transaction logging
- **Frontend**: React components with Tailwind CSS
- **SDK**: TypeScript client for developers

### Design Patterns
- Repository pattern for data access
- Service layer for business logic
- Component composition for UI
- Hook-based state management

## 📚 Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Hyperliquid API](https://hyperliquid.gitbook.io/hyperliquid-docs)

### Tools
- [TypeScript](https://www.typescriptlang.org/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Jest](https://jestjs.io/)

## 🤝 Community

### Communication
- Use GitHub Issues for bugs and features
- Join our Discord for discussions
- Be respectful and constructive
- Help others when possible

### Recognition
Contributors will be:
- Listed in README
- Mentioned in release notes
- Invited to maintainer discussions
- Given credit in documentation

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## ❓ Questions?

If you have questions about contributing, please:
1. Check this document
2. Search existing issues
3. Ask in our Discord
4. Create a new issue

Thank you for contributing to HyperEasy! 🚀
