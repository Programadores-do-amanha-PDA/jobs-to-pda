import React from "react";
import ReactDOM from "react-dom/client";
import { IconSvg } from "../../../components/icons/icon-svg";

interface LinkedinButtonProps {
  onClick?: () => void;
}

export const LinkedinButton: React.FC<LinkedinButtonProps> = ({ onClick }) => {
  return (
    <button
      id="job-to-pda"
      className="jobs-apply-button artdeco-button artdeco-button--2 artdeco-button--primary ember-view ml2 bg-[#eddc11]! hover:bg-[#ddcc10]! text-zinc-600! hover:text-zinc-700! h-full flex items-center"
      onClick={onClick}
      type="button"
    >
      <span
        dangerouslySetInnerHTML={{ __html: IconSvg }}
        style={{
          display: "flex",
          alignItems: "center",
        }}
      />
      <span className="artdeco-button__text">Salvar</span>
    </button>
  );
};

// Helper function to render the React component into a DOM element
export const createLinkedinButton = (onClick?: () => void): HTMLElement => {
  const container = document.createElement("div");
  container.setAttribute("data-pda-button", "true");

  const root = ReactDOM.createRoot(container);
  root.render(<LinkedinButton onClick={onClick} />);

  return container;
};
