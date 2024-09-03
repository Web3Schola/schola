export function Intro() {
  return (
    <section className="flex-col md:flex-row flex items-center md:justify-between mt-16 mb-16 md:mb-12">
      <h1 className="text-3xl md:text-5xl font-bold tracking-tighter leading-tight md:pr-8">
        Build your online academy with Schola.
      </h1>
      <h4 className="text-center md:text-left text-lg mt-5 md:pl-8">
        A modular framework for continous education built on{" "}
        <a
          href="https://vara.network/"
          className="underline hover:text-blue-600 duration-200 transition-colors"
        >
          VARA Network
        </a>
      </h4>
    </section>
  );
}
