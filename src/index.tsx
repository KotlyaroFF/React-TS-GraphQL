import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import { ApolloProvider } from "@apollo/client";
import App from "./App";
import AuthProvider from "./components/AuthProvider/AuthProvider";
import reportWebVitals from "./reportWebVitals";
import { client } from "./graphql/client";
import WorkspaceDataProvider from "./components/WorkspaceDataProvider/WorkspaceDataProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <AuthProvider>
        <WorkspaceDataProvider>
          <App />
        </WorkspaceDataProvider>
      </AuthProvider>
    </ApolloProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
