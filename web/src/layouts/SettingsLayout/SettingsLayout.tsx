import { NavLink, routes } from '@redwoodjs/router';

import { Separator } from 'src/components/ui/separator';

type SettingLayoutProps = {
  children?: React.ReactNode;
};

const SettingLayout = ({ children }: SettingLayoutProps) => {
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
        <Separator />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="lg:w-1/5">
            <nav className="flex flex-col space-y-1">
              <NavLink
                to={routes.accountSettings()}
                role="button"
                activeClassName="flex items-center justify-start rounded-md bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50"
                className="flex items-center justify-start rounded-md px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-900"
              >
                Account
              </NavLink>
              <NavLink
                to={routes.languageSettings()}
                role="button"
                activeClassName="flex items-center justify-start rounded-md bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50"
                className="flex items-center justify-start rounded-md px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-900"
              >
                Language
              </NavLink>
              {/* <button
                onClick={() => setActiveTab('notifications')}
                className={`flex items-center justify-start rounded-md px-3 py-2 text-sm font-medium ${
                  activeTab === 'notifications'
                    ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50'
                    : 'text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-900'
                }`}
              >
                Notifications
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className={`flex items-center justify-start rounded-md px-3 py-2 text-sm font-medium ${
                  activeTab === 'privacy'
                    ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50'
                    : 'text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-900'
                }`}
              >
                Privacy
              </button>
              <button
                onClick={() => setActiveTab('appearance')}
                className={`flex items-center justify-start rounded-md px-3 py-2 text-sm font-medium ${
                  activeTab === 'appearance'
                    ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50'
                    : 'text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-900'
                }`}
              >
                Appearance
              </button>
              <button
                onClick={() => setActiveTab('integrations')}
                className={`flex items-center justify-start rounded-md px-3 py-2 text-sm font-medium ${
                  activeTab === 'integrations'
                    ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50'
                    : 'text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-900'
                }`}
              >
                Integrations
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`flex items-center justify-start rounded-md px-3 py-2 text-sm font-medium ${
                  activeTab === 'about'
                    ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50'
                    : 'text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-900'
                }`}
              >
                About
              </button> */}
            </nav>
          </aside>
          <div className="flex-1 lg:max-w-3xl">
            {children}
            {/* {activeTab === 'account' && <AccountSettings />}
            {activeTab === 'notifications' && <NotificationSettings />}
            {activeTab === 'privacy' && <PrivacySettings />}
            {activeTab === 'appearance' && <AppearanceSettings />}
            {activeTab === 'integrations' && <IntegrationSettings />}
            {activeTab === 'about' && <AboutSettings />} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingLayout;
