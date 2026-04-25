# AI Coding Agent Instructions for Respect Portfolio

## Project Overview
This is a static single-page portfolio website built with vanilla HTML5, CSS3, and JavaScript. No frameworks, build tools, or external dependencies - just pure web technologies.

## Architecture & Structure
- **Single HTML file** (`index.html`) with semantic sections (home, about, skills, projects, contact)
- **Modular CSS** (`style.css`) using CSS custom properties for theming and consistent design tokens
- **Interactive JavaScript** (`script.js`) handling navigation, animations, and form submission

## Key Patterns & Conventions

### CSS Architecture
- Use CSS custom properties (variables) defined in `:root` for colors, typography, and spacing
- Follow established color palette: primary (#2563eb), secondary (#06b6d4), accent (#a855f7)
- Apply gradients using predefined `--gradient-*` variables
- Use Inter font family as the primary typeface

### JavaScript Organization
- Structure code in clear sections with banner comments (e.g., `// ==========================================`)
- Use modern ES6+ features: arrow functions, template literals, const/let
- Implement event listeners with proper null checks (e.g., `if (hamburger && navMenu)`)
- Include performance optimizations like Intersection Observer for scroll animations

### HTML Structure
- Use semantic HTML5 elements (`<nav>`, `<section>`, `<footer>`)
- Implement accessible navigation with proper ARIA labels
- Structure content with container divs for consistent layout

## Development Workflow
- **No build process required** - open `index.html` directly in browser
- **Live development**: Edit files and refresh browser to see changes
- **Testing**: Cross-browser testing for responsive design across devices

## Common Tasks & Patterns

### Adding New Sections
1. Create new `<section id="new-section">` in `index.html`
2. Add navigation link in the navbar menu
3. Style with existing CSS classes and custom properties
4. Add scroll animation by including relevant classes (e.g., `.skill-card`, `.project-card`)

### Form Handling
- Use basic form validation with HTML5 attributes
- Handle submission with `addEventListener('submit')` and `preventDefault()`
- Show user feedback via alerts (demo implementation)
- Reset form after successful submission

### Animations & Interactions
- Use Intersection Observer for fade-in animations on scroll
- Implement smooth scrolling with `window.scrollTo({ behavior: 'smooth' })`
- Add hover effects using CSS transforms and transitions

### Responsive Design
- Mobile-first approach with hamburger menu toggle
- Use CSS Grid and Flexbox for layouts
- Test breakpoints: mobile (< 768px), tablet (768px-1024px), desktop (> 1024px)

## File References
- `index.html`: Main structure and content
- `style.css`: Complete styling system with design tokens
- `script.js`: All interactive functionality and effects

## Quality Standards
- Maintain clean, readable code with consistent commenting
- Ensure responsive design works across all screen sizes
- Include accessibility features (ARIA labels, semantic HTML)
- Optimize performance with lazy loading and efficient animations