import React from "react";
import Image from "next/image";

export function Card() {
  const steps = [
    {
      title: "Create learning material",
      subtitle: "Write as many Markdown files as you like.",
      image: "/images/t-1.jpg",
      buttonText: "Write yours",
      link: "/define-modules",
    },
    {
      title: "Feed your own AI oracle",
      subtitle: "Train a RAG so you users have an expert 24/7.",
      image: "/images/t-2.jpg",
      buttonText: "Feed materials",
      link: "/create-oracle",
    },
    {
      title: "Create multiple trivias and set rewards",
      subtitle:
        "Support your learning objectives and incentivize participants.",
      image: "/images/t-3.jpg",
      buttonText: "Create trivia",
      link: "/create-trivia",
    },
    {
      title: "Users play the trivia",
      subtitle: "Users can take rewards and mint their Proof of Knowledge.",
      image: "/images/t-4.jpg",
      buttonText: "Play trivia",
      link: "/play-trivia",
    },
  ];

  return (
    <div className="container mx-auto px-4 mb-28">
      <ul className="steps steps-vertical lg:steps-horizontal w-full mb-10">
        {steps.map((step, index) => (
          <li
            key={index}
            className={`step ${index === 0 ? "step-primary" : ""}`}
          >
            {step.title}
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <div key={index} className="card shadow-xl">
            <figure className="px-6 pt-6">
              <Image
                src={step.image}
                alt={step.title}
                className="rounded-xl"
                width={300}
                height={200}
              />
            </figure>
            <div className="card-body items-center text-center">
              <h3 className="card-title text-lg mb-4">{step.subtitle}</h3>
              <a href={step.link}>
                <button className="btn btn-primary btn-md mt-4">
                  {step.buttonText}
                </button>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
