import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Handle password reset logic here
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
          <Link to="/login" className="inline-flex items-center text-gray-400 hover:text-gray-300 mb-6">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to login
          </Link>

          {!submitted ? (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-center mb-8"
              >
                <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
                <p className="text-gray-400">Enter your email to receive reset instructions</p>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-gray-700 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    placeholder="Email address"
                    required
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg py-3 font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
                >
                  Send Reset Link
                </motion.button>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="mb-6">
                <Mail className="h-16 w-16 text-blue-500 mx-auto" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Check Your Email</h2>
              <p className="text-gray-400 mb-6">
                We've sent password reset instructions to {email}
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-blue-500 hover:text-blue-400"
              >
                Try another email
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};