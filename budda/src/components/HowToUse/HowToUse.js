import ProgressRightImg from "../../asset/img/ProgressRightImg.png";
import "./HowToUse.css";
function HowToUse() {
  return (
    <div>
      <div className="show_progress">
        <div className="show_progress_content">
          <h4 className="h4">Find recipes</h4>
          <h6 className="h6">
            <p>Choose from numerous recipes for all</p>
            preferences and diets
          </h6>
        </div>
        <div className="show_progress_content">
          <h4 className="h4">Order ingredients online</h4>
          <h6 className="h6">
            <p>Partner supermarkets supply the ingredients</p>
            for the selected recipes at no extra charge
          </h6>
        </div>
        <div className="show_progress_content">
          <h4 className="h4">Cook and enjoy</h4>
          <h6 className="h6">
            <p>Cook recipes with simple step-by-step</p>
            instructions
          </h6>
        </div>
        <img
          src={ProgressRightImg}
          className="ProgressRightImg"
          alt="Progress Illustration"
        />
        <div className="show_progress_btn"></div>
      </div>
    </div>
  );
}

export default HowToUse;
