import WorkCard from "./WorkCard";
import Image from 'next/image';
import RobotIcon from '../../../public/robot.svg';
import DocumentIcon from '../../../public/document.svg';
import MapInfo from '../../../public/mapInfo.svg';
import GovtIcon from '../../../public/govt.svg';

const HowItWorksSection = () => {
  return (
    <section className="py-20 sm:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
          How it works?
        </h2>
        <div className="w-24 h-1 bg-green-600 mx-auto mb-16"></div>

        <div className="flex flex-col md:flex-row justify-center items-start md:items-center space-y-12 md:space-y-0 md:space-x-8 relative">
          
          {/* Step 1 Card */}
          <div className="w-full md:w-1/3 flex flex-col items-center">
            <WorkCard
              illustration={
                <div className="flex items-center justify-center p-4">
                  <Image
                    src={RobotIcon}
                    alt="Robot"
                    className="w-24 h-24"
                  />
                  <Image
                    src={DocumentIcon}
                    alt="Document"
                    className="w-20 h-20 -ml-8"
                  />
                </div>
              }
              title="Step 1"
              description="Get your legacy document verified by our AI powered DOC verification system."
              borderColor="border-green-400"
            />
          </div>
          
          {/* Arrow 1 */}
          <div className="hidden md:block absolute top-1/2 left-1/3 -mt-4 transform -translate-x-1/2">
             <svg width="150" height="50" viewBox="0 0 150 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 25 C 40 5, 110 5, 145 25" stroke="#4CAF50" strokeWidth="2" fill="none" strokeDasharray="5,5"/>
                <circle cx="5" cy="25" r="4" fill="#4CAF50" />
            </svg>
          </div>

          {/* Step 2 Card */}
           <div className="w-full md:w-1/3 flex flex-col items-center">
            <WorkCard
              illustration={
                <div className="p-4">
                  <Image
                    src={MapInfo}
                    alt="Map Info"
                    className="w-48 h-32"
                  />
                </div>
              }
              title="Step 2"
              description="Get instant FRA Atlas of your land and information of social assets (ponds, lakes etc)."
              borderColor="border-green-400"
            />
           </div>

           {/* Arrow 2 */}
           <div className="hidden md:block absolute top-1/2 right-1/3 -mt-4 transform translate-x-1/2 rotate-180">
            <svg width="150" height="50" viewBox="0 0 150 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 25 C 40 45, 110 45, 145 25" stroke="#4CAF50" strokeWidth="2" fill="none" strokeDasharray="5,5"/>
                <circle cx="145" cy="25" r="4" fill="#4CAF50" />
            </svg>
          </div>

          {/* Step 3 Card */}
          <div className="w-full md:w-1/3 flex flex-col items-center">
            <WorkCard
              illustration={
                <div className="p-4">
                  <Image
                    src={GovtIcon}
                    alt="Government"
                    className="w-48 h-32"
                  />
                </div>
              }
              title="Step 3"
              description="Be eligible for various government schemes based on your land specifications."
              borderColor="border-green-400"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
