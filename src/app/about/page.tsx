import Image from "next/image";
import { Award, Users, Leaf, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            About New Star Jaggery
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We are a Myanmar-based family business dedicated to preserving
            traditional jaggery-making methods while delivering the highest
            quality organic products to our customers in Myanmar and beyond.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Story
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                U Win Myint first created the brand "One Star" with its original
                logo in his village, operating in Bagan–Nyaung U and Yangon,
                Myanmar. In 2024, he rebranded the business to "New Star" with a
                refreshed logo, continuing operations in the village, Bagan–Nyaung U,
                and Yangon, and expanding to many other cities across Myanmar.
              </p>
              <p>
                Our journey began with a simple mission: to bring the authentic
                taste and nutritional benefits of pure Myanmar jaggery to every
                household. We believe that traditional methods, when combined
                with modern quality standards, create products that are not only
                delicious but also beneficial for health.
              </p>
              <p>
                Today, under the leadership of U Win Myint and Ko Aung Kyaw Min,
                we continue to honor our Myanmar heritage while embracing
                innovation, ensuring that every product that leaves our facility
                in AungMyaeThar 4 Street meets the highest standards of quality
                and purity.
              </p>
            </div>
          </div>
          <div className="relative">
            <Image
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsDu69p2xb1HBoF4nEIxGAC808wcBUstTY0w&s"
              alt="Traditional Jaggery Making in Myanmar"
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Values
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
            The principles that guide everything we do at New Star Jaggery
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Leaf,
                title: "Natural & Organic",
                text: "We use only natural ingredients and organic farming practices to ensure the purest quality jaggery.",
              },
              {
                icon: Award,
                title: "Quality First",
                text: "Every product undergoes rigorous quality checks to meet our high standards before reaching customers.",
              },
              {
                icon: Users,
                title: "Customer Focus",
                text: "Our customers are at the heart of everything we do. We strive to exceed their expectations every day.",
              },
              {
                icon: Heart,
                title: "Traditional Heritage",
                text: "We preserve and honor traditional jaggery-making methods passed down through generations.",
              },
            ].map((value, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-gray-900 text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Process
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
            From farm to your table - how we create our premium jaggery products
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Source Selection",
                text: "We carefully select the finest sugarcane and palm sap from certified organic farms.",
              },
              {
                step: "2",
                title: "Traditional Processing",
                text: "Using age-old techniques, we extract and process the juice to create pure jaggery.",
              },
              {
                step: "3",
                title: "Quality Testing",
                text: "Every batch undergoes comprehensive testing to ensure purity, quality, and safety.",
              },
              {
                step: "4",
                title: "Packaging & Delivery",
                text: "Products are carefully packaged and delivered fresh to maintain quality and taste.",
              },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-amber-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-gray-900 text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-amber-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          {[
            { stat: "30+", label: "Years of Experience" },
            { stat: "10,000+", label: "Happy Customers" },
            { stat: "50+", label: "Product Varieties" },
            { stat: "100%", label: "Organic Products" },
          ].map((item, idx) => (
            <div key={idx}>
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {item.stat}
              </div>
              <div className="text-xl">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Leadership Team
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
            Meet the people behind New Star Jaggery&apos;s success
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "U Win Myint",
                title: "Founder & Owner",
                bio: "U Win Myint founded New Star Jaggery in 1990 with the vision of bringing authentic Myanmar jaggery to every household. With over 30 years of experience in traditional jaggery making, he upholds time-honored methods while ensuring the highest standards of quality. Through his dedication and leadership, he has built a trusted brand that preserves Myanmar’s heritage while sharing its natural sweetness with wider communities.",
                image: "https://firebasestorage.googleapis.com/v0/b/chatbox-604ac.appspot.com/o/0-02-06-176e21c1e6150c0d3694c4eb5c9b4d89c9620f1155a280d2bda27c44f91c7275_69d80076770ec53c.jpg?alt=media&token=e17cc986-7058-4d41-8beb-89dec96b21a2",
              },
              {
                name: "Ko Aung Kyaw Min",
                title: "Co-Owner & Manager",
                bio: "Ko Aung Kyaw Min, a Physics graduate from Mandalay University, serves as co-owner and manager of New Star Jaggery. He brings modern business practices while honoring traditional values, ensuring smooth day-to-day operations. Recognized for his patience and strong communication skills, he leads the team with dedication and builds lasting relationships with partners and customers, helping the business grow while staying true to its commitment to quality and authenticity.",
                image: "https://firebasestorage.googleapis.com/v0/b/chatbox-604ac.appspot.com/o/0-02-06-7c3a9e2dc77553aa94ffc90a17d92b3f00827aaef847adf5a1ef4673f14991cf_8ecc1a348abeb625.jpg?alt=media&token=c28cacc8-bfec-41ee-8058-c998c43f6a06",
              },
            ].map((person, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition duration-300"
              >
                <div className="w-full relative mb-6 rounded-xl overflow-hidden group">
                  <Image
                    src={person.image}
                    alt={person.name}
                    width={800}
                    height={1000}
                    className="rounded-xl object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-1">
                  {person.name}
                </h3>
                <p className="text-base text-amber-600 mb-4 font-semibold tracking-wide uppercase">
                  {person.title}
                </p>
                <p className="text-gray-700 leading-relaxed text-justify">
                  {person.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 text-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              To provide the highest quality organic jaggery products while
              preserving traditional Myanmar methods and supporting sustainable
              farming practices. We aim to make healthy, natural sweeteners
              accessible to everyone in Myanmar while maintaining the authentic
              taste and nutritional benefits of pure Myanmar jaggery.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Our Vision
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              To become the leading brand in organic jaggery products in Myanmar
              and Southeast Asia, known for our commitment to quality,
              tradition, and customer satisfaction. We envision a world where
              people choose natural, healthy alternatives to refined sugar, and
              we want to be their trusted partner in Myanmar and beyond.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
