import React from "react";
import ReactDOM from "react-dom/client";
import VideoComponent from "./VideoComponent.jsx";
import AddForm from "./AddForm.jsx";
import VideoList from "./VideoList.jsx";

function App() {
       const AppHtml = (
              <>
                     <header>
                            <h2>Cheap YouTube</h2>
                            <AddForm />
                     </header>
                     <VideoComponent />
                     <VideoList />
              </>
       );
       return AppHtml;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);