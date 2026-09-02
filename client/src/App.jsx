import { useState } from 'react'
import gitLogo from './assets/gitLogo.png'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function App() {

  const [username, setUsername] = useState(() => {
    const savedUsername = localStorage.getItem("username");
    return savedUsername ? savedUsername : "";
  })
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  // Search History
  const [searchHistory, setSearchHistory] = useState(() => {
    const saved = localStorage.getItem("searchHistory");
    return saved ? JSON.parse(saved) : [];
  })
  
  // Dark/Light Mode
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? JSON.parse(saved) : false;
  })
  
  // Copy to Clipboard
  const [copied, setCopied] = useState(false)

  // Copy to Clipboard Function
  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(false), 2000);
  }

  // Toggle Theme
  const toggleTheme = () => {
    setIsDark(!isDark);
    localStorage.setItem("theme", JSON.stringify(!isDark));
  }

  // handler Function
  const searchHandler = async (searchUsername) => {
    try{
      if(!searchUsername) { 
        setError("Please enter a username");
        return; 
      }
      
      setLoading(true);
      setError("");
      localStorage.setItem("username", searchUsername);

      const response = await fetch(`${API_URL}/api/search`, {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username: searchUsername })
      })

      if(!response.ok) {
        setError("User not found. Please check the username and try again.");
        setLoading(false);
        return;
      }

      const data = await response.json();
      setUserData(data);
      
      // Add to search history
      const updatedHistory = [searchUsername, ...searchHistory.filter(u => u !== searchUsername)].slice(0, 5);
      setSearchHistory(updatedHistory);
      localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
      
      setLoading(false);
    }
    catch(error){
      console.log("cannot fetch data : ", error);
      setError("Failed to fetch data. Please try again.");
      setLoading(false);
    }
  }

  if(userData) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'} flex items-center justify-center p-4`}>
        <div className={`${isDark ? 'bg-gray-800' : 'bg-gradient-to-br from-white to-slate-50'} rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-300 hover:shadow-3xl animate-fadeIn`}>
          {/* Header Background */}
          <div className="h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          
          {/* Content */}
          <div className={`px-8 pb-8 flex flex-col items-center ${isDark ? 'text-gray-100' : ''}`}>
            {/* Avatar with border */}
            <img
              src={userData.avatar_url}
              alt={userData.name}
              className={`w-28 h-28 rounded-full border-4 ${isDark ? 'border-gray-800' : 'border-white'} shadow-lg -mt-14 object-cover`}
            />
            
            <h2 className={`text-3xl font-bold mt-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{userData.name || userData.login}</h2>
            <p className="text-blue-400 text-sm font-semibold">@{userData.login}</p>
            
            {userData.bio && <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} mt-3 text-center leading-relaxed italic`}>{userData.bio}</p>}
            
            {/* Info Section */}
            <div className={`mt-4 w-full space-y-1 text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {userData.location && <p className="flex items-center justify-center gap-2">📍 {userData.location}</p>}
              {userData.company && <p className="flex items-center justify-center gap-2">🏢 {userData.company}</p>}
              {userData.blog && (
                <a 
                  href={userData.blog} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  🔗 {userData.blog}
                </a>
              )}
              {userData.twitter_username && <p className="flex items-center justify-center gap-2">𝕏 @{userData.twitter_username}</p>}
              {userData.email && <p className="flex items-center justify-center gap-2">✉️ {userData.email}</p>}
            </div>
            
            <p className={`text-xs mt-3 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>📅 Member since {new Date(userData.created_at).toLocaleDateString()}</p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mt-6 w-full">
              <div className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-br from-blue-100 to-blue-50 border-blue-200'} p-4 rounded-lg border transform transition-transform duration-200 hover:scale-105`}>
                <span className={`font-bold text-2xl block ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{userData.followers}</span>
                <p className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Followers</p>
              </div>
              <div className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-br from-purple-100 to-purple-50 border-purple-200'} p-4 rounded-lg border transform transition-transform duration-200 hover:scale-105`}>
                <span className={`font-bold text-2xl block ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>{userData.following}</span>
                <p className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Following</p>
              </div>
              <div className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-br from-green-100 to-green-50 border-green-200'} p-4 rounded-lg border transform transition-transform duration-200 hover:scale-105`}>
                <span className={`font-bold text-2xl block ${isDark ? 'text-green-400' : 'text-green-600'}`}>{userData.public_repos}</span>
                <p className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Repositories</p>
              </div>
              <div className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-br from-orange-100 to-orange-50 border-orange-200'} p-4 rounded-lg border transform transition-transform duration-200 hover:scale-105`}>
                <span className={`font-bold text-2xl block ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>{userData.public_gists}</span>
                <p className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Gists</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 mt-8 w-full flex-col">
              <div className="flex gap-2">
                <a 
                  href={userData.html_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-2 px-3 rounded-lg hover:shadow-lg transform transition-all duration-200 hover:scale-105 text-center text-sm"
                >
                  Visit Profile
                </a>
                <button 
                  onClick={() => copyToClipboard(userData.html_url, "Profile Link")}
                  className="flex-1 bg-blue-400 hover:bg-blue-500 text-white font-semibold py-2 px-3 rounded-lg transform transition-all duration-200 hover:scale-105 text-sm"
                  title="Copy profile URL"
                >
                  📋 Copy Link
                </button>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => copyToClipboard(userData.login, "Username")}
                  className="flex-1 bg-green-400 hover:bg-green-500 text-white font-semibold py-2 px-3 rounded-lg transform transition-all duration-200 hover:scale-105 text-sm"
                >
                  👤 Copy Username
                </button>
                <button 
                  onClick={() => {
                    setUsername("");
                    setUserData(null);
                    setError("");
                  }} 
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-3 rounded-lg transform transition-all duration-200 hover:scale-105 text-sm"
                >
                  ← Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // search form
  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} flex items-center justify-center p-4`}>
      <div className={`${isDark ? 'bg-gray-800' : 'bg-gradient-to-br from-white to-slate-50'} rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-300 animate-fadeIn`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-8 py-10 text-center relative">
          <button 
            onClick={toggleTheme}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white py-2 px-3 rounded-lg text-xl transition-all duration-200"
            title="Toggle dark mode"
          >
            {isDark ? "☀️" : "🌙"}
          </button>
          
          <img
            src={gitLogo}
            alt="GitHub Logo"
            className="w-16 h-16 mx-auto mb-4 drop-shadow-lg"
          />
          <h1 className="text-4xl font-bold text-white">GitHub Profile</h1>
          <p className="text-blue-100 text-sm mt-2">Search for any GitHub user</p>
        </div>

        {/* Content */}
        <div className={`px-8 py-8 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
          <div className="mb-4">
            <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Username</label>
            <input 
              type="text" 
              placeholder="e.g., torvalds, evanw" 
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-200 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400' : 'border-gray-300 focus:border-blue-500'}`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && searchHandler(username)}
              disabled={loading}
            />
          </div>

          {/* Search History */}
          {searchHistory.length > 0 && (
            <div className="mb-4">
              <p className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Recent Searches:</p>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => searchHandler(item)}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-3 rounded-full transition-all duration-200 hover:scale-105"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded animate-slideIn">
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Search Button */}
          <button 
            onClick={() => searchHandler(username)} 
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Searching...
              </span>
            ) : (
              "Search"
            )}
          </button>

          <p className={`text-center text-xs mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            💡 Tip: Press Enter to search
          </p>
        </div>
      </div>

      {/* Toast Notification for Copy */}
      {copied && (
        <div className="fixed top-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-slideIn flex items-center gap-2">
          <span>✓</span>
          <span>{copied} copied to clipboard!</span>
        </div>
      )}
    </div>
  )
}

export default App