import React from 'react';
import { 
  Calendar,
  Clock,
  Bell,
  Users,
  FileSpreadsheet,
  Shield
} from 'lucide-react';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  imageUrl: string;
  reverse?: boolean;
}

const FeatureSection: React.FC<FeatureProps> = ({ 
  icon, 
  title, 
  description, 
  imageUrl, 
  reverse = false 
}) => {
  return (
    <div className="py-16 border-b border-gray-100 last:border-0">
      <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center`}>
        <div className="lg:w-1/2 mb-10 lg:mb-0 lg:px-8">
          <div className="max-w-lg mx-auto">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                {icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
            </div>
            <p className="text-lg text-gray-600 mb-6">{description}</p>
          </div>
        </div>
        <div className="lg:w-1/2">
          <div className={`transform transition-transform duration-300 hover:scale-105 shadow-xl rounded-xl overflow-hidden ${reverse ? 'lg:mr-8' : 'lg:ml-8'}`}>
            <div className="h-4 bg-gradient-to-r from-blue-500 to-purple-600"></div>
            <img 
              src={imageUrl} 
              alt={title} 
              className="w-full h-auto object-cover" 
              style={{ maxHeight: '400px' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Features: React.FC = () => {
  const features = [
    {
      icon: <Calendar className="h-6 w-6 text-blue-600" />,
      title: "Roster Schedule Access",
      description: "View your upcoming shifts, breaks, and schedule details in an easy-to-read format.",
      imageUrl: "https://images.pexels.com/photos/3243090/pexels-photo-3243090.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      icon: <FileSpreadsheet className="h-6 w-6 text-blue-600" />,
      title: "Admin Roster Management",
      description: "Efficiently manage and update team schedules with our intuitive admin interface.",
      imageUrl: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      reverse: true
    },
    {
      icon: <Bell className="h-6 w-6 text-blue-600" />,
      title: "Schedule Notifications",
      description: "Receive important updates about schedule changes and upcoming shifts.",
      imageUrl: "https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    }
  ];

  const additionalFeatures = [
    {
      icon: <Clock className="h-5 w-5 text-blue-600" />,
      title: "Shift Tracking",
      description: "Keep track of your working hours and breaks."
    },
    {
      icon: <Users className="h-5 w-5 text-blue-600" />,
      title: "Team View",
      description: "See who you're working with on your shifts."
    },
    {
      icon: <Shield className="h-5 w-5 text-blue-600" />,
      title: "Secure Access",
      description: "Role-based access control for data security."
    }
  ];

  return (
    <section id="features" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Features</h2>
          <p className="max-w-2xl mx-auto text-xl text-gray-600">
            Everything you need to manage your work schedule effectively.
          </p>
        </div>

        <div className="space-y-8">
          {features.map((feature, index) => (
            <FeatureSection
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              imageUrl={feature.imageUrl}
              reverse={feature.reverse}
            />
          ))}
        </div>

        <div className="mt-24 grid md:grid-cols-3 gap-8">
          {additionalFeatures.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-blue-100"
            >
              <div className="p-3 bg-blue-50 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;