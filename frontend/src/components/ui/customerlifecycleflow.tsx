const Diagram = () => {
  const steps = [
    { title: "Awareness", description: "Create awareness through marketing" },
    { title: "Engagement", description: "Nurture leads through targeted contact" },
    { title: "Consideration", description: "Focus on communicating value-add" },
    { title: "Conversion", description: "Convert users to clean stoves" },
    { title: "Retention", description: "Turn new users into dedicated power users" },
    { title: "Loyalty", description: "Incentivize power users to refer new users" },
  ];

  return (
    <div className="flex items-center overflow-auto" style={{ width: "100%", height: "auto" }}>
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-20 md:h-20 lg:w-20 lg:h-20 xl:w-20 xl:h-20 rounded-full flex flex-col items-center justify-center shadow-md">
              <h3 className="text-center text-[8px] sm:text-[8px] md:text-[8px] lg:text-[8px] xl:text-[8px] font-semibold">{step.title}</h3>
              <p className="text-center text-[6px] sm:text-[6px] md:text-[6px] lg:text-[6px] xl:text-[6px]">{step.description}</p>
            </div>
          </div>

          {index < steps.length - 1 && (
            <div className="text-blue-900 text-md font-bold">
              →
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Diagram;