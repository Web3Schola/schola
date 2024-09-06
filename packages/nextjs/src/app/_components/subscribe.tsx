"use client";

import React, { useState } from "react";
import { saveEmailToDatabase } from "../../lib/register-email";
import { motion } from "framer-motion";

export default function Subscribe() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleSaveEmailAndShowToast = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveEmailToDatabase(email, name);
    setEmail("");
    setName("");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="hero bg-gradient-to-br from-blue-100 to-purple-100 py-20">
      <div className="hero-content flex-col lg:flex-row-reverse gap-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center lg:text-left max-w-md"
        >
          <h1 className="text-5xl font-bold text-blue-800 mb-6">
            Elevate Your Expertise
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed">
            Transform your knowledge into a thriving online course. Our platform
            provides all the tools you need to create, market, and sell your
            expertise. Start your journey to becoming a successful online
            educator today!
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="card bg-white w-full max-w-sm shrink-0 shadow-xl"
        >
          <form className="card-body" onSubmit={handleSaveEmailAndShowToast}>
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
              Book Your Free Demo
            </h2>
            <div className="form-control">
              <input
                type="email"
                placeholder="Your Email"
                className="input input-bordered bg-gray-50 focus:bg-white transition-colors"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-control mt-4">
              <input
                type="text"
                placeholder="Your Name"
                className="input input-bordered bg-gray-50 focus:bg-white transition-colors"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white"
              >
                Start Your Journey
              </button>
            </div>
          </form>
        </motion.div>
      </div>
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="toast toast-top toast-center"
        >
          <div className="alert alert-success bg-green-500 text-white">
            <span>Successfully registered! We&apos;ll be in touch soon.</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
