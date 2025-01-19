import React from 'react';

const Features = () => {
  const features = [
    { title: 'Time Tracking', description: 'Easily track your work hours.' },
    { title: 'Insights', description: 'Gain valuable insights into your productivity.' },
    { title: 'Customizable', description: 'Tailor the app to your needs.' },
  ];

  return (
    <section id="features" className="features">
      <h2>Features</h2>
      <div className="feature-list">
        {features.map((feature, index) => (
          <div key={index} className="feature-item">
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
