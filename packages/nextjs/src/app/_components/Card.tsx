import React from "react";

const Card = () => {
  return (
    <div className="grid grid-cols-2 mb-28">
      <div className="card bg-base-100 w-96 shadow-xl">
        <figure className="px-10 pt-10">
          <img src="/favicon/trivia.jpg" alt="Shoes" className="rounded-xl" />
        </figure>
        <div className="card-body items-center text-center">
          <a href="/create-new">
            <button className="btn btn-lg mt-10 bg-teal-400 rounded mb-5 ">
              <h2>Create new trivia</h2>
            </button>
          </a>
        </div>
      </div>
      <div>
        <div className="card bg-base-100 w-96 shadow-xl">
          <figure className="px-10 pt-10">
            <img
              src="/favicon/trivia-1.jpg"
              alt="Shoes"
              className="rounded-xl"
            />
          </figure>
          <div className="card-body items-center text-center">
            <a href="/play-new">
              <button className="btn btn-lg mt-10 bg-teal-400 rounded mb-5 ">
                <h2>Play new trivia</h2>
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
