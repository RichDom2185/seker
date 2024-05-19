import React from "react";
import { Provider } from "react-redux";
import EditorPage from "./pages/EditorPage";
import { store } from "./redux/store";

import "./App.css";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <EditorPage />
    </Provider>
  );
};

export default App;
