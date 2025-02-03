# Interest Discovery

A modern web application built with Gatsby and React that helps users discover and explore their interests through an interactive questionnaire and search interface.

## Features

- **Interactive Interest Quiz**: Dynamic questionnaire that adapts to user responses
- **Smart Interest Suggestions**: Contextual answer options based on question types
- **Visual Feedback**: Engaging animations and confetti effects for user interactions
- **Interest Categories**: Organized categorization of interests with subcategories
- **Search Functionality**: Real-time search with category-based suggestions
- **Related Interests**: Automatic suggestions based on quiz answers
- **Modern UI**: Sleek dark mode interface with purple accents
- **Responsive Design**: Works seamlessly on all device sizes

## Tech Stack

- **Framework**: Gatsby.js (React)
- **Styling**: Tailwind CSS
- **Data**: GraphQL
- **Animations**: CSS Transforms & Transitions
- **Performance**: React.memo & Optimized Renders

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/nxtcarson/interest-discovery.git
cd interest-discovery
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run develop
```

4. Open your browser and visit `http://localhost:8000`

## Project Structure

```
interest-discovery/
├── src/
│   ├── pages/
│   │   └── index.js       # Main application component
│   └── data/
│       └── categories.json # Interest categories and questions
├── gatsby-config.js       # Gatsby configuration
├── gatsby-node.js         # GraphQL schema customization
└── package.json          # Project dependencies
```

## Deployment

This project is deployed on Netlify. To deploy your own instance:

1. Fork this repository
2. Sign up for Netlify
3. Create a new site from Git
4. Select your forked repository
5. Configure build settings:
   - Build command: `gatsby build`
   - Publish directory: `public/`
6. Deploy!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own learning or applications.

## Acknowledgments

- Built with Gatsby.js
- Styled with Tailwind CSS
- Animations powered by CSS transforms
- Deployed on Netlify 