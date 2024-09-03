"use client";

import { Wallet } from "./wallet";
import Image from "next/image";

export default function Navbar() {
  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a href="/posts/intro">About</a>
            </li>
            <li>
              <a href="">Demo</a>
            </li>
            <li>
              <a href="">Get started</a>
            </li>
          </ul>
        </div>
        <a href="/" className="btn btn-ghost normal-case text-xl">
          <Image src="/navbar-logo.jpeg" height={50} width={50} alt="logo" />
          Schola.
        </a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a href="/posts/intro">About</a>
          </li>
          <li>
            <a href="">Demo</a>
          </li>
          <li>
            <a href="">Get started</a>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <Wallet />
      </div>
    </div>
  );
}
