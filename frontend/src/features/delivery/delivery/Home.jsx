// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function DeliveryHome() {
  const services = [
    {
      title: "Weekly & Monthly Reports",
      desc: "Keep track of your deliveries with detailed weekly and monthly reports to optimize your business.",
    },
    {
      title: "Order Management",
      desc: "Organize, update, and monitor all your orders efficiently from a single platform.",
    },
    {
      title: "User-Friendly Interface",
      desc: "An intuitive and easy-to-use interface designed for smooth navigation and quick operations.",
    },
  ];

  return (
    <div className="flex min-h-screen bg-white">
      {/* Main Content */}
      <div className="flex-1 px-6 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            Welcome to <span className="text-blue-600">QWIKKO Delivery</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-12">
            Our delivery platform is designed to make your business faster,
            smarter, and more organized. Here’s what we offer to help you
            succeed:
          </p>
        </motion.div>

        {/* Services */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {services.map((service, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition"
            >
              <h3 className="text-xl font-bold text-blue-600 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {service.desc}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
