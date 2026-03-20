import { cn } from '../../utils/helpers';

const Tabs = ({ tabs, activeTab, onChange }) => (
  <div className="flex gap-1 bg-dark-800 border border-dark-700 rounded-lg p-1">
    {tabs.map((tab) => (
      <button key={tab.value} onClick={() => onChange(tab.value)}
        className={cn(
          'px-4 py-2 rounded-md text-sm font-medium transition-colors',
          activeTab === tab.value ? 'bg-primary-500/20 text-primary-400' : 'text-dark-400 hover:text-dark-200 hover:bg-dark-700'
        )}
      >
        {tab.icon && <span className="mr-2">{tab.icon}</span>}
        {tab.label}
        {tab.count !== undefined && (
          <span className="ml-2 bg-dark-600 px-1.5 py-0.5 rounded text-xs">{tab.count}</span>
        )}
      </button>
    ))}
  </div>
);

export default Tabs;