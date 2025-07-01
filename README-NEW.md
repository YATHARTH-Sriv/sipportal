# SIP Portal

A modern, AI-powered web portal for exploring Sui Improvement Proposals (SIPs) with intelligent summaries and enhanced user experience.

## ✨ Features

- **🤖 AI-Powered Summaries**: Get intelligent, structured summaries of complex SIPs using OpenAI GPT-4
- **🎨 Modern UI**: Clean, responsive design with Tailwind CSS
- **🔍 Smart Search**: Search through SIPs by title and content
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **⚡ Real-time Updates**: Fetches the latest SIPs from the official Sui repository
- **🏷️ Status Tracking**: Visual indicators for SIP status (Draft, Review, Accepted, Final, etc.)
- **📊 Multiple View Modes**: Grid and list views for different browsing preferences
- **🔗 GitHub Integration**: Direct links to view SIPs on GitHub

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key (optional but recommended for AI summaries)

### Installation

1. Navigate to the project directory:
```bash
cd sipportal
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your OpenAI API key to `.env.local`:
```
OPENAI_API_KEY=your_openai_api_key_here
```

> **Note**: The application will work without an OpenAI API key, but AI summaries will not be available.

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4
- **UI Components**: Custom components with Lucide React icons
- **AI Integration**: OpenAI GPT-4 for intelligent summaries
- **Markdown Processing**: Marked.js for rendering SIP content
- **TypeScript**: Full type safety throughout the application

## 📖 How It Works

### AI Summary Generation

1. **Content Analysis**: The app fetches raw SIP content from the Sui GitHub repository
2. **AI Processing**: GPT-4 analyzes the content and generates structured summaries including:
   - Executive summary for non-technical users
   - Key points and changes
   - Technical implementation details
   - Ecosystem impact analysis
   - Categorization
3. **Fallback Handling**: If AI is unavailable, the app gracefully shows the full proposal

### Data Flow

```
GitHub SIPs Repository → Fetch API → AI Analysis → Structured Summary → User Interface
```

## 🎨 UI Enhancements

### Homepage
- Gradient background with modern header
- Search functionality with real-time filtering
- Grid/list view toggle
- Loading states with skeleton screens
- Status indicators and metadata display

### SIP Detail Pages
- Sticky sidebar with metadata and navigation
- AI summary section with structured information
- Full proposal with enhanced typography
- Responsive design for all screen sizes

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for AI summaries | Optional |

### Customization

The app uses Tailwind CSS for styling. You can customize the design by modifying:
- `src/app/globals.css` - Global styles and typography
- Component files - Individual component styling
- Color scheme and theme settings

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Sui Foundation](https://github.com/sui-foundation/sips) for the SIPs repository
- [OpenAI](https://openai.com) for GPT-4 API
- [Next.js](https://nextjs.org) team for the amazing framework
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework
