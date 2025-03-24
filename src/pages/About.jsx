export default function About() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header Section */}
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-blue-600 mb-4">About Us</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          A lakeside retreat in the heart of Ukkohalla, Finland. Experience nature, adventure, and relaxation.
        </p>
      </div>

      {/* About Section */}
      <section className="mt-12 bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-blue-500 mb-4">Our Story</h2>
        <p className="text-gray-700 leading-relaxed">
        Inspired by the tranquil landscapes of Hyrynsalmi and the rich Finnish tradition of lakeside retreats, Lomakylä Rakkaranta was 
        created to provide guests with an authentic Finnish experience. Our commitment to excellence is reflected in our 
        meticulously designed cabins, each offering panoramic views of Syväjärvi and the surrounding ski slopes.
        </p>
      </section>

      {/* Accommodations Section */}
      <section className="mt-12">
        <h2 className="text-3xl font-semibold text-blue-500 mb-6 text-center">Our Cabins</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Cabin Card */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-gray-800">Lentäjän Poika 1</h3>
            <p className="text-gray-600">A cozy retreat for couples or small families, with lake and ski slope views.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-gray-800">Lentäjän Poika 2</h3>
            <p className="text-gray-600">Features a separate lakeside sauna with a traditional wood-burning stove.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-gray-800">Henry Ford Cabin</h3>
            <p className="text-gray-600">A rustic yet modern space, inspired by Henry Ford’s innovative spirit.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-gray-800">Beach House</h3>
            <p className="text-gray-600">Luxury at its finest, with breathtaking views of the lake and northern lights.</p>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="mt-12">
        <h2 className="text-3xl font-semibold text-blue-500 mb-6 text-center">Amenities</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
            <span className="text-blue-500 text-3xl">🧖‍♂️</span>
            <p className="text-gray-600"><strong>Lakeside Sauna:</strong> Relax with stunning panoramic views.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
            <span className="text-blue-500 text-3xl">💪</span>
            <p className="text-gray-600"><strong>Fitness Facilities:</strong> Stay active with our modern gym.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
            <span className="text-blue-500 text-3xl">🧺</span>
            <p className="text-gray-600"><strong>Laundry Services:</strong> Convenient washing and drying facilities.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
            <span className="text-blue-500 text-3xl">⚡</span>
            <p className="text-gray-600"><strong>EV Charging:</strong> Charge your electric vehicle with ease.</p>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="mt-12 bg-blue-50 p-8 rounded-lg">
        <h2 className="text-3xl font-semibold text-blue-600 mb-4 text-center">Location & Activities</h2>
        <p className="text-gray-700 text-center max-w-2xl mx-auto">
          We are located near the Ukkohalla Ski Resort, offering exciting winter and summer activities.
        </p>
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-gray-800">Winter Activities</h3>
            <p className="text-gray-600">Enjoy skiing, snowboarding, and scenic snowshoeing trails.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-gray-800">Summer Activities</h3>
            <p className="text-gray-600">Explore hiking trails, go swimming, or relax by the lakeside beach.</p>
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="mt-12 text-center">
        <h2 className="text-3xl font-semibold text-blue-500">Our Commitment</h2>
        <p className="text-gray-700 mt-4 max-w-3xl mx-auto">
          We are dedicated to providing an exceptional guest experience with personalized services to make your stay memorable.
        </p>
        <p className="text-gray-700 mt-4 text-sm italic">
          *For more information or to book your stay, please visit our website.*
        </p>
      </section>
    </div>
  );
}
