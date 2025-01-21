import Primary from "./component/Primary";
import Update from "./component/Update";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotificationApp from "./component/NotificationApp";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Primary />,
  },
  {
    path: "/update/:id",
    element: <Update />,
  },
]);
const App = () => {
  return (
    <div>
      <RouterProvider router={router}></RouterProvider>
      <NotificationApp />
    </div>
  );
};

export default App;
