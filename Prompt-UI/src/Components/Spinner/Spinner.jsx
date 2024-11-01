

const Spinner = () => (
    <div className="flex flex-col justify-center items-center h-full">
        {/* // fixed spinner to include a gap */}
      <div 
        className="animate-spin w-8 h-8 border-4 border-t-transparent border-b-transparent border-gray-500 rounded-full mb-4" 
        role="status"
      ></div>
      <span className="visually-hidden">Loading...</span>
    </div>
  );
  

export default Spinner;
