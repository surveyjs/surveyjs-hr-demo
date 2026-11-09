export default function SurveyOutlineLabel({ label = "SurveyJS renders this" }) {
  return (
    <button
      type="button"
      data-survey-outline-dismiss=""
      aria-label={`${label}. Hide SurveyJS Outlines`}
      lang="en"
      onClick={(event) => {
        event.stopPropagation();
        document.dispatchEvent(new Event("survey-outlines-dismiss"));
      }}
    >
      {["top", "right", "bottom", "left"].map((edge) => (
        <span key={edge} data-survey-outline-edge={edge} aria-hidden="true" />
      ))}
      <span data-survey-outline-label="">{label}</span>
    </button>
  );
}
