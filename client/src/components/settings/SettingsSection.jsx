const SettingsSection = ({ title, description, children }) => (
  <div className="card mb-6">
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {description && (
        <p className="text-dark-400 text-sm mt-1">{description}</p>
      )}
    </div>
    {children}
  </div>
);

export default SettingsSection;