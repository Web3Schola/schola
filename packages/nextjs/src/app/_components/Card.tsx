import React from "react";
import Image from "next/image";

export function Card() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-28">
      {" "}
      {/* Ajusta la grilla para dispositivos móviles */}
      <div className="card bg-gray-500 w-full md:w-96 shadow-xl">
        {" "}
        {/* Ajusta el ancho en pantallas pequeñas */}
        <figure className="px-10 pt-10">
          <Image
            src="/favicon/t-1.jpg"
            alt="Shoes"
            className="rounded-xl"
            width={300}
            height={200}
          />
        </figure>
        <div className="card-body items-center text-center">
          <a href="/create-new">
            <button className="btn btn-lg mt-10 btn-glass mb-5">
              Create new trivia
            </button>
          </a>
        </div>
      </div>
      <div className="card bg-gray-500 w-full md:w-96 shadow-xl">
        {" "}
        {/* Ajusta el ancho en pantallas pequeñas */}
        <figure className="px-10 pt-10">
          <Image
            src="/favicon/t-2.jpg"
            alt="Shoes"
            className="rounded-xl"
            width={300}
            height={200}
          />
        </figure>
        <div className="card-body items-center text-center">
          <a href="/play-new">
            <button className="btn btn-lg mt-10 bg-glass btn-rounded mb-5">
              <h2>Play new trivia</h2>{" "}
              {/* Considera usar un tamaño de texto más adecuado para móviles */}
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
