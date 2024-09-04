"use client";

import React, { useState } from "react";
import { saveEmailToDatabase } from "../../lib/register-email";

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
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Try now!</h1>
          <p className="py-6">
            Launch your online course today! Our platform provides all the tools
            you need to create, and sell your expertise. We make it easy to turn
            your knowledge into a online business. Don&apos;t wait — start
            monetizing your skills now!
          </p>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <form className="card-body" onSubmit={handleSaveEmailAndShowToast}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="email"
                className="input input-bordered"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                placeholder="name"
                className="input input-bordered"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">
                Book demo
              </button>
            </div>
          </form>
        </div>
      </div>
      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Email registrado con éxito!</span>
          </div>
        </div>
      )}
    </div>
  );
}
