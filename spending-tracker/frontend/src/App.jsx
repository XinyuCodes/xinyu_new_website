import { useState } from 'react';
import { getSpendingData } from './services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function App() {
  const [formData, setFormData] = useState({
    state: '',
    num_children: '',
    age: '',
    spending: ''
  });
  
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);

  const states = ['California', 'Texas', 'New York', 'Florida', 'Washington'];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const similarProfiles = await getSpendingData({
        state: formData.state,
        num_children: formData.num_children,
        age: formData.age
      });
      
      const avgSpending = similarProfiles.length > 0
        ? similarProfiles.reduce((sum, record) => sum + record.spending, 0) / similarProfiles.length
        : 0;
      
      const userSpending = parseFloat(formData.spending);
      const difference = userSpending - avgSpending;
      const percentDiff = avgSpending > 0 ? ((difference / avgSpending) * 100).toFixed(1) : 0;
      
      setComparisonData({
        userSpending,
        avgSpending: avgSpending.toFixed(2),
        difference: difference.toFixed(2),
        percentDiff,
        isAbove: difference > 0,
        chartData: [
          { name: 'Your Spending', amount: userSpending, fill: difference > 0 ? '#ef4444' : '#22c55e' },
          { name: 'Average Spending', amount: parseFloat(avgSpending.toFixed(2)), fill: '#3b82f6' }
        ]
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error comparing spending. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-3">💰 Spending Tracker</h1>
          <p className="text-xl text-purple-100">See how your spending compares!</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* State */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  State
                </label>
                <select 
                  name="state" 
                  value={formData.state} 
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors outline-none"
                >
                  <option value="">Select a state</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              {/* Number of Children */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Number of Children
                </label>
                <input
                  type="number"
                  name="num_children"
                  value={formData.num_children}
                  onChange={handleInputChange}
                  min="0"
                  max="10"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors outline-none"
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  min="18"
                  max="100"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors outline-none"
                />
              </div>

              {/* Spending */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Monthly Spending ($)
                </label>
                <input
                  type="number"
                  name="spending"
                  value={formData.spending}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors outline-none"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg rounded-lg hover:from-purple-700 hover:to-indigo-700 transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {loading ? 'Analyzing...' : 'Compare My Spending 🚀'}
            </button>
          </form>
        </div>

        {/* Results */}
        {comparisonData && (
          <div className="space-y-6">
            {/* Status Card */}
            <div className={`rounded-2xl shadow-2xl p-8 text-white text-center transform transition-all duration-500 ${
              comparisonData.isAbove 
                ? 'bg-gradient-to-br from-red-500 to-red-600' 
                : 'bg-gradient-to-br from-green-500 to-green-600'
            }`}>
              <h2 className="text-3xl font-bold mb-4">
                {comparisonData.isAbove ? '⚠️ Spending Above Average' : '✅ Spending Below Average'}
              </h2>
              <p className="text-xl mb-2">
                You're spending <span className="font-bold text-2xl">${Math.abs(comparisonData.difference)}</span>
                {comparisonData.isAbove ? ' more' : ' less'} than similar profiles
              </p>
              <p className="text-2xl font-bold mt-4">
                That's {Math.abs(comparisonData.percentDiff)}%
                {comparisonData.isAbove ? ' above' : ' below'} average!
              </p>
            </div>

            {/* Chart Card */}
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                📊 Spending Comparison
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparisonData.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#374151" />
                  <YAxis stroke="#374151" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                    {comparisonData.chartData.map((entry, index) => (
                      <Bar key={`bar-${index}`} dataKey="amount" fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Tips Card */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-r-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                💡 {comparisonData.isAbove ? 'Tips to Reduce Spending' : 'Great Job!'}
              </h3>
              {comparisonData.isAbove ? (
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-yellow-600 font-bold mr-3">→</span>
                    <span>Review your monthly subscriptions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 font-bold mr-3">→</span>
                    <span>Set a budget for discretionary spending</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 font-bold mr-3">→</span>
                    <span>Look for areas to cut back</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 font-bold mr-3">→</span>
                    <span>Consider meal planning to reduce food costs</span>
                  </li>
                </ul>
              ) : (
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-2xl mr-3">🎉</span>
                    <span className="pt-1">You're managing your budget well!</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-2xl mr-3">📊</span>
                    <span className="pt-1">Keep tracking your expenses</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-2xl mr-3">💰</span>
                    <span className="pt-1">Consider saving the difference</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-2xl mr-3">🤝</span>
                    <span className="pt-1">Share your budgeting tips with others!</span>
                  </li>
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;