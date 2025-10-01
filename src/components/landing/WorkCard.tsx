const WorkCard = ({ illustration, title, description, borderColor } : any) => {
  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 text-center w-full max-w-sm transform hover:scale-105 transition-transform duration-300 border-2 ${borderColor}`}>
        <div className="flex justify-center items-center h-40 mb-4">
            {illustration}
        </div>
      <p className="text-gray-600 leading-relaxed">
        {description.split(' ').map((word: any, index: any) => {
            if(['legacy', 'document', 'AI', 'powered', 'DOC', 'FRA', 'Atlas', 'government', 'schemes'].includes(word)){
                return <strong key={index} className="text-gray-800">{word} </strong>
            }
            return word + ' ';
        })}
        </p>
    </div>
  );
};

export default WorkCard;