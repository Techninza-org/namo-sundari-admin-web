const NotFoundPage = () => {
    return (
      <section className="bg-gray-900 h-screen flex items-center justify-center">
        <div className="text-center max-w-screen-sm">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-white">404</h1>
          <p className="mb-4 text-3xl tracking-tight font-bold md:text-4xl text-white">
            Page not found currently
          </p>
          <p className="mb-4 text-lg font-light text-gray-300">
            Sorry, we can&apos;t find such page.
          </p>
          <button
            type="button"
            className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-1 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
            onClick={() => window.location.href = '/'}
          >
            Back To Home
          </button>
        </div>
      </section>
    );
  };
  
  export default NotFoundPage;
  