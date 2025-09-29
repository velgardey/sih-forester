import Link from 'next/link';
import Image from 'next/image';
import waterfall from '../../public/images/waterfall_gif.gif';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-5">
      <div className="flex items-center max-w-4xl w-full p-10 relative flex-col md:flex-row">
        
        {/* Left Section: Image */}
        <div className="flex-1 mb-10 md:mb-0 md:mr-10 text-center">
          <Image
            src={waterfall}
            alt="Custom Maze Graphic"
            width={250}
            height={250}
            className="mx-auto"
          />
        </div>

        {/* Right Section: Text and Button */}
        <div className="flex-1 text-left">
          <h1 className="text-[6rem] font-bold text-green-600 mb-2">404</h1>
          <p className="text-2xl text-gray-800 mb-4">
            Looks like you are in a maze.
          </p>
          <p className="text-gray-600 mb-6">
            Use the keyboard to control the ball to maze exit to return to the home, or
          </p>
          <Link href="/">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md text-lg transition-colors">
              Go back Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
