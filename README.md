# CV Review - AI-Powered Resume Feedback

A Next.js 14 application that provides AI-powered feedback on CVs/resumes using Google Gemini API, built with Supabase for authentication and data storage.

## 🚀 Features

- **User Authentication**: Secure sign-up/sign-in with Supabase Auth
- **CV Upload**: Drag & drop PDF upload with validation
- **AI Analysis**: Extract text from PDFs and get detailed feedback from Google Gemini
- **Dashboard**: View upload history and feedback with TanStack Table
- **Admin Panel**: Admin-only view of all submissions
- **Real-time Updates**: Live status updates using TanStack Query
- **Modern UI**: Clean interface built with shadcn/ui and Tailwind CSS

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **AI API**: Google Gemini (free tier available)
- **UI Components**: shadcn/ui (Radix UI + Tailwind CSS)
- **Data Fetching**: TanStack Query
- **Tables**: TanStack Table
- **PDF Processing**: pdf-parse
- **Styling**: Tailwind CSS

## 📋 Prerequisites

- Node.js 18+ 
- A Supabase project
- An Anthropic API key
- npm/yarn/pnpm

## 🚀 Quick Start

### 1. Clone the repository

\`\`\`bash
git clone <repository-url>
cd cv-review
\`\`\`

### 2. Install dependencies

\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

### 3. Set up environment variables

Create a \`.env.local\` file in the root directory:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Google AI Configuration (Gemini)
GOOGLE_AI_API_KEY=your-google-ai-api-key

# Admin Configuration (optional)
ADMIN_EMAIL=admin@example.com
\`\`\`

### 4. Set up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the database migration:

\`\`\`sql
-- Copy the contents of supabase/migrations/001_initial_schema.sql
-- and run it in the Supabase SQL editor
\`\`\`

3. Create a storage bucket named \`cv-uploads\`:
   - Go to Storage in your Supabase dashboard
   - Create a new bucket called \`cv-uploads\`
   - Make it public if you want to allow file downloads

4. Set up RLS policies (already included in migration)

### 5. Get your API keys

**Supabase:**
- Go to Settings > API in your Supabase dashboard
- Copy the Project URL and anon/public key

**Google AI (Gemini):**
- Go to [makersuite.google.com](https://makersuite.google.com/app/apikey)
- Create a free API key (no credit card required)

### 6. Run the development server

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📖 Usage

### User Flow

1. **Sign Up/Sign In**: Create an account or sign in at `/login`
2. **Upload CV**: Upload a PDF resume on the dashboard
3. **AI Analysis**: The system extracts text and sends it to Claude for analysis
4. **View Feedback**: Get detailed feedback including:
   - Overall score (1-10)
   - Strengths and areas for improvement
   - Specific suggestions by section
   - Formatting feedback
   - Keyword analysis

### Admin Features

- Access admin dashboard at `/admin` (requires admin privileges)
- View all user submissions
- Search and filter uploads
- View any user's feedback

### Setting Up Admin Access

To make a user an admin:

1. Sign up the user normally
2. In Supabase, go to Table Editor > profiles
3. Find the user's record and set \`is_admin\` to \`true\`

## 🏗️ Project Structure

\`\`\`
cv-review/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── admin/            # Admin pages
│   └── login/            # Authentication
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   └── dashboard/       # Dashboard-specific components
├── hooks/               # Custom React hooks
├── lib/                # Utility functions
│   ├── supabase/       # Supabase client and types
│   ├── auth.ts         # Authentication helpers
│   └── utils.ts        # General utilities
├── supabase/           # Database migrations
└── public/             # Static assets
\`\`\`

## 🔧 Key Components

### CV Upload (\`components/dashboard/cv-upload.tsx\`)
- Drag & drop interface
- File validation (PDF only, max 10MB)
- Upload progress and status

### Feedback Display (\`components/dashboard/feedback-dialog.tsx\`)
- Structured feedback display
- Score visualization
- Categorized suggestions

### Data Tables (\`components/dashboard/cv-uploads-table.tsx\`)
- TanStack Table integration
- Sorting and filtering
- Status indicators

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Manual Deployment

\`\`\`bash
npm run build
npm start
\`\`\`

## 🔒 Security Features

- Row Level Security (RLS) on all database tables
- User isolation (users can only see their own data)
- Admin-only routes protected by middleware
- File upload validation and size limits
- Secure API key handling

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| \`NEXT_PUBLIC_SUPABASE_URL\` | Your Supabase project URL | Yes |
| \`NEXT_PUBLIC_SUPABASE_ANON_KEY\` | Supabase anonymous key | Yes |
| \`SUPABASE_SERVICE_ROLE_KEY\` | Supabase service role key | Yes |
| \`GOOGLE_AI_API_KEY\` | Gemini API key | Yes |
| \`ADMIN_EMAIL\` | Default admin email | No |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the [GitHub Issues](https://github.com/your-repo/issues)
2. Review the Supabase and Anthropic documentation
3. Ensure all environment variables are set correctly
4. Check the browser console and server logs for errors

## 🔮 Future Enhancements

- [ ] Support for multiple file formats (DOCX, TXT)
- [ ] Batch CV processing
- [ ] Export feedback as PDF
- [ ] Integration with job boards
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] Dark mode support