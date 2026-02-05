import { NavigateFunction } from "react-router-dom";

export const handleAddProject = (navigate: NavigateFunction) => {
  navigate("/project/create");
};