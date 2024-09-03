export default function Subscribe() {
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Try now!</h1>
          <p className="py-6">
            Launch your online course empire today! Our platform provides all
            the tools you need to create, market, and sell your expertise.
            Whether you&apos;re a seasoned educator or just starting out, we
            make it easy to turn your knowledge into a thriving online business.
            Don&apos;t wait — start monetizing your skills now!
          </p>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <form className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="email"
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="name"
                placeholder="name"
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary">Book demo</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
