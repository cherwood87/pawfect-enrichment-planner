import React from 'react';

const PillarPreview_Grid: React.FC = () => {
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-screen-lg mx-auto">
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Personalized Just for Your Dog
            </h3>
            <p className="text-gray-600 mb-6">
              Not every dog needs the same thing. Our personality quiz helps determine which pillars 
              your dog values most, so you can focus your energy where it matters.
            </p>
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-orange-100 rounded-full px-6 py-3">
              <span className="text-sm font-medium text-gray-700"> Take the quiz → Get custom plan → Track progress → Happy dog! </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PillarPreview_Grid;