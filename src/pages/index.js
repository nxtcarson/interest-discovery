import * as React from "react";
import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { graphql, useStaticQuery } from "gatsby";
import debounce from 'lodash/debounce';

// Move getAnswerOptions before components
const getAnswerOptions = (question) => {
  if (!question) return [];
  
  // Art preferences
  if (question.text.includes("digital or traditional art")) {
    return [
      "Strongly prefer digital art",
      "Slightly prefer digital art",
      "Enjoy both equally",
      "Slightly prefer traditional art",
      "Strongly prefer traditional art"
    ];
  }
  
  // Movie/Show preferences
  if (question.text.includes("explain everything or leave things open")) {
    return [
      "Strongly prefer clear explanations",
      "Prefer some explanation with mystery",
      "Enjoy both styles",
      "Prefer some mystery with hints",
      "Strongly prefer open interpretation"
    ];
  }

  // Gaming preferences
  if (question.text.includes("single-player or multiplayer")) {
    return [
      "Exclusively single-player",
      "Mostly single-player, sometimes multiplayer",
      "Enjoy both equally",
      "Mostly multiplayer, sometimes single-player",
      "Exclusively multiplayer"
    ];
  }

  if (question.text.includes("story or gameplay")) {
    return [
      "All about the story",
      "Story with good gameplay",
      "Both are equally important",
      "Gameplay with good story",
      "All about the gameplay"
    ];
  }

  // Technology preferences
  if (question.text.includes("frontend or backend")) {
    return [
      "Exclusively frontend",
      "Mostly frontend",
      "Full stack / Both",
      "Mostly backend",
      "Exclusively backend"
    ];
  }

  // Media consumption
  if (question.text.includes("analyzing hidden meanings")) {
    return [
      "Love deep analysis and theories",
      "Enjoy occasional analysis",
      "Sometimes, if interesting",
      "Prefer surface-level enjoyment",
      "Just want to enjoy without analysis"
    ];
  }

  // For questions about what inspires
  if (question.text.includes("inspires")) {
    return [
      "Nature and the world around me",
      "Other artists and creators",
      "Personal experiences and emotions",
      "Stories and narratives",
      "Abstract concepts and ideas"
    ];
  }

  // For questions about creating for self vs others
  if (question.text.includes("create") && question.text.includes("yourself or others")) {
    return [
      "Purely for personal expression",
      "Mostly for myself, sometimes share",
      "Balance of both",
      "Mostly for others, but personal too",
      "Primarily for audience/others"
    ];
  }

  // For favorite/interest questions
  if (question.text.includes("favorite") || question.text.includes("interest")) {
    return [
      "Very passionate about it",
      "Quite interested",
      "Somewhat interested",
      "Mildly curious",
      "Not particularly interested"
    ];
  }

  // For questions about the last time something happened
  if (question.text.includes("last") || question.text.includes("recently")) {
    return [
      "Very recently (past week)",
      "Recently (past month)",
      "A while ago (past year)",
      "Long time ago",
      "Never"
    ];
  }

  // For questions about enjoyment
  if (question.text.includes("enjoy") || question.text.includes("like")) {
    return [
      "Absolutely love it",
      "Really enjoy it",
      "It's okay",
      "Not really my thing",
      "Strongly dislike it"
    ];
  }

  // Default options for other types of questions
  return [
    "Strongly agree",
    "Somewhat agree",
    "Neutral/Unsure",
    "Somewhat disagree",
    "Strongly disagree"
  ];
};

const ConfettiEffect = memo(({ show }) => {
  if (!show) return null;
  return (
    <div className="confetti-container">
      {[...Array(50)].map((_, i) => (
        <div 
          key={i} 
          className="confetti"
          style={{
            '--delay': `${Math.random() * 3}s`,
            '--x-end': `${-50 + Math.random() * 100}%`,
            left: `${Math.random() * 100}%`
          }}
        />
      ))}
    </div>
  );
});

const QuestionCard = memo(({ question, onAnswer }) => {
  const options = getAnswerOptions(question);
  return (
    <div className="question-card">
      <h3 className="question-text">{question.text}</h3>
      <div className="answer-options">
        {options.map((option, index) => (
          <button
            key={index}
            className="answer-button"
            onClick={() => onAnswer(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
});

const IndexPage = () => {
  const data = useStaticQuery(graphql`
    query {
      allCategoriesJson {
        nodes {
          name
          interests
          subCategories {
            name
            interests
          }
          questions {
            text
            relatedInterests
          }
        }
      }
    }
  `);

  const allCategories = data.allCategoriesJson.nodes;
  const [currentInterests, setCurrentInterests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    const results = allCategories.reduce((acc, category) => {
      const mainInterests = category.interests.filter(interest =>
        interest.toLowerCase().includes(searchQuery.toLowerCase())
      ).map(interest => ({
        category: category.name,
        subCategory: null,
        interest
      }));

      const subInterests = (category.subCategories || []).reduce((subAcc, subCategory) => {
        const matchingSubInterests = subCategory.interests.filter(interest =>
          interest.toLowerCase().includes(searchQuery.toLowerCase())
        ).map(interest => ({
          category: category.name,
          subCategory: subCategory.name,
          interest
        }));
        return [...subAcc, ...matchingSubInterests];
      }, []);

      return [...acc, ...mainInterests, ...subInterests];
    }, []);

    setSearchResults(results);
  }, [searchQuery, allCategories]);

  const addInterest = (interest) => {
    if (!currentInterests.includes(interest)) {
      setCurrentInterests(prev => [...prev, interest]);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
    setSearchQuery("");
  };

  const addRelatedInterests = (answer, question) => {
    const positiveAnswers = [
      "Very recently (past week)",
      "Recently (past month)",
      "Very passionate about it",
      "Quite interested",
      "Absolutely love it",
      "Really enjoy it",
      "Love deep analysis and theories",
      "Enjoy occasional analysis"
    ];

    if (positiveAnswers.includes(answer) && question.relatedInterests) {
      question.relatedInterests.forEach(interest => {
        if (!currentInterests.includes(interest)) {
          setCurrentInterests(prev => [...prev, interest]);
        }
      });
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  };

  const startQuestionnaire = (category = null) => {
    if (category) {
      setCurrentCategory(category);
    } else {
      const firstCategoryWithQuestions = allCategories.find(cat => cat.questions && cat.questions.length > 0);
      setCurrentCategory(firstCategoryWithQuestions);
    }
    setQuestionIndex(0);
    setShowQuestionnaire(true);
    setAnswers([]);
    setSelectedAnswer(null);
  };

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    const currentQuestion = currentCategory.questions[questionIndex];
    
    setAnswers([...answers, { 
      category: currentCategory.name, 
      question: currentQuestion.text, 
      answer 
    }]);

    addRelatedInterests(answer, currentQuestion);

    setTimeout(() => {
      setSelectedAnswer(null);
      nextQuestion();
    }, 500);
  };

  const nextQuestion = () => {
    if (!currentCategory) return;

    if (questionIndex < currentCategory.questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      const currentCategoryIndex = allCategories.findIndex(cat => cat.name === currentCategory.name);
      const nextCategory = allCategories.slice(currentCategoryIndex + 1)
        .find(cat => cat.questions && cat.questions.length > 0);

      if (nextCategory) {
        setCurrentCategory(nextCategory);
        setQuestionIndex(0);
      } else {
        setShowQuestionnaire(false);
        setCurrentCategory(null);
        setQuestionIndex(0);
      }
    }
  };

  const debouncedShowConfetti = useCallback(
    debounce(() => {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }, 300),
    []
  );

  const currentQuestion = useMemo(() => 
    currentCategory?.questions[questionIndex],
    [currentCategory, questionIndex]
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <ConfettiEffect show={showConfetti} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center animate-glow">
          Interest Discovery
        </h1>
        
        <div className="bg-gray-800 shadow-lg rounded-lg p-6 border border-purple-500/20">
          <div className="mb-6">
            <label htmlFor="search" className="block text-sm font-medium text-purple-300 mb-2">
              Search Interests
            </label>
            <input
              type="text"
              id="search"
              className="block w-full rounded-md bg-gray-700 border-purple-500 text-white shadow-sm focus:border-purple-400 focus:ring focus:ring-purple-500/50"
              placeholder="Type to search interests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {searchResults.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-medium text-purple-300 mb-2">Suggestions</h2>
              <div className="bg-gray-700 rounded-md p-2 space-y-1">
                {searchResults.map(({ category, subCategory, interest }, index) => (
                  <button
                    key={index}
                    className="w-full text-left px-3 py-2 hover:bg-gray-600 rounded-md flex justify-between items-center text-white transition-colors duration-200"
                    onClick={() => addInterest(interest)}
                  >
                    <span>{interest}</span>
                    <span className="text-sm text-purple-300">
                      {subCategory ? `${category} › ${subCategory}` : category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {showQuestionnaire && currentCategory && (
            <div className="mb-6 bg-gray-700 rounded-lg p-6 border border-purple-500/30">
              <h2 className="text-lg font-medium text-white mb-4">
                {currentCategory.name} Questionnaire
              </h2>
              <p className="text-purple-200 mb-6 text-lg">
                {currentQuestion?.text}
              </p>
              <div className="space-y-3">
                {getAnswerOptions(currentQuestion).map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className={`w-full text-left px-4 py-3 bg-gray-800 hover:bg-gray-600 text-white rounded-md transition-all duration-200 hover:shadow-md transform hover:scale-[1.02] ${
                      selectedAnswer === option ? 'bg-purple-700 scale-[1.02]' : ''
                    }`}
                  >
                    {option}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setShowQuestionnaire(false);
                    setCurrentCategory(null);
                    setQuestionIndex(0);
                  }}
                  className="w-full text-center px-4 py-2 text-purple-300 hover:text-purple-200 mt-4"
                >
                  Skip Category
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-white">Your Interests</h2>
              <button
                onClick={() => startQuestionnaire()}
                className="text-sm text-white bg-purple-600 px-4 py-2 rounded-md hover:bg-purple-500 transition-colors duration-200"
              >
                Take Interest Quiz
              </button>
            </div>
            {currentInterests.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {currentInterests.map((interest, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-900 text-purple-100 hover:bg-purple-800 transition-colors duration-200"
                  >
                    {interest}
                    <button
                      type="button"
                      className="ml-2 inline-flex items-center p-0.5 hover:bg-purple-700 rounded-full"
                      onClick={() => setCurrentInterests(currentInterests.filter((_, i) => i !== index))}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-purple-300 text-center py-4">
                Start typing to discover your interests or take the quiz!
              </p>
            )}
          </div>

          {currentInterests.length > 0 && (
            <div className="mt-8 pt-6 border-t border-purple-500/20">
              <h2 className="text-lg font-medium text-white mb-4">Related Categories</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {allCategories.map((category, index) => {
                  const matchingMainInterests = category.interests.filter(interest => 
                    currentInterests.includes(interest)
                  );
                  
                  const matchingSubInterests = (category.subCategories || []).reduce((acc, subCategory) => {
                    const matches = subCategory.interests.filter(interest => 
                      currentInterests.includes(interest)
                    );
                    return [...acc, ...matches];
                  }, []);

                  const totalMatches = matchingMainInterests.length + matchingSubInterests.length;
                  if (totalMatches === 0) return null;

                  return (
                    <div key={index} className="bg-gray-700 rounded-lg p-4 border border-purple-500/20 hover:border-purple-500/40 transition-colors duration-200">
                      <h3 className="font-medium text-white mb-2">{category.name}</h3>
                      <div className="text-sm text-purple-300">
                        {totalMatches} matching {totalMatches === 1 ? 'interest' : 'interests'}
                      </div>
                      <button
                        onClick={() => startQuestionnaire(category)}
                        className="mt-2 text-sm text-purple-300 hover:text-purple-200 transition-colors duration-200"
                      >
                        Explore More
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-10vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes glow {
          0%, 100% {
            text-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
          }
          50% {
            text-shadow: 0 0 20px rgba(139, 92, 246, 0.8);
          }
        }

        .animate-confetti {
          pointer-events: none;
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }

        .confetti-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1000;
        }
        
        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          background: linear-gradient(45deg, #ff00ff, #00ffff);
          border-radius: 2px;
          opacity: 0;
          animation: confetti-fall 3s ease-out var(--delay) forwards;
          transform-origin: center;
        }
        
        @keyframes confetti-fall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) translateX(var(--x-end)) rotate(720deg);
            opacity: 0;
          }
        }
        
        .answer-button {
          transform: scale(1);
          transition: transform 0.2s ease-out;
        }
        
        .answer-button:hover {
          transform: scale(1.05);
        }
        
        .question-card {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 0.3s ease-out, transform 0.3s ease-out;
        }
        
        .question-card.exit {
          opacity: 0;
          transform: translateY(-20px);
        }
      `}</style>
    </main>
  );
};

export default IndexPage;

export const Head = () => <title>Interest Discovery</title>; 