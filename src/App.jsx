import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { ThemeProvider, AuthProvider } from './context/AppContext';
import AppRoutes from './routes/AppRoutes';

// The entire design system lives in this one component (a <style> tag
// built from a template string) instead of separate .css files, so
// every page/component still gets the same styling as before.
import GlobalStyles from './styles/GlobalStyles';

export function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <GlobalStyles />
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
