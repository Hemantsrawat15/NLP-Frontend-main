import React from 'react';
import {
  Play,
  BookOpen,
  Calculator,
  TrendingUp,
  ArrowRight,
  Users,
  Award,
  Lightbulb
} from 'lucide-react';

const HomePage = ({ onStartChat }) => {
  const features = [
    {
      icon: Calculator,
      title: 'Linear Programming',
      description:
        'Solve complex optimization problems with ease using our advanced LP solver.'
    },
    {
      icon: TrendingUp,
      title: 'Real-time Visualization',
      description:
        'See your optimization problems come to life with interactive graphs and charts.'
    },
    {
      icon: Lightbulb,
      title: 'AI-Powered Assistant',
      description:
        'Get intelligent help and explanations for your optimization challenges.'
    },
    {
      icon: BookOpen,
      title: 'Educational Resources',
      description:
        'Learn operations research concepts with our comprehensive tutorials.'
    }
  ];

  const benefits = [
    { icon: Users, text: 'Used by 10,000+ students and professionals' },
    { icon: Award, text: 'Industry-leading optimization algorithms' },
    { icon: BookOpen, text: 'Comprehensive learning materials' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-500/5 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
            <Calculator className="text-blue-300" size={24} />
            <span className="text-white font-semibold text-lg">
              OR-NLP Optimization Suite
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Master
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {' '}
              Operations Research
            </span>
            <br />
            with AI-Powered Learning
          </h1>

          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Learn linear programming, nonlinear optimization, and operations
            research concepts through interactive tutorials, real-time problem
            solving, and intelligent assistance.
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2"
              >
                <benefit.icon className="text-green-400" size={20} />
                <span className="text-white text-sm">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tutorial Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              📚 Operations Research & NLP Tutorial
            </h2>

            <div className="relative rounded-xl overflow-hidden shadow-2xl bg-gray-900">
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/2ACJ9ewUC6U"
                  title="Operations Research and Linear Programming Tutorial"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="rounded-xl"
                ></iframe>
              </div>

              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-6">
                  <Play className="text-white" size={32} />
                </div>
              </div>
            </div>

            <p className="text-blue-100 text-center mt-6 text-lg">
              Watch this comprehensive tutorial to understand the fundamentals
              of Operations Research and get started with linear programming
              concepts.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <feature.icon className="text-white" size={28} />
              </div>
              <h3 className="text-white font-semibold text-lg mb-3">
                {feature.title}
              </h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-12 border border-white/10">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Start Optimizing?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Begin your journey with our AI-powered optimization assistant. Ask
              questions, solve problems, and visualize solutions in real-time.
            </p>

            <button
              onClick={onStartChat}
              className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-5 rounded-2xl font-bold text-xl transition-all duration-300 flex items-center gap-4 mx-auto shadow-2xl hover:shadow-blue-500/25 hover:scale-105"
            >
              <Calculator size={28} />
              Start Optimization Assistant
              <ArrowRight
                size={24}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </button>

            <p className="text-blue-200 text-sm mt-6">
              No registration required • Free to use • Instant access
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
