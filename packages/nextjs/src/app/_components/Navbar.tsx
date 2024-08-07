"use ";
import React from "react";

const Navbar = () => {
  return (
    <section className="flex bg-transparent h-20 items-center  gap-5 px-5 mb">
      <a href="/">
        <img src="" alt="" className="h-20 " />
      </a>
      <div className="flex-none  ">
        <button className="btn btn-square btn-ghost">
          <svg
            xmlns="/app/page.tsx"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-5 w-5 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </div>
      <div className="flex justify-center w-full text-xl">
        <ul className="flex gap-5">
          <li>
            <a href="/posts/intro">About</a>
          </li>
          <li>
            <a href="">Demo</a>
          </li>
          <li>
            <a href="">Get stared</a>
          </li>
        </ul>
      </div>
      <div className="flex-none  ">
        <button className="btn btn-outline bg-slate-400 rounded gap-x-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 2a10 10 0 1 0 0 20a10 10 0 0 0 0-20z"
            />
          </svg>
          conect wallet
        </button>
      </div>
    </section>
  );
};

export default Navbar;
