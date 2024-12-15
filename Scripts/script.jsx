import React from "react";
import ReactDOM from "react-dom/client";
import VideoComponent from "./VideoComponent.jsx";
import AddForm from "./AddForm.jsx";

function App() {
       const AppHtml = (
              <>
                     <header>
                            <h2>Cheap YouTube</h2>
                            <AddForm />
                     </header>
                     <VideoComponent />
                     <aside>
                            <div className="extraVidHeader">
                                   <span>More Videos</span>
                                   {/* <!-- Add a different symbol --> */}
                                   <a href="#" ><i className="fa fa-plus"></i></a>
                            </div>
                            <div className="extraVidBody"></div>
                     </aside>
              </>
       );
       return AppHtml;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);